var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlockTaming;
(function (BlockTaming) {
    var SimpleGame = (function (_super) {
        __extends(SimpleGame, _super);
        function SimpleGame() {
            _super.call(this, window.innerWidth, window.innerHeight, Phaser.AUTO, '');
            this.state.add('Arena', Arena, false);
            this.state.start('Arena');
        }
        return SimpleGame;
    })(Phaser.Game);
    BlockTaming.SimpleGame = SimpleGame;
    var Arena = (function (_super) {
        __extends(Arena, _super);
        function Arena() {
            _super.apply(this, arguments);
        }
        Arena.prototype.preload = function () {
            this.load.image('untamed', 'assets/untamed.png');
            this.load.image('tamed', 'assets/tamed.png');
        };
        Arena.prototype.tameBlock = function (block) {
            block.tame();
            this.wildBlocks.remove(block);
            this.tamedBlocks.add(block);
        };
        Arena.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.wildBlocks = this.add.group();
            this.tamedBlocks = this.add.group();
            this.tamedBlocks.enableBody = true;
            this.wildBlocks.enableBody = true;
            for (var i = 0; i < 20; i++) {
                this.wildBlocks.add(new BlockTaming.Block(this));
            }
            this.tamingStarted = false;
        };
        Arena.prototype.update = function () {
            var self = this;
            this.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild, tamed) {
                self.tameBlock(wild);
            });
            this.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
            this.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);
        };
        return Arena;
    })(Phaser.State);
    BlockTaming.Arena = Arena;
})(BlockTaming || (BlockTaming = {}));
window.onload = function () {
    var game = new BlockTaming.SimpleGame();
};
//# sourceMappingURL=app.js.map