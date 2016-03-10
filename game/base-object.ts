module BlockTaming {
    export class BaseObject extends Phaser.Sprite {
        arena: Arena;
        think: () => void;

        constructor(arena: Arena, x: number, y: number, spriteKey: string, group?: Phaser.Group) {
            super(arena.game, x, y, spriteKey);
            
            if (group) {
                group.add(this);
            } else {
                arena.game.world.add(this);
                this.physicsEnabled = true;
            }

            this.body.collideWorldBounds = true;
            this.anchor.setTo(0.5, 0.5);

            this.inputEnabled = true;
            this.inputEnabled = true;

            this.input.enableDrag();

            //Custom properties
            this.arena = arena;
        }

        update() {
            super.update();
            if (this.think) {
                this.think();
            }
        }
    }
} 