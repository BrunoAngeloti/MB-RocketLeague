const { Project, Scene3D, PhysicsLoader, THREE, ExtendedObject3D, Loaders, Cameras } = ENABLE3D    
class MainScene extends Scene3D {
    init() {
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.moveForward2 = false;
        this.moveBackward2 = false;
        this.moveLeft2 = false;
        this.moveRight2 = false;

        this.score1 = 0;
        this.score2 = 0;
    }

    createWall({ x=0, y=0, z=0, width, height, depth }) {
        let parede = this.add.box({ x, y, z, width, height, depth })
        this.physics.add.existing(parede, { mass: 0 })
    }

    createMap(){
        // Top and bottom walls
        this.createWall({ z: 10.05, width: 21, height: 2, depth: 1 })
        this.createWall({ z: -10, width: 21, height: 6, depth: 1 })

        // Left wall
        this.createWall({ x: -10, z: -6.3, width: 1, height: 4, depth: 8.5 })
        this.createWall({ x: -10, z: 6.3, width: 1, height: 4, depth: 8.5 })
        this.createWall({ x: -10, y: 2.5, width: 1, height: 1, depth: 21.1 })

        // Right wall
        this.createWall({ x: 10, z: -6.3, width: 1, height: 4, depth: 8.5 })
        this.createWall({ x: 10, z: 6.3, width: 1, height: 4, depth: 8.5 })
        this.createWall({ x: 10, y: 2.5, width: 1, height: 1, depth: 21.1 })
    }

    randomHex() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    createBall() {
        this.ball = this.add.sphere({ radius: 0.5 }, { lambert: { color: this.randomHex() } })
        this.ball.position.setY(10)
        this.physics.add.existing(this.ball)

    }

    createPlayer1(){
        this.load.gltf('models/CarroEsportivo.glb').then(gltf => {
            this.carro = gltf.scene.children[0]
            this.carro.position.set(8, 0, 0)
            this.carro.rotation.set(0, -1.57, 0)
            this.scene.add(this.carro)
            this.carro.scale.set(0.3, 0.3, 0.3)
            this.physics.add.existing(this.carro, { shape: 'convex'})    
            this.carro.body.setAngularFactor(0, 0, 0)
            this.carro.body.setFriction(0.8)
            
        })
    }

    createPlayer2(){
        this.load.gltf('models/CarroPolicia.glb').then(gltf => {
            this.carro2 = gltf.scene.children[0]
            this.carro2.position.set(-8, 0, 0)
            this.carro2.rotation.set(0, 1.57, 0)
            this.scene.add(this.carro2)
            this.carro2.scale.set(0.3, 0.3, 0.3)
            this.physics.add.existing(this.carro2, { shape: 'convex'})  
            this.carro2.body.setAngularFactor(0, 0, 0)
            this.carro2.body.setFriction(0.8)     
        })
    }
    
    async create() {
        const { camera } = await this.warpSpeed('-orbitControls')

        camera.position.set(0, 10, 20);
        camera.lookAt(0,0,0);

        this.createPlayer1()
        this.createPlayer2()
        this.createBall()
        this.createMap()


        window.addEventListener( 'keydown', (event) => {
            switch (event.keyCode) {
                case 87: // w
                    this.moveForward2 = true;
                    break;
                case 65: // a
                    this.moveLeft2 = true;
                    break;
                case 83: // s
                    this.moveBackward2 = true;
                    break;
                case 68: // d
                    this.moveRight2 = true;
                    break;
                    
                case 38: // seta up
                    this.moveForward = true;
                    break;
                case 37: // seta left
                    this.moveLeft = true;
                    break;
                case 40: // seta down
                    this.moveBackward = true;
                    break;
                case 39: // seta right
                    this.moveRight = true;
                    break;
            }
        } );
        window.addEventListener( 'keyup', (event) => {
            switch (event.keyCode) {
                case 87: // w
                    this.moveForward2 = false;
                    break;
                case 65: // a
                    this.moveLeft2 = false;
                    break;
                case 83: // s
                    this.moveBackward2 = false;
                    break;
                case 68: // d
                    this.moveRight2 = false;
                    break;
                    
                case 38: // seta up
                    this.moveForward = false;
                    break;
                case 37: // seta left
                    this.moveLeft = false;
                    break;
                case 40: // seta down
                    this.moveBackward = false;
                    break;
                case 39: // seta right
                    this.moveRight = false;
                    break;
            }
        } );

    }

    moveCar(carro, moveForward, moveBackward, moveLeft, moveRight) {
        // Pega a rotação do carro em relação ao mundo
        const v3 = new THREE.Vector3()
        const speed = 8
        const rotation = carro.getWorldDirection(v3)
        const theta = Math.atan2(rotation.x, rotation.z)
        
        // Condição para não sair do campo
        if(carro.position.x > -10.1 && carro.position.x < 10.1){
            // Movimenta o carro para frente ou para trás 
            if ( moveForward ){
                const x = Math.sin(theta) * speed, y = carro.body.velocity.y, z = Math.cos(theta) * speed
                carro.body.setVelocity(x, y, z)        
            } else if ( moveBackward ){
                const x = Math.sin(theta) * -speed, y = carro.body.velocity.y, z = Math.cos(theta) * -speed
                carro.body.setVelocity(x, y, z)      
            } else{
                carro.body.setVelocity(0, carro.body.velocity.y, 0)
            }

            // Gira o carro no próprio eixo
            if ( moveLeft ){
                carro.body.setAngularVelocityY(2)       
            }else if ( moveRight ){
                carro.body.setAngularVelocityY(-2)  
            }else {
                carro.body.setAngularVelocityY(0)
            }
        }else{
            // Retonar o carro para o mapa
            if(carro.position.x < -10.1){
                carro.body.applyForceX(1)
            }else{
                carro.body.applyForceX(-1)
            }
        }    
    }


    update(){
        if(this.carro){
            this.moveCar(this.carro, this.moveForward, this.moveBackward, this.moveLeft, this.moveRight)    
        }  
        if(this.carro2){
            this.moveCar(this.carro2, this.moveForward2, this.moveBackward2, this.moveLeft2, this.moveRight2)                     
        } 
        
        if(this.ball){
            // Gol do time Direita
            if(this.ball.position.x < -11){
                this.score1 += 1   
                const score1 = document.getElementById('score1')
                score1.innerHTML = this.score1
                this.createBall()
            }
            // Gol do time Esquerda
            if(this.ball.position.x > 11){
                this.score2 += 1
                const score2 = document.getElementById('score2')
                score2.innerHTML = this.score2
                this.createBall()
            }
        }

    }
}

PhysicsLoader('./lib/ammo/moz', () => new Project({ scenes: [MainScene] }))