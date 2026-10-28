export type Point3 = [number, number, number]
export const clamp01 = (p: number) => Math.min(1, Math.max(0, Number.isFinite(p) ? p : 0))
export const ease = (start: number, end: number, p: number) => { const t = clamp01((p - start) / (end - start)); return t * t * (3 - 2 * t) }
export const partStart: Point3 = [-0.25, 1.1, 0.68]
export const partSlot: Point3 = [0.25, 0.96, 0]
const rest: Point3 = [-0.26, 0.92, 0.14]
const grab: Point3 = [-0.25, 1.4, 0.68]
const examine: Point3 = [-0.22, 2.05, 0.63]
const aboveSlot: Point3 = [0.25, 1.66, 0.1]
const fitted: Point3 = [0.25, 1.26, 0]

function curve(a: Point3, b: Point3, control: Point3, t: number): Point3 {
  return a.map((v, i) => (1 - t) ** 2 * v + 2 * (1 - t) * t * control[i] + t ** 2 * b[i]) as Point3
}

// A reversible pose, not elapsed-time playback. The one held part changes ownership
// at contact and release; it never has a second copy at its original position.
export function getBuildPose(input: number) {
  const p = clamp01(input)
  let hand: Point3 = [...rest]
  if (p >= 0.16 && p < 0.32) hand = curve(rest, grab, [0.05, 1.65, 0.7], ease(0.16, 0.32, p))
  else if (p >= 0.32 && p < 0.5) hand = curve(grab, examine, [-0.05, 1.8, 0.92], ease(0.32, 0.5, p))
  else if (p >= 0.5 && p < 0.6) hand = [...examine]
  else if (p >= 0.6 && p < 0.76) hand = curve(examine, aboveSlot, [0.2, 2.15, 0.54], ease(0.6, 0.76, p))
  else if (p >= 0.76 && p < 0.84) hand = curve(aboveSlot, fitted, [0.25, 1.45, 0.05], ease(0.76, 0.84, p))
  else if (p >= 0.84 && p < 0.95) hand = curve(fitted, rest, [-0.07, 1.65, 0.5], ease(0.84, 0.95, p))
  const holding = p >= 0.32 && p < 0.84
  const part: Point3 = holding ? [hand[0], hand[1] - 0.3, hand[2]] : p >= 0.84 ? [...partSlot] : [...partStart]
  const examination = ease(0.32, 0.49, p) * (1 - ease(0.6, 0.8, p))
  const thinking = Math.sin(Math.PI * clamp01(p / 0.32))
  return {
    p, hand, part, holding, seated: p >= 0.84,
    grip: ease(0.29, 0.34, p) * (1 - ease(0.84, 0.89, p)),
    head: [0.14 + 0.2 * examination, 1.03 - 0.18 * examination, -0.17 * thinking + 0.08 * examination] as Point3,
    partRotation: examination * 0.19,
    focus: ease(0.36, 0.59, p) * (1 - ease(0.82, 0.9, p)),
    extensions: [0.84, 0.88, 0.92].map((start) => ease(start, start + 0.075, p)),
    action: p < 0.16 ? 'observing' : p < 0.32 ? 'reaching' : p < 0.6 ? 'examining' : p < 0.84 ? 'fitting' : 'building',
  }
}
