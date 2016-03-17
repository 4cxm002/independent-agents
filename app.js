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
            this.load.image('egg', 'assets/egg.png');
            this.load.image('blockSprite', 'assets/blockSprite.png');
            this.load.image('foodPellet', 'assets/foodPellet.png');
            this.load.spritesheet('mouth', 'assets/mouth.png', 20, 10);
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
            this.eggs = this.add.group();
            this.tamedBlocks.enableBody = true;
            this.wildBlocks.enableBody = true;
            this.foodPellets.enableBody = true;
            this.eggs.enableBody = true;
            for (var i = 0; i < 4; i++) {
                new BlockTaming.Block(this, BlockTaming.Block.createRandomDnaString());
            }
            for (var i = 0; i < 20; i++) {
                new BlockTaming.FoodPellet(this, Math.random() * 100);
            }
            this.tamingStarted = false;
            //Adds a simple 
            this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.nextFoodCounter, this);
            this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.keepPopulationUp, this);
        };
        Arena.prototype.nextFoodCounter = function () {
            this.foodPellets.add(new BlockTaming.FoodPellet(this, Math.random() * 100));
        };
        Arena.prototype.keepPopulationUp = function () {
            if (this.wildBlocks.countLiving() + this.tamedBlocks.countLiving() < 4) {
                new BlockTaming.Block(this, BlockTaming.Block.createRandomDnaString());
            }
        };
        Arena.prototype.update = function () {
            var self = this;
            this.physics.arcade.collide(this.wildBlocks, this.tamedBlocks, function (wild, tamed) {
                if (tamed.mouth.overlap(wild)) {
                    tamed.playBite();
                    wild.tame();
                    new BlockTaming.Egg(self, tamed, wild);
                }
            });
            this.physics.arcade.collide(this.wildBlocks, this.wildBlocks);
            this.physics.arcade.collide(this.tamedBlocks, this.tamedBlocks);
            this.physics.arcade.collide(this.foodPellets, this.foodPellets);
            this.physics.arcade.collide(this.foodPellets, this.tamedBlocks, function (pellet, block) {
                block.consume(pellet);
            });
            this.physics.arcade.collide(this.foodPellets, this.wildBlocks, function (pellet, block) {
                block.consume(pellet);
            });
        };
        Arena.prototype.render = function () {
            //this.tamedBlocks.forEachAlive((block: Block) => {
            //    this.game.debug.body(block);
            //}, this);
        };
        return Arena;
    })(Phaser.State);
    BlockTaming.Arena = Arena;
})(BlockTaming || (BlockTaming = {}));
window.onload = function () {
    var game = new BlockTaming.SimpleGame();
};
//# sourceMappingURL=app.js.map