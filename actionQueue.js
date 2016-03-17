var BlockTaming;
(function (BlockTaming) {
    var ActionQueue = (function () {
        function ActionQueue() {
            this.ranks = new Array();
            this.actions = new Array();
        }
        ActionQueue.prototype.Add = function (rank, action) {
            for (var i = 0; i < this.ranks.length; i++) {
                if (this.ranks[i] < rank) {
                    this.ranks.splice(i, 0, rank);
                    this.actions.splice(i, 0, action);
                    return;
                }
            }
            this.ranks.push(rank);
            this.actions.push(action);
        };
        ActionQueue.prototype.Shift = function () {
            if (this.ranks.length > 0) {
                this.ranks.shift();
                return this.actions.shift();
            }
            else {
                return undefined;
            }
        };
        return ActionQueue;
    })();
    BlockTaming.ActionQueue = ActionQueue;
})(BlockTaming || (BlockTaming = {}));
//# sourceMappingURL=actionQueue.js.map