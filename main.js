import "./style.css";
import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const geometria = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xee0000 });
const torus = new THREE.Mesh(geometria, material);

scene.add(torus);

const pontoLuz = new THREE.PointLight(0xffffff);
pontoLuz.position.set(20, 20, 20);

const luzAmbiente = new THREE.AmbientLight(0xffffff);
scene.add(pontoLuz, luzAmbiente);

// const luzAjuda = new THREE.PointLightHelper(pontoLuz);
// const gridAjuda = new THREE.GridHelper(200, 50);
// scene.add(luzAjuda, gridAjuda);
// const controles = new OrbitControls(camera, renderer.domElement);

function addEstrelas() {
  const geometry = new THREE.SphereGeometry(0.15, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const estrela = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  estrela.position.set(x, y, z);
  scene.add(estrela);
}

Array(1000).fill().forEach(addEstrelas);

const espacoTextura = new THREE.TextureLoader().load("espaco.jpg");
scene.background = espacoTextura;

const agsTextura = new THREE.TextureLoader().load("ags.png");
const ags = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    map: agsTextura,
  })
);

scene.add(ags);

const luaTextura = new THREE.TextureLoader().load("moon.jpg");
const luaNormalTextura = new THREE.TextureLoader().load("normal.jpg");
const lua = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({
    map: luaTextura,
    normalMap: luaNormalTextura,
  })
);

scene.add(lua);

lua.position.z = 20;
lua.position.setX(-10);

ags.position.z = -5;
ags.position.x = 2;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  lua.rotation.x += 0.05;
  lua.rotation.y += 0.075;
  lua.rotation.z += 0.05;

  ags.rotation.y += 0.01;
  ags.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

function animacao() {
  requestAnimationFrame(animacao);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  lua.rotation.x += 0.005;

  //controles.update();
  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animacao();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}
