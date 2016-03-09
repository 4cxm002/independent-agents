module BlockTaming {
    export class Block extends Phaser.Sprite {

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

        changeAcceleration: number;
        tamed: boolean;
        think: () => void;
        arena: Arena;

        constructor(arena: Arena, maxSpeed: number, acceleration: number, sight: number) {

            var randomX, randomY;

            do {
                randomX = Math.random() * (arena.world.width - 100) + 50;
                randomY = Math.random() * (arena.world.height - 100) + 50;
            } while (arena.physics.arcade.getObjectsAtLocation(randomX, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, arena.wildBlocks).length > 0);

            super(arena.game, randomX, randomY, 'untamed');

            arena.wildBlocks.add(this);

            this.body.bounce.y = 0.2;
            this.body.bounce.x = 0.2;
            this.body.collideWorldBounds = true;
            this.body.maxVelocity.x = maxSpeed;
            this.body.maxVelocity.y = maxSpeed;

            this.inputEnabled = true;

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
            this.arena = arena;
            this.maxSpeed = maxSpeed;
            this.acceleration = acceleration;
            this.sight = sight;
        }

        update() {
            super.update();
            this.think();            
        }

        tame() {
            this.loadTexture('tamed', 0);
            this.think = this.chaseBehavior;
            this.tamed = true;
            this.arena.moveToTamed(this);            
        }

        chaseBehavior() {
            var target: Block;
            var shortestDistance = this.sight;

            this.arena.wildBlocks.forEachAlive((wild: Block) => {
                var distance = Math.abs(this.game.physics.arcade.distanceBetween(this, wild));
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    target = wild;
                }
            }, this);            

            if (target) {
                this.game.physics.arcade.accelerateToObject(this, target, this.acceleration, this.maxSpeed, this.maxSpeed);
            } else {
                if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
                    this.body.acceleration.x = Math.random() * this.acceleration - (this.acceleration / 2);
                    this.body.acceleration.y = Math.random() * this.acceleration - (this.acceleration / 2);
                    this.changeAcceleration = 200;
                }
            }
        }
          

        fleeBehavior() {
            var target: Block;
            var shortestDistance = this.sight;

            this.arena.tamedBlocks.forEachAlive((tamed: Block) => {
                var distance = Math.abs(this.game.physics.arcade.distanceBetween(this, tamed));
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    target = tamed;
                }
            }, this);

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
        };


    }
}