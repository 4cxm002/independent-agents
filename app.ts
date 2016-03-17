module BlockTaming {

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
        eggs: Phaser.Group;
        tamingStarted: boolean;
        foodCounter: number;
        text: any;

        preload() {
            this.load.image('untamed', 'assets/untamed.png');
            this.load.image('tamed', 'assets/tamed.png');
            this.load.image('egg', 'assets/egg.png');
            this.load.image('blockSprite', 'assets/blockSprite.png');
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
            this.eggs = this.add.group();

            this.tamedBlocks.enableBody = true;
            this.wildBlocks.enableBody = true;
            this.foodPellets.enableBody = true;
            this.eggs.enableBody = true;
            
            for (var i = 0; i < 4; i++) {
                new Block(this, Block.createRandomDnaString());
            }

            for (var i = 0; i < 20; i++) {
                new FoodPellet(this, Math.random() * 100);
            }            

            this.tamingStarted = false;

            //Adds a simple 
            this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.nextFoodCounter, this);
            this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.keepPopulationUp, this);
        }

        nextFoodCounter() {
            this.foodPellets.add(new FoodPellet(this, Math.random() * 100));                
        }

        keepPopulationUp() {
            if (this.wildBlocks.countLiving() + this.tamedBlocks.countLiving() < 4) {
                new Block(this, Block.createRandomDnaString());
            }
        }

        update() {
            var self = this;
            this.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild: Block, tamed: Block) {
                if (tamed.mouth.overlap(wild)) {
                    tamed.playBite();
                    wild.tame();
                    new Egg(self, tamed, wild);
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
            //this.tamedBlocks.forEachAlive((block: Block) => {
            //    this.game.debug.body(block);
            //}, this);
        }



    }
}
window.onload = () => {

    var game = new BlockTaming.SimpleGame();

};