let model, colliderCar, colliderCubo;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const velocity = 0.3

function setScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 1, 1000 );
    scene.fog.color.setHSL( 0.6, 0, 1 );
    scene.background = new THREE.Color( 0xffffff );
    return scene;
}

function setCamera() {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.rotation.set(0.8, 179.07, 0);
    camera.position.set( 0, 5, -5 );
    return camera;
}

function setCar() {
    const loader = new THREE.GLTFLoader();
    loader.load( 'CarroPolicia.glb', function ( gltf ) {
        try{
            model = gltf.scene.children[0];

            colliderCar = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()).setFromObject(gltf.scene.children[0]);
            
            model.position.set( 0, 0, 0 );
            scene.add( model );
        } catch(e){
            console.log(e);
        }     
    } );
    
}

function setRenderer(){
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
    document.body.appendChild( renderer.domElement );
    return renderer;
}

function setLights() {
    const light = new THREE.AmbientLight( 0xffffff, 0.5 );
    const light2 = new THREE.PointLight( 0xffffff, 1 );
    light2.position.set( 0, 10, 0 );
    scene.add( light );
    scene.add( light2 );
    return light;
}

function moveCar(){
    if ( moveForward ){
        model.translateZ( velocity );       
    }
    if ( moveBackward ){
        model.translateZ( -velocity );       
    }
    if ( moveLeft ){
        model.rotation.y += 0.05;       
    }
    if ( moveRight ){
        model.rotation.y += -0.05;
    }
    colliderCar.copy(model.children[0].geometry.boundingBox).applyMatrix4(model.matrixWorld);
}

function moveCamera() {
    var rotation = model.rotation.y
    var rotZ = Math.cos(rotation)
    var rotX = Math.sin(rotation)
    var distance = 10;
    camera.position.x = model.position.x - (distance * rotX);
    camera.position.y = model.position.y + 6;
    camera.position.z = model.position.z - (distance * rotZ);
    camera.lookAt(model.position);
}

function detectCollision(){
    if(colliderCar.intersectsBox(colliderCubo)){
        //scene.remove(cube)
        model.position.set( Math.random() * 50, 0, Math.random() * 50 );
    }
}

function animate() {
    requestAnimationFrame( animate );   
    renderer.render( scene, camera );
    
    moveCar()
    moveCamera()
    detectCollision()
};

function setCube(x,y,z) {
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const cube = new THREE.Mesh( geometry, material );
    //adicionar collider
    colliderCubo = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()).setFromObject(cube);
    colliderCubo.translate(new THREE.Vector3(x,y,z));

    cube.position.set( x, y, z );
    scene.add( cube );
    return cube;
}

//Adicionar chao
function setFloor() {
    const geometry = new THREE.BoxGeometry( 100, 0.1, 100 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const floor = new THREE.Mesh( geometry, material );
    floor.position.set( 0, -1, 0 );
    scene.add( floor );
    return floor;
}



const scene = setScene();
const camera = setCamera();
setCar();
const renderer = setRenderer();
const light = setLights();
const cube = setCube(0,0,20);
//const cube2 = setCube(10,0,20);
//const cube3 = setCube(-10,0,20);
const floor = setFloor();
console.log(colliderCubo);

const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};


document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

animate();