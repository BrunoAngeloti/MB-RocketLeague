let model, colliderCar, colliderCubo, playerTwo, map;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let moveForward2 = false;
let moveBackward2 = false;
let moveLeft2 = false;
let moveRight2 = false;

const velocity = 5

function setScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );
    scene.fog.color.setHSL( 0.6, 0, 1 );
    scene.background = new THREE.Color( 0x74baf7 );
    return scene;
}

function setCamera() {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/2 / window.innerHeight, 0.1, 1000 );
    //camera.rotation.set(0.8, 179.07, 0);
    //camera.position.set( 0, 5, -5 );
    return camera;
}

function setPlayerOne() {
    const loader = new THREE.GLTFLoader();
    loader.load( 'CarroPolicia.glb', function ( gltf ) {
        try{
            model = gltf.scene.children[0];

            colliderCar = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()).setFromObject(gltf.scene.children[0]);
            
            model.position.set( 16, 0, 0 );
            model.scale.set(8, 8, 8);
            scene.add( model );
        } catch(e){
            console.log(e);
        }     
    } );  
}

function setPlayerTwo() {
    const loader = new THREE.GLTFLoader();
    loader.load( 'CarroEsportivo.glb', function ( gltf ) {
        try{
            playerTwo = gltf.scene.children[0];

            //colliderCar = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()).setFromObject(gltf.scene.children[0]);
            
            playerTwo.position.set( -16, 0, 0 );
            playerTwo.scale.set(8, 8, 8);
            scene.add( playerTwo );
        } catch(e){
            console.log(e);
        }     
    } );  
}

function setMap() {
    const loader = new THREE.GLTFLoader();
    loader.load( 'Cidade.glb', function ( gltf ) {
        try{
            map = gltf.scene.children[0];

            //colliderCar = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()).setFromObject(gltf.scene.children[0]);
            map.position.set( 0, -6, 0 );
            map.rotation.set( 0, 1.55, 0 );
            //diminuir escala
            
           // playerTwo.position.set( -5, 0, 0 );
            scene.add( map );
        } catch(e){
            console.log(e);
        }     
    } );  
}

function setRenderer(){
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth/2-20, window.innerHeight-20 );
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

function moveCarTwo(){
    if ( moveForward2 ){
        playerTwo.translateZ( velocity );       
    }
    if ( moveBackward2 ){
        playerTwo.translateZ( -velocity );       
    }
    if ( moveLeft2 ){
        playerTwo.rotation.y += 0.05;       
    }
    if ( moveRight2 ){
        playerTwo.rotation.y += -0.05;
    }
}

function teste2(){
    teste = !teste
}

function moveCamera(camera, car) {
    var rotation = car.rotation.y
    var rotZ = Math.cos(rotation)
    var rotX = Math.sin(rotation)
    var distance = 55;
    camera.position.x = car.position.x - (distance * rotX);
    camera.position.y = car.position.y + 35;
    camera.position.z = car.position.z - (distance * rotZ);
    camera.lookAt(car.position);
}

function detectCollision(){
    if(colliderCar.intersectsBox(colliderCubo)){
        //scene.remove(cube)
        model.position.set( Math.random() * 50, 0, Math.random() * 50 );
    }
}
let teste = false
function animate() {
    requestAnimationFrame( animate );   
    renderer.render( scene, camera );
    rendererTwo.render( scene, cameraTwo );
    if(teste){
        //renderer.render( scene, camera );
        //deletar rendererTwo
        //rendererTwo.clear();

    }else{
        //rendererTwo.render( scene, cameraTwo );
        //renderer.clear();
    }
    
    
    
    moveCar()
    moveCarTwo()
    moveCamera(camera, model)
    moveCamera(cameraTwo, playerTwo)
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
const cameraTwo = setCamera();
setPlayerOne();
setPlayerTwo();
setMap();
const renderer = setRenderer();
const rendererTwo = setRenderer();
const light = setLights();
//const cube = setCube(0,0,20);
//const floor = setFloor();


const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
            moveForward2 = true;
            break;
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
            moveLeft2 = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
            moveBackward2 = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
            moveRight2 = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
            moveForward2 = false;
            break;
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
            moveLeft2 = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
            moveBackward2 = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
            moveRight2 = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;

    }

};


document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

animate();