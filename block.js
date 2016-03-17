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
        function Block(arena, dna) {
            var randomX, randomY;
            do {
                randomX = Math.random() * (arena.world.width - 100) + 50;
                randomY = Math.random() * (arena.world.height - 100) + 50;
            } while (arena.physics.arcade.getObjectsAtLocation(randomX, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, arena.wildBlocks).length > 0);
            _super.call(this, arena, randomX, randomY, 'blockSprite', arena.wildBlocks);
            this.decode(dna);
            this.body.bounce.y = 0.2;
            this.body.bounce.x = 0.2;
            this.body.maxVelocity.x = this.maxSpeed;
            this.body.maxVelocity.y = this.maxSpeed;
            var body = this.body;
            body.maxAngular = 100;
            this.body.allowRotation = true;
            //create mouth for eating
            this.mouth = this.game.add.sprite(-10, -17, 'mouth');
            this.game.physics.enable(this.mouth, Phaser.Physics.ARCADE);
            this.addChild(this.mouth);
            this.mouth.animations.add('eat', [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0]);
            this.sensor = this.game.add.graphics(0, 0);
            this.addChild(this.sensor);
            this.sensor.beginFill(this.tint, .1);
            this.sensor.arc(0, 0, Math.max(this.sight - 16, 0), 0, -Math.PI, true);
            this.sensor.endFill();
            this.healthBar = this.game.add.graphics(0, 0);
            this.addChild(this.healthBar);
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
            this.energy = 100;
            this.hunger = 0;
            this.think = this.evaluateOptions;
            this.redrawHealthBar();
        }
        Block.createChildFromParents = function (firstParent, secondParent) {
            var maxDnaSize = 81;
            var childDna = "";
            for (var i = 0; i < maxDnaSize; i++) {
                if (Math.random() >= .5) {
                    childDna += firstParent.dna.substr(i, 1);
                }
                else {
                    childDna += secondParent.dna.substr(i, 1);
                }
            }
            return childDna;
        };
        Block.createRandomDnaString = function () {
            var maxDnaSize = 81;
            var newDna = "";
            while (newDna.length < maxDnaSize) {
                newDna += Math.random() >= .5 ? "1" : "0";
            }
            return newDna;
        };
        Block.prototype.decode = function (dna) {
            this.dna = dna;
            this.strength = parseInt(dna.substr(0, 8), 2);
            this.acceleration = parseInt(dna.substr(8, 8), 2);
            this.maxSpeed = parseInt(dna.substr(16, 8), 2);
            this.sight = parseInt(dna.substr(24, 8), 2);
            this.vitality = parseInt(dna.substr(32, 8), 2);
            this.aggression = parseInt(dna.substr(40, 8), 2);
            this.insanity = parseInt(dna.substr(48, 8), 2);
            //tint is a color and is 3 bytes long
            this.tint = parseInt(dna.substr(56, 24), 2);
            this.gender = parseInt(dna.substr(80, 1), 2);
        };
        Block.prototype.evaluateOptions = function () {
            //Step 1: if we are actively doing something, see if we should continue doing it
            if (this.activeAction && this.activeActionPriority > 0) {
                if (this.activeAction() < 1) {
                    this.activeAction = null;
                }
            }
            else {
                var possibleActions = new BlockTaming.ActionQueue();
                possibleActions.Add(this.hunger * 2, this.feedBehavior);
                possibleActions.Add(this.aggression, this.chaseBehavior);
                possibleActions.Add(256 - this.vitality, this.prowlBehavior);
                possibleActions.Add(256 - this.strength, this.fleeBehavior);
                possibleActions.Add(this.insanity - this.hunger, this.wanderBehavior);
                var executionResult = -1;
                do {
                    var action = possibleActions.Shift();
                    if (action) {
                        executionResult = action.bind(this)();
                        if (executionResult == 1) {
                            this.activeAction = action.bind(this);
                            console.log('opted to ' + action);
                        }
                        this.activeActionPriority = executionResult;
                    }
                    else {
                        executionResult = 1;
                        this.activeAction = undefined;
                    }
                } while (executionResult < 0);
            }
        };
        Block.prototype.redrawHealthBar = function () {
            this.healthBar.clear();
            this.healthBar.beginFill(0x000000, 1);
            this.healthBar.drawRect(-13, 10, 26, 5);
            this.healthBar.beginFill(0xFF3300, 1);
            this.healthBar.drawRect(-12, 11, 24 * (Math.min(this.energy, 100) / 100), 3);
            this.healthBar.endFill();
        };
        Block.prototype.tame = function () {
            this.tint = 0x00FF00;
            this.tamed = true;
            this.arena.moveToTamed(this);
            this.sensor.clear();
            this.sensor.beginFill(0x33FF00, .1);
            this.sensor.arc(0, 0, Math.max(this.sight - 16, 0), 0, -Math.PI, true);
            this.sensor.endFill();
        };
        Block.prototype.consume = function (pellet) {
            if (pellet.overlap(this.mouth)) {
                this.diminishEnergy(pellet.nutrition);
                pellet.kill();
                this.playBite();
            }
        };
        Block.prototype.playBite = function () {
            this.mouth.animations.play('eat', 75, false);
            //uhhh reset their action when they bite something
            this.activeAction = undefined;
        };
        Block.prototype.diminishEnergy = function (energy) {
            this.energy += energy;
            this.hunger = 256 - Phaser.Math.clamp(this.energy / 100 * 256, 0, 256);
            this.redrawHealthBar();
            if (this.energy <= 0) {
                this.kill();
            }
        };
        Block.prototype.spotTarget = function (group) {
            var _this = this;
            var target;
            var shortestDistance = this.sight;
            group.forEachAlive(function (member) {
                if (_this != member) {
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
                }
            }, this);
            return target;
        };
        Block.prototype.chaseBehavior = function () {
            var target = this.spotTarget(this.arena.wildBlocks);
            this.target = target;
            if (target) {
                this.diminishEnergy(-0.05);
                this.body.angularVelocity = 0;
                this.game.physics.arcade.accelerateToObject(this, target, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.rotateToDirectionOfTravel();
                return 1;
            }
            return -1;
        };
        Block.prototype.wanderBehavior = function (speedMultiplier) {
            if (speedMultiplier === void 0) { speedMultiplier = .5; }
            //Use energy while wandering
            this.diminishEnergy(-0.01);
            var accel = this.acceleration * speedMultiplier;
            this.body.acceleration.x = Math.random() * accel - (accel / 2);
            this.body.acceleration.y = Math.random() * accel - (accel / 2);
            this.rotateToDirectionOfTravel();
            return 0;
        };
        Block.prototype.feedBehavior = function () {
            var closestFood = this.spotTarget(this.arena.foodPellets);
            this.closestFood = closestFood;
            if (closestFood) {
                //Use energy while attempting to feed
                this.diminishEnergy(-0.01);
                this.game.physics.arcade.accelerateToObject(this, closestFood, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.rotateToDirectionOfTravel();
                return 1;
            }
            return -1;
        };
        Block.prototype.fleeBehavior = function () {
            var target = this.spotTarget(this.arena.tamedBlocks);
            if (target) {
                //Use more energy while fleeing
                this.diminishEnergy(-0.05);
                var targetX = this.x - (target.x - this.x);
                var targetY = this.y - (target.y - this.y);
                this.game.physics.arcade.accelerateToXY(this, targetX, targetY, this.acceleration, this.maxSpeed, this.maxSpeed);
                this.rotateToDirectionOfTravel();
                return 1;
            }
            return -1;
        };
        ;
        Block.prototype.rotateToDirectionOfTravel = function () {
            if (this.body.acceleration.x != 0 || this.body.acceleration.y != 0) {
                var desiredAngle = Phaser.Math.wrapAngle(this.game.physics.arcade.angleToXY(this, this.x + this.body.acceleration.x, this.y + this.body.acceleration.y) + (Math.PI / 2), true);
                var angleDiff = Phaser.Math.wrapAngle(desiredAngle - this.rotation, true);
                if (Math.abs(angleDiff) < Math.PI / 64) {
                    this.rotation = desiredAngle;
                }
                else {
                    if (angleDiff < 0) {
                        this.rotation -= (Math.PI / 64);
                    }
                    else {
                        this.rotation += (Math.PI / 64);
                    }
                }
            }
        };
        Block.prototype.prowlBehavior = function () {
            //Use more energy while prowling
            this.diminishEnergy(-0.05);
            if (this.changeAcceleration-- <= 0) {
                var accel = this.acceleration * .25;
                this.body.acceleration.x = Math.random() * accel - (accel / 2);
                this.body.acceleration.y = Math.random() * accel - (accel / 2);
                if (this.body.angularAcceleration == 0 || this.body.angularAcceleration == -50) {
                    this.body.angularAcceleration = 50;
                }
                else {
                    this.body.angularAcceleration = -50;
                }
                this.changeAcceleration = 250;
            }
            return 0;
        };
        return Block;
    })(BlockTaming.BaseObject);
    BlockTaming.Block = Block;
})(BlockTaming || (BlockTaming = {}));
//# sourceMappingURL=block.js.map