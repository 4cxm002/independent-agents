var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlockTaming;
(function (BlockTaming) {
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block(arena, maxSpeed, acceleration, sight) {
            var randomX, randomY;
            do {
                randomX = Math.random() * (arena.world.width - 100) + 50;
                randomY = Math.random() * (arena.world.height - 100) + 50;
            } while (arena.physics.arcade.getObjectsAtLocation(randomX, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, arena.wildBlocks).length > 0);
            _super.call(this, arena, randomX, randomY, 'untamed', arena.wildBlocks);
            this.body.bounce.y = 0.2;
            this.body.bounce.x = 0.2;
            this.body.maxVelocity.x = maxSpeed;
            this.body.maxVelocity.y = maxSpeed;
            var self;
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
        }
        Block.prototype.tame = function () {
            this.loadTexture('tamed', 0);
            this.think = this.chaseBehavior;
            this.tamed = true;
            this.arena.moveToTamed(this);
        };
        Block.prototype.spotTarget = function (group) {
            var _this = this;
            var target;
            var shortestDistance = this.sight;
            group.forEachAlive(function (member) {
                var distance = Math.abs(_this.game.physics.arcade.distanceBetween(_this, member));
                if (distance < shortestDistance) {
                    var angleBetween = Phaser.Math.radToDeg(_this.game.physics.arcade.angleBetween(_this, member));
                    var offsetRotation = _this.angle - 90;
                    var diff = Math.abs(angleBetween - offsetRotation);
                    if (diff < 90 || diff > 270) {
                        shortestDistance = distance;
                        target = member;
                    }
                }
            }, this);
            return target;
        };
        Block.prototype.chaseBehavior = function () {
            var target = this.spotTarget(this.arena.wildBlocks);
            this.target = target;
            if (target) {
                this.game.physics.arcade.accelerateToObject(this, target, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.game.debug.text("Target acquired", 32, 32);
                this.rotateBehavior(target, false);
            }
            else {
                if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
                    this.body.acceleration.x = Math.random() * this.acceleration - (this.acceleration / 2);
                    this.body.acceleration.y = Math.random() * this.acceleration - (this.acceleration / 2);
                    this.changeAcceleration = 200;
                }
            }
        };
        Block.prototype.fleeBehavior = function () {
            var target = this.spotTarget(this.arena.tamedBlocks);
            if (target) {
                var targetX = this.x - (target.x - this.x);
                var targetY = this.y - (target.y - this.y);
                this.game.physics.arcade.accelerateToXY(this, targetX, targetY, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.rotateBehavior(target, true);
            }
            else {
                if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
                    this.body.acceleration.x = Math.random() * (this.acceleration / 10) - (this.acceleration / 2 / 10);
                    this.body.acceleration.y = Math.random() * (this.acceleration / 10) - (this.acceleration / 2 / 10);
                    this.changeAcceleration = 200;
                }
            }
        };
        ;
        Block.prototype.rotateBehavior = function (destination, isRunningAway) {
            if (isRunningAway) {
                this.rotation = this.game.physics.arcade.angleBetween(this, destination) - 90;
            }
            else {
                this.rotation = this.game.physics.arcade.angleBetween(this, destination) + 90;
            }
        };
        return Block;
    })(BlockTaming.BaseObject);
    BlockTaming.Block = Block;
})(BlockTaming || (BlockTaming = {}));
//# sourceMappingURL=block.js.map