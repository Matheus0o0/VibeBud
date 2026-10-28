import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { getBuildPose, partSlot, partStart } from './buildStory'
import type { Point3 } from './buildStory'

export function createBuddyBuildScene(host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x0b0b0c, 0)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40)
  const target = new THREE.Vector3(0.1, 1.48, 0.08)
  const room = new RoomEnvironment()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(room, 0.04)
  scene.environment = environment.texture
  scene.environmentIntensity = 0.4
  room.dispose()
  pmrem.dispose()

  const graphite = new THREE.MeshStandardMaterial({ color: 0x111216, metalness: 0.57, roughness: 0.43 })
  const trim = new THREE.MeshStandardMaterial({ color: 0x060709, metalness: 0.5, roughness: 0.48 })
  const edge = new THREE.MeshStandardMaterial({ color: 0x292b30, metalness: 0.72, roughness: 0.36 })
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x020303, metalness: 0.25, roughness: 0.13, clearcoat: 1, clearcoatRoughness: 0.08 })
  const orange = new THREE.MeshBasicMaterial({ color: 0xff7900, toneMapped: false })
  const eyeMaterial = orange
  const moduleMaterial = new THREE.MeshStandardMaterial({ color: 0x292a2d, metalness: 0.6, roughness: 0.42 })
  const modulePanel = new THREE.MeshStandardMaterial({ color: 0x141517, metalness: 0.5, roughness: 0.35 })

  const key = new THREE.DirectionalLight(0xfff9f3, 2.4)
  key.position.set(-3, 6, 6)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 5, bottom: -4, near: 0.5, far: 20 })
  key.shadow.normalBias = 0.025
  key.shadow.bias = -0.0002
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xff6700, 3)
  rim.position.set(3, 4, -3)
  scene.add(rim)
  const fill = new THREE.DirectionalLight(0xffffff, 0.8)
  fill.position.set(0, 2, 7)
  scene.add(fill, new THREE.AmbientLight(0xffffff, 0.3))

  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D, position: Point3 = [0, 0, 0]) {
    const item = new THREE.Mesh(geometry, material)
    item.position.set(...position)
    item.castShadow = true
    item.receiveShadow = true
    parent.add(item)
    return item
  }
  function box(w: number, h: number, d: number, radius: number, material: THREE.Material, parent: THREE.Object3D, position: Point3 = [0, 0, 0]) {
    return mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material, parent, position)
  }
  function sphere(radius: number, material: THREE.Material, parent: THREE.Object3D, position: Point3) {
    return mesh(new THREE.SphereGeometry(radius, 24, 16), material, parent, position)
  }
  function ring(radius: number, thickness: number, material: THREE.Material, parent: THREE.Object3D, position: Point3) {
    return mesh(new THREE.TorusGeometry(radius, thickness, 10, 40), material, parent, position)
  }

  const shadow = mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.27 }), scene)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.055
  shadow.castShadow = false
  const base = mesh(new THREE.CylinderGeometry(2.75, 2.9, 0.1, 80), trim, scene, [0, 0, 0])
  base.scale.z = 0.65
  const platformRim = mesh(new THREE.CylinderGeometry(2.76, 2.77, 0.012, 80, 1, true), edge, scene, [0, 0.025, 0])
  platformRim.scale.z = 0.65

  const robot = new THREE.Group()
  robot.position.set(-1.05, 0.1, 0)
  scene.add(robot)
  box(1.02, 0.93, 0.66, 0.18, graphite, robot, [0, 1.49, 0])
  box(0.75, 0.63, 0.13, 0.13, trim, robot, [0, 1.5, 0.34])
  box(0.66, 0.46, 0.08, 0.08, graphite, robot, [0, 1.49, 0.41])
  box(0.34, 0.035, 0.025, 0.012, orange, robot, [0, 1.72, 0.46])
  for (const x of [-0.26, 0.26]) for (const y of [1.31, 1.62]) sphere(0.025, edge, robot, [x, y, 0.46])
  box(0.78, 0.33, 0.53, 0.12, trim, robot, [0, 0.96, 0])
  box(0.65, 0.11, 0.08, 0.03, edge, robot, [0, 1.02, 0.28])
  for (const sign of [-1, 1]) {
    sphere(0.14, edge, robot, [sign * 0.25, 0.85, 0])
    box(0.33, 0.43, 0.39, 0.09, graphite, robot, [sign * 0.25, 0.66, 0])
    sphere(0.14, trim, robot, [sign * 0.25, 0.46, 0.02])
    const knee = ring(0.087, 0.015, orange, robot, [sign * 0.25, 0.46, 0.14])
    knee.scale.y = 0.9
    box(0.31, 0.35, 0.35, 0.08, graphite, robot, [sign * 0.25, 0.29, 0.015])
    box(0.42, 0.2, 0.64, 0.09, graphite, robot, [sign * 0.25, 0.12, 0.12])
    box(0.19, 0.02, 0.025, 0.008, orange, robot, [sign * 0.25, 0.12, 0.445])
  }
  mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.16, 32), edge, robot, [0, 2.01, 0])
  const neckRing = ring(0.18, 0.016, orange, robot, [0, 2.07, 0])
  neckRing.rotation.x = Math.PI / 2
  const head = new THREE.Group()
  head.position.set(0, 2.13, 0)
  robot.add(head)
  box(1.39, 1.01, 0.98, 0.28, graphite, head, [0, 0.41, 0])
  box(1.22, 0.73, 0.075, 0.19, orange, head, [0, 0.38, 0.465])
  box(1.17, 0.68, 0.095, 0.18, glass, head, [0, 0.38, 0.495])
  box(0.78, 0.1, 0.54, 0.045, trim, head, [0, 0.91, -0.08])
  box(0.26, 0.018, 0.02, 0.006, orange, head, [0, 0.93, 0.2])
  for (const sign of [-1, 1]) {
    const ear = mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.15, 40), trim, head, [sign * 0.73, 0.41, -0.02])
    ear.rotation.z = Math.PI / 2
    const glow = ring(0.205, 0.028, orange, head, [sign * 0.81, 0.41, -0.02])
    glow.rotation.y = Math.PI / 2
    const earCore = mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.018, 32), graphite, head, [sign * 0.82, 0.41, -0.02])
    earCore.rotation.z = Math.PI / 2
  }
  const eyes = new THREE.Group()
  const eyeRings: THREE.Mesh[] = []
  head.add(eyes)
  for (const x of [-0.255, 0.255]) {
    const eye = ring(0.092, 0.021, eyeMaterial, eyes, [x, 0.4, 0.555])
    eye.scale.y = 1.35
    eyeRings.push(eye)
  }
  box(0.12, 0.015, 0.008, 0.003, orange, head, [0, 0.16, 0.55])

  const up = new THREE.Vector3(0, 1, 0)
  function arm(sign: number) {
    const shoulder = new THREE.Vector3(sign * 0.66, 1.78, 0)
    sphere(0.18, trim, robot, [shoulder.x, shoulder.y, shoulder.z])
    ring(0.13, 0.018, orange, robot, [shoulder.x, shoulder.y, 0.13])
    const upper = new THREE.Group()
    const lower = new THREE.Group()
    robot.add(upper, lower)
    box(0.3, 1, 0.33, 0.1, graphite, upper)
    box(0.26, 1, 0.3, 0.085, graphite, lower)
    box(0.025, 0.47, 0.015, 0.008, orange, lower, [sign * 0.13, 0, 0.15])
    const elbow = sphere(0.15, edge, robot, [0, 0, 0])
    const hand = new THREE.Group()
    robot.add(hand)
    box(0.3, 0.14, 0.26, 0.05, trim, hand)
    const fingers = [-1, 1].map((side) => {
      const finger = box(0.075, 0.24, 0.14, 0.03, graphite, hand, [side * 0.15, -0.12, 0])
      return { side, finger }
    })
    box(0.14, 0.018, 0.14, 0.008, orange, hand, [0, 0.075, 0])
    const a = new THREE.Vector3(), b = new THREE.Vector3(), direction = new THREE.Vector3(), bend = new THREE.Vector3(), middle = new THREE.Vector3()
    const segment = (object: THREE.Object3D, start: THREE.Vector3, end: THREE.Vector3) => {
      direction.subVectors(end, start)
      object.position.copy(start).addScaledVector(direction, 0.5)
      object.scale.y = direction.length()
      object.quaternion.setFromUnitVectors(up, direction.normalize())
    }
    return (world: Point3, grip: number, twist = 0) => {
      b.set(...world).sub(robot.position)
      direction.subVectors(b, shoulder)
      const distance = THREE.MathUtils.clamp(direction.length(), 0.08, 1.04)
      direction.normalize()
      b.copy(shoulder).addScaledVector(direction, distance)
      const along = (0.52 ** 2 - 0.54 ** 2 + distance ** 2) / (2 * distance)
      const height = Math.sqrt(Math.max(0, 0.52 ** 2 - along ** 2))
      bend.set(sign, -0.1, 0.35).addScaledVector(direction, -bend.dot(direction)).normalize()
      middle.copy(shoulder).addScaledVector(direction, along).addScaledVector(bend, height)
      elbow.position.copy(middle)
      a.copy(shoulder)
      segment(upper, a, middle)
      segment(lower, middle, b)
      hand.position.copy(b)
      hand.rotation.set(0, 0, twist)
      fingers.forEach(({ side, finger }) => { finger.position.x = side * (0.21 - grip * 0.055); finger.rotation.z = side * (0.25 - grip * 0.23) })
    }
  }
  const rightArm = arm(1)
  const leftArm = arm(-1)

  function module(position: Point3, accent = false) {
    const group = new THREE.Group()
    group.position.set(...position)
    scene.add(group)
    box(0.57, 0.51, 0.57, 0.065, moduleMaterial, group)
    box(0.45, 0.36, 0.026, 0.035, modulePanel, group, [0, 0, 0.29])
    for (let i = 0; i < 3; i++) box(i === 0 ? 0.25 : 0.15 + i * 0.04, 0.015, 0.012, 0.004, accent ? orange : edge, group, [-0.025, 0.085 - i * 0.075, 0.312])
    box(0.19, 0.055, 0.2, 0.015, trim, group, [0, 0.28, 0])
    for (const x of [-0.2, 0.2]) sphere(0.015, edge, group, [x, -0.15, 0.313])
    return group
  }
  const existing: Point3[] = [[0.25, 0.36, 0], [0.9, 0.36, 0], [1.55, 0.36, 0], [1.55, 0.96, 0], [1.55, 1.56, 0]]
  existing.forEach((position, i) => module(position, i === 0))
  const heldPart = module(partStart, true)
  const looseSources: Point3[] = [[1.95, 0.35, 0.95], [0.66, 0.35, 1.05], [1.3, 0.35, 1.13]]
  const destinations: Point3[] = [[0.9, 0.96, 0], [0.25, 1.56, 0], [0.9, 1.56, 0]]
  const extensions = looseSources.map((position) => module(position))
  box(0.65, 0.73, 0.64, 0.08, trim, scene, [-0.25, 0.47, 0.68])
  box(0.68, 0.055, 0.67, 0.02, edge, scene, [-0.25, 0.855, 0.68])
  const socketMaterial = new THREE.LineBasicMaterial({ color: 0xff8a1b, transparent: true, opacity: 0.5 })
  const socket = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.59, 0.54, 0.59)), socketMaterial)
  socket.position.set(...partSlot)
  scene.add(socket)
  const ghostMaterial = new THREE.LineBasicMaterial({ color: 0x73737b, transparent: true, opacity: 0.13 })
  destinations.forEach((position) => {
    const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.59, 0.54, 0.59)), ghostMaterial)
    ghost.position.set(...position)
    scene.add(ghost)
  })
  const focusLight = new THREE.PointLight(0xff7900, 0, 2.7, 2)
  focusLight.position.set(0.25, 1.0, 0.65)
  scene.add(focusLight)
  const beamMaterial = new THREE.LineBasicMaterial({ color: 0xff8a27, transparent: true, opacity: 0 })
  const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), beamMaterial)
  scene.add(beam)
  const eyeWorld = new THREE.Vector3()
  const slotVector = new THREE.Vector3(...partSlot).add(new THREE.Vector3(0, 0, 0.31))
  let currentProgress = 0
  let disposed = false

  const render = (p: number) => {
    if (disposed) return
    currentProgress = p
    const pose = getBuildPose(p)
    head.rotation.set(...pose.head)
    eyes.position.x = -0.025 * pose.focus
    const blink = Math.max(0, 1 - Math.abs(pose.p - 0.12) / 0.018)
    eyeRings.forEach((eye) => { eye.scale.y = 1.35 * (1 - blink * 0.85) })
    rightArm(pose.hand, pose.grip, pose.partRotation)
    leftArm([-1.78, 0.88, 0.13], 0.25)
    heldPart.position.set(...pose.part)
    heldPart.rotation.set(0, pose.partRotation * 0.6, pose.partRotation)
    extensions.forEach((item, i) => {
      const t = pose.extensions[i]
      item.position.set(...looseSources[i]).lerp(new THREE.Vector3(...destinations[i]), t)
      item.position.y += Math.sin(t * Math.PI) * 0.65
      item.rotation.set(0, (1 - t) * (i % 2 ? -0.18 : 0.2), (1 - t) * (i % 2 ? 0.12 : -0.1))
    })
    socket.visible = !pose.seated
    socketMaterial.opacity = 0.18 + pose.focus * 0.8
    focusLight.intensity = pose.focus * 2.4
    beamMaterial.opacity = pose.focus * 0.15
    head.updateWorldMatrix(true, false)
    head.localToWorld(eyeWorld.set(0, 0.4, 0.57))
    const positions = beam.geometry.getAttribute('position')
    positions.setXYZ(0, eyeWorld.x, eyeWorld.y, eyeWorld.z)
    positions.setXYZ(1, slotVector.x, slotVector.y, slotVector.z)
    positions.needsUpdate = true
    renderer.domElement.dataset.progress = pose.p.toFixed(4)
    renderer.domElement.dataset.action = pose.action
    renderer.render(scene, camera)
  }
  const resize = () => {
    if (disposed) return
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    const distance = Math.max(1, 1.12 / camera.aspect)
    camera.position.set(4.2 * distance, 1.48 + 1.8 * distance, 6.5 * distance)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
    render(currentProgress)
  }
  resize()
  return {
    render, resize,
    dispose() {
      disposed = true
      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry)
          const values = Array.isArray(object.material) ? object.material : [object.material]
          values.forEach((material: THREE.Material) => materials.add(material))
        }
      })
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      environment.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
