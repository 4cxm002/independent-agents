module BlockTaming {
    export class Egg extends BaseObject {

        firstParent: Block;
        secondParent: Block;

        constructor(arena: Arena, firstParent: Block, secondParent: Block) {
            super(arena, firstParent.x, firstParent.y, 'egg', arena.eggs);
                       
            this.firstParent = firstParent;
            this.secondParent = secondParent;

            this.game.time.events.add(Phaser.Timer.SECOND * 10, this.hatch, this);
        }

        hatch() {
            //TODO: Assign stats for base block
            var childDna = Block.createChildFromParents(this.firstParent, this.secondParent);
            new Block(this.arena, childDna);
        }
    }

} 