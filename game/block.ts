module BlockTaming {
    export class Block extends BaseObject {

        //Relevant stats
        strength: number;
        acceleration: number;
        maxSpeed: number;
        sight: number;
        vitality: number;
        aggression: number;
        hunger: number;
        gender: number;
        insanity: number;
        energy: number;

        changeAcceleration: number;
        tamed: boolean;

        target: BaseObject;
        closestFood: BaseObject;

        mouth: Phaser.Sprite;

        constructor(arena: Arena, maxSpeed: number, acceleration: number, sight: number) {

            var randomX, randomY;

            do {
                randomX = Math.random() * (arena.world.width - 100) + 50;
                randomY = Math.random() * (arena.world.height - 100) + 50;
            } while (arena.physics.arcade.getObjectsAtLocation(randomX, randomY, arena.wildBlocks).length > 0 ||
            arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, arena.wildBlocks).length > 0 ||
            arena.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, arena.wildBlocks).length > 0);

            super(arena, randomX, randomY, 'untamed', arena.wildBlocks);

            this.body.bounce.y = 0.2;
            this.body.bounce.x = 0.2;
            this.body.maxVelocity.x = maxSpeed;
            this.body.maxVelocity.y = maxSpeed;

            //create mouth for eating
            this.mouth = this.game.add.sprite(-10, -17, 'mouth');
            this.game.physics.enable(this.mouth, Phaser.Physics.ARCADE);
            this.addChild(this.mouth);

            this.mouth.animations.add('eat', [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0]);



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
            this.maxSpeed = maxSpeed;
            this.acceleration = acceleration;
            this.sight = sight;
            this.energy = 100;
            this.hunger = 0;
        }

        tame() {
            this.loadTexture('tamed', 0);
            this.think = this.chaseBehavior;
            this.tamed = true;
            this.arena.moveToTamed(this);
        }

        consume(pellet: FoodPellet) {
            if (pellet.overlap(this.mouth)) {
                this.energy += pellet.nutrition;
                this.hunger = Phaser.Math.clamp(100 - this.energy, 0, 100);
                pellet.kill();
                this.playBite();
            }
        }
        playBite() {
            this.mouth.animations.play('eat', 75, false);
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
            var closestFood = this.spotTarget(this.arena.foodPellets);

            this.target = target;
            this.closestFood = closestFood;

            var closestTargetDistance = target == null ? null : Math.abs(this.game.physics.arcade.distanceBetween(this, target));
            var closestFoodDistance = closestFood == null ? null : Math.abs(this.game.physics.arcade.distanceBetween(this, closestFood));

            if (target && (closestFoodDistance == null || closestTargetDistance <= closestFoodDistance)) {
                this.game.physics.arcade.accelerateToObject(this, target, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.game.debug.text("Target acquired", 32, 32);

            } else if (closestFood) {
                this.game.physics.arcade.accelerateToObject(this, closestFood, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.game.debug.text("Food acquired", 32, 32);

            } else {
                if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
                    this.body.acceleration.x = Math.random() * this.acceleration - (this.acceleration / 2);
                    this.body.acceleration.y = Math.random() * this.acceleration - (this.acceleration / 2);
                    this.changeAcceleration = 200;
                }
            }

            this.rotateBehavior(this.x + this.body.acceleration.x, this.y + this.body.acceleration.y);
        }

        fleeBehavior() {
            var target = this.spotTarget(this.arena.tamedBlocks);

            if (target) {
                var targetX = this.x - (target.x - this.x);
                var targetY = this.y - (target.y - this.y);
                this.game.physics.arcade.accelerateToXY(this, targetX, targetY, this.acceleration, this.maxSpeed, this.maxSpeed);
            } else {
                if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
                    this.body.acceleration.x = Math.random() * (this.acceleration / 10) - (this.acceleration / 2 / 10);
                    this.body.acceleration.y = Math.random() * (this.acceleration / 10) - (this.acceleration / 2 / 10);
                    this.changeAcceleration = 200;
                }
            }

            this.rotateBehavior(this.x + this.body.acceleration.x, this.y + this.body.acceleration.y);
        };

        rotateBehavior(x: number, y: number) {
            
            this.rotation = this.game.physics.arcade.angleToXY(this, x, y) + (Math.PI / 2);
            
        }
    }
}