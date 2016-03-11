﻿module BlockTaming {

    export class SimpleGame extends Phaser.Game {

        constructor() {

            super(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

            this.state.add('Arena', Arena, false);

            this.state.start('Arena');

        }
    }


    export class Arena extends Phaser.State {

        wildBlocks: Phaser.Group;
        tamedBlocks: Phaser.Group;
        foodPellets: Phaser.Group;
        tamingStarted: boolean;
        foodCounter: number;
        text: any;

        preload() {

            this.load.image('untamed', 'assets/untamed.png');
            this.load.image('tamed', 'assets/tamed.png');
            this.load.image('foodPellet', 'assets/foodPellet.png');
            this.load.spritesheet('mouth', 'assets/mouth.png',20,10);

        }

        moveToTamed(block: Block) {
            this.wildBlocks.remove(block);
            this.tamedBlocks.add(block);
        }

        create() {

            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.wildBlocks = this.add.group();            
            this.tamedBlocks = this.add.group();
            this.foodPellets = this.add.group();

            this.tamedBlocks.enableBody = true;
            this.wildBlocks.enableBody = true;
            this.foodPellets.enableBody = true;

            for (var i = 0; i < 1; i++) {
                var block = new Block(this, Math.random() * 400, Math.random() * 100, Math.random() * 200);
            }

            for (var i = 0; i < 20; i++) {
                new FoodPellet(this, Math.random() * 100);
            }

            this.tamingStarted = false;

            //Adds a simple 
            this.foodCounter = 0;
            this.game.time.events.loop(Phaser.Timer.SECOND, this.nextFoodCounter, this);
        }

        nextFoodCounter() {
            this.foodCounter++;
            if (this.foodCounter == 20) {
                this.foodPellets.add(new FoodPellet(this, Math.random() * 100));
                this.foodCounter = 0;
            }
        }

        update() {
            var self = this;
            this.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild: Block, tamed: Block) {
                if (tamed.mouth.overlap(wild)) {
                    tamed.playBite();
                    wild.tame();
                }
            });
            this.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
            this.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);

            this.physics.arcade.collide(this.foodPellets, this.foodPellets);

            this.physics.arcade.collide(this.foodPellets, this.tamedBlocks, function (pellet: FoodPellet, block: Block) {
                block.consume(pellet);
            });
            this.physics.arcade.collide(this.foodPellets, this.wildBlocks, function (pellet: FoodPellet, block: Block) {
                block.consume(pellet);
            });
        }

        render() {
            this.tamedBlocks.forEachAlive((block: Block) => {
                this.game.debug.body(block);
            }, this);
        }



    }
}
window.onload = () => {

    var game = new BlockTaming.SimpleGame();

};