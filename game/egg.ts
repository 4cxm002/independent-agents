module BlockTaming {
    export class Egg extends BaseObject {

        constructor(arena: Arena, firstParent: BaseObject, secondParent: BaseObject) {

            super(arena, firstParent.body.x, firstParent.body.y, 'egg', arena.eggs);
                       
            this.game.time.events.add(Phaser.Timer.SECOND * 60, this.hatch, firstParent, secondParent);
        }

        hatch(firstParent: BaseObject, secondParent: BaseObject) {
            //TODO: Assign stats for base block
        }
    }

} 