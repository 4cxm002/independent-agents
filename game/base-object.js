var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BlockTaming;
(function (BlockTaming) {
    var BaseObject = (function (_super) {
        __extends(BaseObject, _super);
        function BaseObject(arena, x, y, spriteKey, group) {
            _super.call(this, arena.game, x, y, spriteKey);
            if (group) {
                group.add(this);
            }
            else {
                arena.game.world.add(this);
                this.physicsEnabled = true;
            }
            this.body.collideWorldBounds = true;
            this.anchor.setTo(0.5, 0.5);
            this.inputEnabled = true;
            this.input.enableDrag();
            //Custom properties
            this.arena = arena;
        }
        BaseObject.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this.think) {
                this.think();
            }
        };
        return BaseObject;
    })(Phaser.Sprite);
    BlockTaming.BaseObject = BaseObject;
})(BlockTaming || (BlockTaming = {}));
//# sourceMappingURL=base-object.js.map