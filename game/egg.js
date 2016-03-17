var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlockTaming;
(function (BlockTaming) {
    var Egg = (function (_super) {
        __extends(Egg, _super);
        function Egg(arena, firstParent, secondParent) {
            _super.call(this, arena, firstParent.x, firstParent.y, 'egg', arena.eggs);
            this.firstParent = firstParent;
            this.secondParent = secondParent;
            this.game.time.events.add(Phaser.Timer.SECOND * 10, this.hatch, this);
        }
        Egg.prototype.hatch = function () {
            //TODO: Assign stats for base block
            var childDna = BlockTaming.Block.createChildFromParents(this.firstParent, this.secondParent);
            new BlockTaming.Block(this.arena, childDna);
            this.kill();
        };
        return Egg;
    })(BlockTaming.BaseObject);
    BlockTaming.Egg = Egg;
})(BlockTaming || (BlockTaming = {}));
//# sourceMappingURL=egg.js.map