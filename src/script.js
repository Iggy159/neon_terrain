import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

/**
 * Base
 */
// Canvas

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 6
camera.position.y = 1
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Cube
 */
const land = {}

land.geometry = new THREE.PlaneBufferGeometry(20, 20, 200, 200)
land.geometry.rotateX(- Math.PI * 0.5)

land.material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: true,
    uniforms: {
        uTime: { value: 0 }
    }
})

land.mesh = new THREE.Mesh(land.geometry, land.material)

scene.add(land.mesh)




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
//renderer.setClearColor(0x111111, 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderScene = new RenderPass(scene, camera);


const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.exposure = 1.0
bloomPass.threshold = 0.2;
bloomPass.strength = 0.73; //intensity of glow
bloomPass.radius = 1.9;

const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight); 
composer.renderToScreen = true; 
composer.addPass(renderScene); 

//composer.addPass(bloomPass);

const glitchPass = new GlitchPass();

glitchPass.strength = 0.01
//glitchPass.strength.y = 0.115
glitchPass.ratio = 0.01
glitchPass.columns = 0.03

composer.addPass( new RenderPass( scene, camera ) );

composer.addPass(glitchPass);
composer.addPass(bloomPass) 
/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    land.material.uniforms.uTime.value = elapsedTime
    

    // Update controls
    controls.update()

    // Render
    composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()