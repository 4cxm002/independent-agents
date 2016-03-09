/// <reference path="phaser.d.ts"/>

class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: this.preload, create: this.create, update: this.update });
    }

    game: Phaser.Game;
    wildBlocks: Phaser.Group;
    tamedBlocks: Phaser.Group;
    tamingStarted: boolean;

    preload() {

        this.game.load.image('untamed', 'assets/untamed.png');
        this.game.load.image('tamed', 'assets/tamed.png');

    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.wildBlocks = this.game.add.group();

        this.tamedBlocks = this.game.add.group();

        this.tamedBlocks.enableBody = true;
        this.wildBlocks.enableBody = true;

        for (var i = 0; i < 20; i++) {
            this.wildBlocks.add(new Block(this, this.game));
        }
        this.tamingStarted = false;
    }

    update() {
        this.game.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild, tamed) {
            this.tameBlock(wild);
        });
        this.game.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
        this.game.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);
    }

    tameBlock(block: Block) {
        this.wildBlocks.remove(block);
        block.loadTexture('tamed', 0);
        this.tamedBlocks.add(block);
        block.tamed = true;        
    }



}

window.onload = () => {

    var game = new SimpleGame();

};