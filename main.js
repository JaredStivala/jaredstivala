// Import Three.js and GLTFLoader
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Load the 3D model
const loader = new GLTFLoader();
let object;

// Set which object to render
let objToRender = '3dme';

loader.load(
  `scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.position.set(0, -1.5, 0);
    object.scale.set(1.5, 1.5, 1.5); // Adjust the scale if necessary
    scene.add(object);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Select the portfolio container
const portfolioContainer = document.querySelector('.portfolio-container');

// Create portfolio items
const portfolioItems = [];

function createPortfolioItem(id, mediaPath, title, link) {
  const div = document.createElement('div');
  div.className = 'portfolio-item';
  div.id = id;

  // Create a wrapper div for the media
  const mediaWrapper = document.createElement('div');
  mediaWrapper.className = 'media-wrapper';

  // Check if the mediaPath is an image or video based on file extension
  let mediaElement;
  if (mediaPath.endsWith('.mp4') || mediaPath.endsWith('.webm')) {
    mediaElement = document.createElement('video');
    mediaElement.src = mediaPath;
    mediaElement.controls = false; // Optionally add controls for video
    mediaElement.autoplay = true; // Set to true if you want the video to autoplay
    mediaElement.muted = true;
    mediaElement.loop = true;
    mediaElement.playsInline = true;
  } else {
    mediaElement = document.createElement('img');
    mediaElement.src = mediaPath;
  }

  // Only set cursor and add click event if link is provided
  if (link) {
    mediaElement.style.cursor = 'pointer';
    mediaElement.addEventListener('click', function () {
      window.open(link, '_blank');
    });
  } else {
    // Optional: Set cursor to default or remove pointer events
    mediaElement.style.cursor = 'default';
  }

  // Append the media element to the wrapper
  mediaWrapper.appendChild(mediaElement);
  div.appendChild(mediaWrapper);

  const h2 = document.createElement('h2');
  h2.textContent = title;
  div.appendChild(h2);

  portfolioContainer.appendChild(div);
  portfolioItems.push(div);
}


// Create portfolio items with images and videos
createPortfolioItem('item1', 'Download.mp4', 'Automated TikToks', 'https://www.tiktok.com/@astronomydaily');
createPortfolioItem('item2', 'EcoCoin - Google Chrome 2024-10-14 19-56-29.mp4', 'WebApp for Sustainable Eating', 'https://ecocoins.co');
createPortfolioItem('item3', 'WhatsApp Video 2024-10-04 at 13.14.22_63bae061.mp4', 'Digital Skills Helper');
createPortfolioItem('item4', 'Home — End Speciesism - Google Chrome 2024-10-14 19-57-50.mp4', 'Educational Website', 'https://endspeciesism.org');

// Scroll event handler
window.addEventListener('scroll', onScroll);

function onScroll() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const maxScroll = document.body.scrollHeight - viewportHeight;
  const scrollPercent = scrollY / maxScroll;

  // Define zoom ranges
  const minZoom = 1;
  const maxZoom = 7;

  // Initialize zoom
  let zoom;

  if (scrollPercent <= 0.2) {
    // Zoom from maxZoom to minZoom rapidly
    const t = scrollPercent / 0.2;
    zoom = maxZoom - t * (maxZoom - minZoom);
  } else if (scrollPercent <= 0.5) {
    // Keep zoom at minZoom
    zoom = minZoom;
  } else if (scrollPercent <= 0.7) {
    // Zoom from minZoom to maxZoom rapidly
    const t = (scrollPercent - 0.5) / 0.2;
    zoom = minZoom + t * (maxZoom - minZoom);
  } else {
    // Keep zoom at maxZoom
    zoom = maxZoom;
  }

  camera.position.z = zoom;

  // Keep the camera centered horizontally
  camera.position.x = 0;

  // Dramatic vertical movement
  const verticalAmplitude = 2;
  const verticalFrequency = 5;
  camera.position.y = verticalAmplitude * Math.sin(scrollPercent * Math.PI * verticalFrequency);

  // Always look at the center
  camera.lookAt(new THREE.Vector3(0, 0.5, 0));

  // Update object rotation based on scroll
  if (object) {
    let rotationY;
    if (scrollPercent <= 0.2) {
      // Rotate slowly in the first 20%
      rotationY = scrollPercent * Math.PI;
    } else if (scrollPercent <= 0.5) {
      // Rotate faster between 20% and 50%
      rotationY = (0.2 * Math.PI) + (scrollPercent - 0.2) * 4 * Math.PI;
    } else if (scrollPercent <= 0.8) {
      // Rotate even faster after 50%
      rotationY = (0.2 * Math.PI) + (0.3 * 4 * Math.PI) + (scrollPercent - 0.5) * 8 * Math.PI;
    } else {
      // Continue rotation
      rotationY = object.rotation.y + 0.05;
    }
    object.rotation.y = rotationY;
  }

  // Adjust portfolio item animations
  portfolioItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemTop = rect.top;
    const itemHeight = rect.height;

    if (itemTop < viewportHeight - itemHeight / 4) {
      // Item is in view, reveal it
      item.style.opacity = 1;
      item.style.transform = 'translateY(0)';
    } else {
      // Item is out of view, hide it
      item.style.opacity = 0;
      item.style.transform = 'translateY(50px)';
    }
  });
}

// Handle window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  // Optionally adjust object scale based on screen width
  if (object) {
    const scaleFactor = Math.min(width / 800, 1); // Adjust '800' as needed
    object.scale.set(scaleFactor * 1.5, scaleFactor * 1.5, scaleFactor * 1.5);
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
