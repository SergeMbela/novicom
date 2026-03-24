// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// smooth scroll for nav links
document.querySelectorAll('.nav-link, .hero-cta').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Close menu if open
        if (navLinks && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                if (link.classList.contains('nav-link')) {
                    link.classList.add('active');
                }
            }
        }
    });
});

// --- THREE.JS GLOBE IMPLEMENTATION ---
let scene, camera, renderer, globe;
let markers = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function initGlobe() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // WebGL Check
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    if (!isWebGLAvailable()) {
        console.warn("WebGL is not supported in this browser. Loading fallback mosaic.");
        initFallbackMosaic();
        return;
    }

    scene = new THREE.Scene();
    
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Globe Group
    globe = new THREE.Group();
    scene.add(globe);

    // Globe Geometry
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        wireframe: true,
        transparent: true,
        opacity: 0.1 // Reduced from 0.5 to highlight continents
    });

    const globeMesh = new THREE.Mesh(geometry, material);
    globe.add(globeMesh);

    // Points of light / Glow effect
    const pointGeo = new THREE.SphereGeometry(101, 32, 32);
    const pointMat = new THREE.PointsMaterial({
        color: 0xFFD700,
        size: 1.5,
        transparent: true,
        opacity: 0.2 // Reduced from 0.8
    });
    const points = new THREE.Points(pointGeo, pointMat);
    globe.add(points);

    // Inner Dark Sphere
    const innerGeo = new THREE.SphereGeometry(98, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globe.add(innerSphere);

    // Add Continents (Dot Matrix)
    addContinents(globe);

    // Markers Data
    const destinationData = [
        { lat: 35.0116, lon: 135.7681, tag: "Japon", title: "Kyoto Éternel", description: "Découvrez la sérénité des temples millénaires and la beauté des jardins zen." },
        { lat: 64.1265, lon: -21.8174, tag: "Islande", title: "Terres de Glace", description: "Une aventure sauvage entre volcans actifs, glaciers et aurores boréales." },
        { lat: 31.0802, lon: -4.0134, tag: "Maroc", title: "Dunes du Sahara", description: "Une immersion mystique dans le silence du désert et les nuits étoilées." },
        { lat: -3.4653, lon: -62.2159, tag: "Brésil", title: "Cœur de l'Amazonie", description: "Explorez la biodiversité la plus riche au monde au fil de l'eau." },
        { lat: -33.8688, lon: 151.2093, tag: "Australie", title: "Baie de Sydney", description: "L'élégance urbaine alliée à la culture surf et l'Opéra iconique." }
    ];

    destinationData.forEach(data => addMarker(data.lat, data.lon, data));

    // Interaction logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragStartTime;

    container.addEventListener('mousedown', e => { 
        isDragging = true; 
        dragStartTime = Date.now();
    });
    window.addEventListener('mouseup', e => { isDragging = false; });
    
    container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * 0.5),
                    toRadians(deltaMove.x * 0.5),
                    0,
                    'XYZ'
                ));
            globe.quaternion.multiplyQuaternions(deltaRotationQuaternion, globe.quaternion);
        } else {
            checkIntersections();
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    // Click logic
    container.addEventListener('click', e => {
        if (Date.now() - dragStartTime < 200) {
            selectMarker();
        }
    });

    // Modal helpers
    initModalControls();

    animate();
}

function initModalControls() {
    const modal = document.getElementById('destination-modal');
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove('active');
    };
}

function showModal(data) {
    const modal = document.getElementById('destination-modal');
    document.getElementById('modal-tag').textContent = data.tag;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-description').textContent = data.description;
    modal.classList.add('active');
}

function checkIntersections() {
    // Better coordinate mapping
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((mouse.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((mouse.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers, true);
    const container = document.getElementById('canvas-container');
    
    if (intersects.length > 0) {
        container.style.cursor = 'pointer';
    } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
}

function selectMarker() {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((mouse.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((mouse.clientY - rect.top) / rect.height) * 2 + 1;

    console.log("Raycasting at:", x, y);
    raycaster.setFromCamera({ x, y }, camera);
    const intersects = raycaster.intersectObjects(markers, true);

    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        let data = clickedObject.userData.title ? clickedObject.userData : clickedObject.parent.userData;
        console.log("Found Destination:", data.title);
        if (data.title) showModal(data);
    } else {
        console.log("No marker hit.");
    }
}

// Global mouse tracker for better accuracy
mouse.clientX = 0;
mouse.clientY = 0;
window.addEventListener('mousemove', e => {
    mouse.clientX = e.clientX;
    mouse.clientY = e.clientY;
});

function addMarker(lat, lon, data) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -100 * Math.sin(phi) * Math.cos(theta);
    const y = 100 * Math.cos(phi);
    const z = 100 * Math.sin(phi) * Math.sin(theta);

    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, y, z);
    markerGroup.userData = data;

    // Visible small dot
    const markerGeo = new THREE.SphereGeometry(2, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerGroup.add(markerMesh);

    // Invisible larger hit area for easier clicking
    const hitGeo = new THREE.SphereGeometry(6, 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    markerGroup.add(hitMesh);
    
    // Add glow sprite
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: 0xFFD700,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(15, 15, 1);
    markerGroup.add(sprite);

    globe.add(markerGroup);
    markers.push(markerGroup);
}

function initFallbackMosaic() {
    const container = document.getElementById('canvas-container');
    const destinationData = [
        { tag: "Japon", title: "Kyoto", image: "kyoto.png", desc: "Temples et Jardins zen." },
        { tag: "Islande", title: "Terres de Glace", image: "iceland.png", desc: "Volcans et Aurores." },
        { tag: "Maroc", title: "Sahara", image: "sahara.png", desc: "Dunes éternelles." },
        { tag: "Afrique", title: "Safari Sauvage", image: "africa_hero.png", desc: "Nature brute." },
        { tag: "Caraïbes", title: "Plages d'Or", image: "caribbean_hero.png", desc: "Évasion pure." }
    ];

    let mosaicHtml = '<div class="mosaic-fallback">';
    destinationData.forEach(dest => {
        mosaicHtml += `
            <div class="mosaic-item" onclick="openModalFromFallback('${dest.tag}', '${dest.title}', '${dest.desc}')">
                <img src="${dest.image}" alt="${dest.title}">
                <div class="mosaic-overlay">
                    <span class="gold-text">${dest.tag}</span>
                    <h3>${dest.title}</h3>
                </div>
            </div>
        `;
    });
    mosaicHtml += '</div>';
    container.innerHTML = mosaicHtml;
    container.style.height = 'auto';

    // Global helper for fallback clicks
    window.openModalFromFallback = (tag, title, desc) => {
        showModal({ tag, title, description: desc });
    };
    initModalControls();
}

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function toRadians(angle) { return angle * (Math.PI / 180); }

function addContinents(targetGroup) {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    // Using a reliable landmask texture where land is dark/black and water is white (specular map)
    const maskUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg';
    
    loader.load(maskUrl, (texture) => {
        const image = texture.image;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        const pointsGeometry = new THREE.BufferGeometry();
        const positions = [];
        const opacities = [];
        
        // Step size for dot-matrix density. 
        // 4 provides a good balance between detail and performance.
        const step = 4; 
        for (let i = 0; i < image.width; i += step) {
            for (let j = 0; j < image.height; j += step) {
                const index = (j * image.width + i) * 4;
                const r = imageData[index];
                
                // In earth_specular, land is dark (low R)
                if (r < 60) {
                    const lat = (0.5 - j / image.height) * 180;
                    const lon = (i / image.width - 0.5) * 360;
                    
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lon + 180) * (Math.PI / 180);

                    const radius = 100.5;
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);

                    positions.push(x, y, z);
                    // Slight variation in opacity for a "shimmering" holographic effect
                    opacities.push(0.3 + Math.random() * 0.5);
                }
            }
        }

        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        pointsGeometry.setAttribute('alpha', new THREE.Float32BufferAttribute(opacities, 1));

        const pointsMaterial = new THREE.PointsMaterial({
            color: 0xFFD700,
            size: 0.7,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const continentPoints = new THREE.Points(pointsGeometry, pointsMaterial);
        targetGroup.add(continentPoints);
    });
}

let isDragging = false; // Shared with event listeners
function animate() {
    requestAnimationFrame(animate);
    if (globe && !isDragging) {
        globe.rotation.y += 0.002;
    }
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Window Resize
window.addEventListener('resize', () => {
    const container = document.getElementById('canvas-container');
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// --- JOURNEY SLIDER LOGIC ---
let currentSlide = 0;
const slides = document.querySelectorAll('.journey-slide');

function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (slides.length > 0) {
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Start Globe & Hero Slider
window.addEventListener('load', () => {
    initGlobe();
    initHeroSlider();
});

function initHeroSlider() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length === 0) return;

    const loader = document.getElementById('hero-loader');
    const firstVideo = heroSlides[0];

    // Hide loader when first video can play
    if (firstVideo && firstVideo.tagName === 'VIDEO') {
        if (firstVideo.readyState >= 3) {
            if (loader) loader.classList.add('hidden');
        } else {
            firstVideo.addEventListener('canplay', () => {
                if (loader) loader.classList.add('hidden');
            });
        }
    } else {
        if (loader) loader.classList.add('hidden');
    }

    if (heroSlides.length <= 1) return;

    let currentHeroSlide = 0;

    function nextHeroSlide() {
        heroSlides[currentHeroSlide].classList.remove('active');
        // heroSlides[currentHeroSlide].pause(); // Optional: pause inactive video
        
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        
        heroSlides[currentHeroSlide].classList.add('active');
        if (heroSlides[currentHeroSlide].tagName === 'VIDEO') {
            heroSlides[currentHeroSlide].play().catch(e => console.log("Video play failed:", e));
        }
    }

    setInterval(nextHeroSlide, 7000); // Change hero slide every 7 seconds
}

// Back to Top Button Logic
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
