class Block extends Phaser.Sprite {

    changeAcceleration: number;
    tamed: boolean;

    constructor(world: SimpleGame, game: Phaser.Game) {       

        var randomX, randomY;

        do {
            randomX = Math.random() * (game.world.width - 100) + 50;
            randomY = Math.random() * (game.world.height - 100) + 50;
        } while (game.physics.arcade.getObjectsAtLocation(randomX, randomY, world.wildBlocks).length > 0 ||
            game.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, world.wildBlocks).length > 0 ||
            game.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, world.wildBlocks).length > 0 ||
            game.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, world.wildBlocks).length > 0);

        super(game, randomX, randomY,'untamed');

        world.wildBlocks.add(this);

        this.body.bounce.y = 0.2;
        this.body.bounce.x = 0.2;
        this.body.collideWorldBounds = true;
        this.body.maxVelocity.x = 200;
        this.body.maxVelocity.y = 200;

        this.inputEnabled = true;

        var self: Block;
        self = this;

        this.events.onInputDown.add(function () {
            if (!world.tamingStarted) {

                world.tameBlock(self);
                world.tamingStarted = true;

            }
        }, this);

        //Custom properties
        this.tamed = false;
        this.changeAcceleration = 100;
        
    }

    update() {
        super.update();
        if (this.tamed) {
            this.tameThought();
        } else {
            this.untamedThought();
        }
    }

    tameThought() {
        if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
            this.body.acceleration.x = Math.random() * 50 - 25;
            this.body.acceleration.y = Math.random() * 50 - 25;
            this.changeAcceleration = 100;
        }
    };

    untamedThought() {
        if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
            this.body.acceleration.x = Math.random() * 5 - 2.5;
            this.body.acceleration.y = Math.random() * 5 - 2.5;
            this.changeAcceleration = 200;
        }
    };


} 