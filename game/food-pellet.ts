module BlockTaming {
    export class FoodPellet extends BaseObject {

        //Relevant stats
        nutrition: number;
        changeAcceleration: number;
        acceleration: number;
        
        constructor(arena: Arena, nutrition: number) {

            var randomX, randomY;

            do {
                randomX = Math.random() * (arena.world.width - 100) + 50;
                randomY = Math.random() * (arena.world.height - 100) + 50;
            } while (arena.physics.arcade.getObjectsAtLocation(randomX, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX, randomY + 32, arena.wildBlocks).length > 0 ||
                arena.physics.arcade.getObjectsAtLocation(randomX + 32, randomY + 32, arena.wildBlocks).length > 0);

            super(arena, randomX, randomY, 'foodPellet', arena.foodPellets);
                        
            this.body.bounce.y = 0.5;
            this.body.bounce.x = 0.5;
            this.body.maxVelocity.x = 400 / nutrition;
            this.body.maxVelocity.y = 400 / nutrition;

            //Custom properties
            this.think = this.floatBehavior;
            this.nutrition = nutrition;
            this.changeAcceleration = 10;
            this.acceleration = Math.random() * 50;
        }
      

        floatBehavior() {            
            if (this.body.acceleration.x == 0 || this.changeAcceleration-- <= 0) {
                this.body.acceleration.x = Math.random() * this.acceleration - this.acceleration / 2;
                this.body.acceleration.y = Math.random() * this.acceleration - this.acceleration / 2;
                this.changeAcceleration = 200;
            }            
        };
    }
}