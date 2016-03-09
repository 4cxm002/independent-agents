/// <reference path="phaser.d.ts"/>
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: this.preload, create: this.create, update: this.update });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('untamed', 'assets/untamed.png');
        this.game.load.image('tamed', 'assets/tamed.png');
    };
    SimpleGame.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.wildBlocks = this.game.add.group();
        this.tamedBlocks = this.game.add.group();
        this.tamedBlocks.enableBody = true;
        this.wildBlocks.enableBody = true;
        for (var i = 0; i < 20; i++) {
            this.wildBlocks.add(new Block(this, this.game));
        }
        this.tamingStarted = false;
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild, tamed) {
            this.tameBlock(wild);
        });
        this.game.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
        this.game.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);
    };
    SimpleGame.prototype.tameBlock = function (block) {
        this.wildBlocks.remove(block);
        block.loadTexture('tamed', 0);
        this.tamedBlocks.add(block);
        block.tamed = true;
    };
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map