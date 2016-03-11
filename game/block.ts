module BlockTaming {
    export class Block extends BaseObject {

        //Relevant stats
        dna: string;
        strength: number;
        acceleration: number;
        maxSpeed: number;
        sight: number;
        vitality: number;
        aggression: number;
        hunger: number;
        gender: number;
        insanity: number;
<<<<<<< HEAD
        energy: number;
        allChildren: List<Block>;
=======
        energy: number;        
>>>>>>> 4340e414d0895ca9c82353add6551c82b6cbec1d

        changeAcceleration: number;
        tamed: boolean;

        target: BaseObject;
        closestFood: BaseObject;

        mouth: Phaser.Sprite;
        sensor: Phaser.Graphics;
        healthBar: Phaser.Graphics;
                
        static createRandomDnaString(): string {
            const maxDnaSize = 81;

            var newDna = "";
            while (newDna.length < maxDnaSize) {
                newDna += Math.random() >= .5 ? "1" : "0";
            }
            return newDna;
        }        

        decode(dna: string) {
            this.dna = dna;
            this.strength = parseInt(dna.substr(0, 8), 2);
            this.acceleration = parseInt(dna.substr(8, 8), 2);
            this.maxSpeed = parseInt(dna.substr(16, 8), 2);
            this.sight = parseInt(dna.substr(24, 8), 2);
            this.vitality = parseInt(dna.substr(32, 8), 2);
            this.aggression = parseInt(dna.substr(40, 8), 2);            
            this.insanity = parseInt(dna.substr(48, 8), 2);

            //tint is a color and is 3 bytes long
            this.tint = parseInt(dna.substr(56, 24), 2);
            
            this.gender = parseInt(dna.substr(80, 1), 2);
        }

        constructor(arena: Arena, dna: string) {

            var randomX, randomY;

            do {
                randomX = Math.random() * (arena.world.width - 100) + 50;
                randomY = Math.random() * (arena.world.height - 100) + 50;
            } while (arena.physics.arcade.getObjectsAtLocation(randomX, randomY, arena.wildBlocks).length > 0 ||
            arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, arena.wildBlocks).length > 0 ||
            arena.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, arena.wildBlocks).length > 0);

            super(arena, randomX, randomY, 'blockSprite', arena.wildBlocks);

            this.decode(dna);

            this.body.bounce.y = 0.2;
            this.body.bounce.x = 0.2;
            this.body.maxVelocity.x = this.maxSpeed;
            this.body.maxVelocity.y = this.maxSpeed;
            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.maxAngular = 100;
            this.body.allowRotation = true;

            //create mouth for eating
            this.mouth = this.game.add.sprite(-10, -17, 'mouth');
            this.game.physics.enable(this.mouth, Phaser.Physics.ARCADE);
            this.addChild(this.mouth);

            this.mouth.animations.add('eat', [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0]);            

            this.sensor = this.game.add.graphics(0, 0);
            this.addChild(this.sensor);
            this.sensor.beginFill(this.tint, .1);
            this.sensor.arc(0, 0, Math.max(this.sight - 16, 0), 0, -Math.PI, true);
            this.sensor.endFill();

            this.healthBar = this.game.add.graphics(0, 0);
            this.addChild(this.healthBar);
            this.redrawHealthBar();

            var self: Block;
            self = this;

            this.events.onInputDown.add(function () {
                if (!arena.tamingStarted) {
                    self.tame();
                    arena.tamingStarted = true;

                }
            }, this);
            
            //Custom properties
            this.tamed = false;
            this.changeAcceleration = 100;
            this.think = this.fleeBehavior;
            this.energy = 100;
            this.hunger = 0;
        }

        redrawHealthBar() {
            this.healthBar.clear();
            this.healthBar.beginFill(0x000000, 1);
            this.healthBar.drawRect(-13, 10, 26, 5);
            this.healthBar.beginFill(0xFF3300, 1);
            this.healthBar.drawRect(-12, 11, 24 * (Math.min(this.energy, 100) / 100), 3);
            this.healthBar.endFill();
        }

        tame() {            
            this.tint = 0x00FF00;
            this.think = this.chaseBehavior;
            this.tamed = true;
            this.arena.moveToTamed(this);

            this.sensor.clear();
            this.sensor.beginFill(0x33FF00, .1);
            this.sensor.arc(0, 0, Math.max(this.sight - 16, 0), 0, -Math.PI, true);
            this.sensor.endFill();
        }

        consume(pellet: FoodPellet) {
            if (pellet.overlap(this.mouth)) {
                this.diminishEnergy(pellet.nutrition);
                this.hunger = Phaser.Math.clamp(100 - this.energy, 0, 100);
                pellet.kill();
                this.playBite();
            }
        }

        playBite() {
            this.mouth.animations.play('eat', 75, false);
        }

        diminishEnergy(energy: number) {
            this.energy += energy;
            this.redrawHealthBar();
            if (this.energy <= 0) {
                this.kill();
            }
        }

        spotTarget(group: Phaser.Group): BaseObject {
            var target: BaseObject;
            var shortestDistance = this.sight;

            group.forEachAlive((member: BaseObject) => {
                var distance = Math.abs(this.game.physics.arcade.distanceBetween(this, member));
                if (distance < shortestDistance) {
                    var angleBetween = Phaser.Math.radToDeg(this.game.physics.arcade.angleBetween(this, member));
                    var offsetRotation = this.angle - 90;

                    var diff = Math.abs(angleBetween - offsetRotation);

                    if (diff < 90 || diff > 270) {
                        shortestDistance = distance;
                        target = member;
                    }
                }
            }, this);

            return target;

        }

        chaseBehavior() {
            
            var target = this.spotTarget(this.arena.wildBlocks);
            
            this.target = target;            

            if (target) {
                this.body.angularVelocity = 0;
                this.game.physics.arcade.accelerateToObject(this, target, this.acceleration, this.maxSpeed, this.maxSpeed);
            } else if (!this.feedBehavior()) {
                //tamed blocks wander fast ... maybe they should be prowling
                if (Math.random() > .5) {                    
                    this.wanderBehavior(1);
                }
                else {
                    this.prowlBehavior();
                }
            }

            this.rotateToDirectionOfTravel();
        }

        wanderBehavior(speedMultiplier: number = 1) {
            //Use energy while wandering
            this.diminishEnergy(-0.01);
            if (this.changeAcceleration-- <= 0) {
                this.body.angularVelocity = 0;

                var accel = this.acceleration * speedMultiplier;
                this.body.acceleration.x = Math.random() * accel - (accel / 2);
                this.body.acceleration.y = Math.random() * accel - (accel / 2);
                this.changeAcceleration = 200;

            }
        }

        feedBehavior(): boolean {
            var closestFood = this.spotTarget(this.arena.foodPellets);

            this.closestFood = closestFood;

            if (closestFood) {
                //Use energy while attempting to feed
                this.diminishEnergy(-0.01);

                this.game.physics.arcade.accelerateToObject(this, closestFood, this.acceleration, this.maxSpeed, this.maxSpeed);

                return true;
            }

            return false;
        }        

        fleeBehavior() {
            //Use more energy while fleeing
            this.diminishEnergy(-0.05);
            var target = this.spotTarget(this.arena.tamedBlocks);

            if (target) {
                var targetX = this.x - (target.x - this.x);
                var targetY = this.y - (target.y - this.y);
                this.game.physics.arcade.accelerateToXY(this, targetX, targetY, this.acceleration, this.maxSpeed, this.maxSpeed);
            } else if (!this.feedBehavior()) {
                //wild blocks wander slowly
                this.wanderBehavior(.1);
            }

            this.rotateToDirectionOfTravel();
        };

        rotateToDirectionOfTravel() {
            if (this.body.acceleration.x != 0 || this.body.acceleration.y != 0) {                

                var desiredAngle = Phaser.Math.wrapAngle(this.game.physics.arcade.angleToXY(this, this.x + this.body.acceleration.x, this.y + this.body.acceleration.y) + (Math.PI / 2),true);
                var angleDiff = Phaser.Math.wrapAngle(desiredAngle - this.rotation, true);
                if (Math.abs(angleDiff) < Math.PI / 64) {
                    this.rotation = desiredAngle;
                } else {
                    if (angleDiff < 0) {
                        this.rotation -= (Math.PI / 64);
                    } else {
                        this.rotation += (Math.PI / 64);
                    }
                }
            }
            
        }

        prowlBehavior(): void {
            //Use more energy while prowling
            this.diminishEnergy(-0.05);
            if (this.changeAcceleration-- <= 0) {

                var body = <Phaser.Physics.Arcade.Body>this.body;
                //body.velocity.multiply(0, 0);
                body.acceleration.multiply(0, 0);                                   
                if (this.body.angularAcceleration == 0 || this.body.angularAcceleration == -50) {
                    this.body.angularAcceleration = 50;
                } else {
                    this.body.angularAcceleration = -50;
                }
                this.changeAcceleration = 250;                

            }
        }
    }
}