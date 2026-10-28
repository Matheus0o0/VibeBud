import test from 'node:test'
import assert from 'node:assert/strict'
import { getBuildPose, partStart, partSlot } from '../src/lib/buildStory.ts'

const distance = (a, b) => Math.hypot(...a.map((n, i) => n - b[i]))

test('the unfinished project starts with its one loose part outside the socket', () => {
  const pose = getBuildPose(0)
  assert.deepEqual(pose.part, partStart)
  assert.equal(pose.holding, false)
  assert.equal(pose.seated, false)
  assert.ok(distance(pose.part, partSlot) > 0.5)
  assert.deepEqual(pose.extensions, [0, 0, 0])
})

test('the examined part stays in contact with the gripping hand', () => {
  for (let p = 0.32; p < 0.84; p += 0.005) {
    const pose = getBuildPose(p)
    assert.equal(pose.holding, true)
    assert.ok(distance(pose.part, [pose.hand[0], pose.hand[1] - 0.3, pose.hand[2]]) < 1e-9)
    assert.ok(distance(pose.hand, [-0.39, 1.88, 0]) < 1.04, 'hand must stay within the articulated arm reach')
  }
})

test('pick-up and release have no teleport or duplicate-position jump', () => {
  for (const boundary of [0.16, 0.32, 0.5, 0.6, 0.76, 0.84, 0.95]) {
    const before = getBuildPose(boundary - 0.00001)
    const after = getBuildPose(boundary + 0.00001)
    assert.ok(distance(before.hand, after.hand) < 0.001)
    assert.ok(distance(before.part, after.part) < 0.001)
  }
})

test('the completed gesture leaves the part in its socket and releases the hand', () => {
  const pose = getBuildPose(1)
  assert.deepEqual(pose.part, partSlot)
  assert.equal(pose.holding, false)
  assert.equal(pose.seated, true)
  assert.equal(pose.grip, 0)
  assert.deepEqual(pose.extensions, [1, 1, 1])
})

test('scrolling backwards produces the same pose, independent of history', () => {
  const forward = Array.from({ length: 101 }, (_, i) => getBuildPose(i / 100))
  for (let i = 100; i >= 0; i--) assert.deepEqual(getBuildPose(i / 100), forward[i])
  const mutable = getBuildPose(0)
  mutable.hand[0] = 99
  assert.notEqual(getBuildPose(0).hand[0], 99)
})

test('out-of-range scroll positions are clamped to stable endpoints', () => {
  assert.deepEqual(getBuildPose(-10), getBuildPose(0))
  assert.deepEqual(getBuildPose(10), getBuildPose(1))
  assert.deepEqual(getBuildPose(NaN), getBuildPose(0))
})
