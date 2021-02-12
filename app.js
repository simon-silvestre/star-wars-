var first = document.querySelector('.first');
var second = document.querySelector('.second');
var third = document.querySelector('.third');
var starwars = document.querySelector('h1');
var mandalorian = document.querySelector('h2');


TweenMax.to(first, 1.5, {
    delay: .7,
    top: "110%",
    ease: Expo.easeInOut
});
TweenMax.to(second, 1.5, {
    delay: .8,
    top: "110%",
    ease: Expo.easeInOut
});
TweenMax.to(third, 1.5, {
    delay: .9,
    top: "110%",
    ease: Expo.easeInOut
});
TweenMax.to(mandalorian, 1.5, {
    delay: 2,
    bottom: "30px",
    ease: Expo.easeInOut
});
if(window.matchMedia("(max-width: 675px)").matches) {
    TweenMax.to(starwars, 1.5, {
        delay: 1.5,
        top: "20px",
        ease: Expo.easeInOut
    });
}
else {
    TweenMax.to(starwars, 1.5, {
        delay: 1.5,
        top: "-10px",
        ease: Expo.easeInOut
    });
}

init();

var mesh, renderer, scene, camera, controls, starGeo, stars, vaisseau;

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    scene.scale.set(1.5, 1.5, 1.5);

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 1);

    // ambient
    scene.add(new THREE.AmbientLight( 0x404040, 3 ));

    // light
    var light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(20, 20, 0);
    scene.add(light);

    //etoiles
    starGeo = new THREE.Geometry();
    for(let i=0; i<6000; i++) {
        let star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        star.velocity = 0;
        star.acceleration = 0.02;
        starGeo.vertices.push(star);
    }
    let sprite = new THREE.TextureLoader().load('assets/star.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: sprite
    });
    stars = new THREE.Points(starGeo, starMaterial);
    stars.rotation.x = -Math.PI/2;
    scene.add(stars);

    //importation model 3d
    var loader = new THREE.GLTFLoader();
    loader.load('assets/scene.gltf', function (gltf) {
        vaisseau = gltf.scene.children[0];
        modelSize();
        scene.add(gltf.scene);

        animate();
    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    };

    window.addEventListener('resize', function () {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
          }
          modelSize();
    });
}

function animate() {
    requestAnimationFrame(animate);
    vaisseau.rotation.z += 0.01;
    renderer.render(scene, camera);

    //etoiles
    starGeo.vertices.forEach(p => {
        p.velocity += p.acceleration
        p.y -= p.velocity;
        
        if (p.y < -200) {
          p.y = 200;
          p.velocity = 0;
        }
      });
      starGeo.verticesNeedUpdate = true;
      stars.rotation.y += 0.002;
}

function modelSize() {
    if(window.matchMedia("(max-width: 575px)").matches) {
        vaisseau.scale.set(0.7, 0.7, 0.7);
    }
    else if(window.matchMedia("(max-width: 950px)").matches) {
        vaisseau.scale.set(0.8, 0.8, 0.8);
    }
    else if(window.matchMedia("(max-width: 1400px)").matches) {
        vaisseau.scale.set(0.9, 0.9, 0.9);
    }
    else {
        vaisseau.scale.set(1, 1, 1);
    }
    const box = new THREE.Box3().setFromObject(vaisseau);
        const center = box.getCenter(new THREE.Vector3());
        vaisseau.position.x = (vaisseau.position.x - center.x);
        vaisseau.position.y = (vaisseau.position.y - center.y);
        vaisseau.position.z = (vaisseau.position.z - center.z);
}