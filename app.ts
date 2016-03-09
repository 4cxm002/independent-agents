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
        tamingStarted: boolean;

        preload() {

            this.load.image('untamed', 'assets/untamed.png');
            this.load.image('tamed', 'assets/tamed.png');

        }

        moveToTamed(block: Block) {
            this.wildBlocks.remove(block);
            this.tamedBlocks.add(block);
        }

        create() {

            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.wildBlocks = this.add.group();

            this.tamedBlocks = this.add.group();

            this.tamedBlocks.enableBody = true;
            this.wildBlocks.enableBody = true;

            for (var i = 0; i < 20; i++) {
                this.wildBlocks.add(new Block(this, Math.random() * 400, Math.random() * 100, Math.random() * 200));
            }
            this.tamingStarted = false;
        }


        update() {
            var self = this;
            this.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild: Block, tamed: Block) {
                wild.tame();
            });
            this.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
            this.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);
        }

    }
}
window.onload = () => {

    var game = new BlockTaming.SimpleGame();

};