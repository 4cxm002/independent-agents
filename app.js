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
            this.load.image('foodPellet', 'assets/foodPellet.png');
        };
        Arena.prototype.moveToTamed = function (block) {
            this.wildBlocks.remove(block);
            this.tamedBlocks.add(block);
        };
        Arena.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.wildBlocks = this.add.group();
            this.tamedBlocks = this.add.group();
            this.foodPellets = this.add.group();
            this.tamedBlocks.enableBody = true;
            this.wildBlocks.enableBody = true;
            this.foodPellets.enableBody = true;
            for (var i = 0; i < 2; i++) {
                var block = new BlockTaming.Block(this, Math.random() * 400, Math.random() * 100, Math.random() * 200);
            }
            for (var i = 0; i < 20; i++) {
                new BlockTaming.FoodPellet(this, Math.random() * 100);
            }
            this.tamingStarted = false;
        };
        Arena.prototype.update = function () {
            var self = this;
            this.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild, tamed) {
                wild.tame();
            });
            this.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
            this.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);
            this.physics.arcade.collide(this.foodPellets, this.tamedBlocks);
            this.physics.arcade.collide(this.foodPellets, this.foodPellets);
            this.physics.arcade.collide(this.foodPellets, this.wildBlocks);
        };
        Arena.prototype.render = function () {
            var _this = this;
            this.wildBlocks.forEachAlive(function (block) {
                var circle = new Phaser.Circle(block.x, block.y, block.sight * 2);
                // Draw debug tools
                _this.game.debug.geom(circle, 'rgba(255,0,0,.5)');
            }, this);
            this.tamedBlocks.forEachAlive(function (block) {
                var circle = new Phaser.Circle(block.x, block.y, block.sight * 2);
                // Draw debug tools
                _this.game.debug.geom(circle, 'rgba(0,255,0,.5)');
                if (block.target) {
                    var attn = new Phaser.Circle(block.x, block.y - 30, 20);
                    // Draw debug tools
                    _this.game.debug.geom(attn, 'rgba(0,0,255,1)');
                }
            }, this);
        };
        return Arena;
    })(Phaser.State);
    BlockTaming.Arena = Arena;
})(BlockTaming || (BlockTaming = {}));
window.onload = function () {
    var game = new BlockTaming.SimpleGame();
};
//# sourceMappingURL=app.js.map