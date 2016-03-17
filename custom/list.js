var BlockTaming;
(function (BlockTaming) {
    var List = (function () {
        function List() {
            this.items = [];
        }
        List.prototype.size = function () {
            return this.items.length;
        };
        List.prototype.add = function (value) {
            this.items.push(value);
        };
        List.prototype.get = function (index) {
            return this.items[index];
        };
        List.prototype.remove = function (value) {
            for (var i = 0; i < this.size(); i++) {
                var item = this.get(i);
                if (item == value) {
                    this.items.splice(i, 1);
                    return;
                }
            }
        };
        return List;
    })();
    BlockTaming.List = List;
})(BlockTaming || (BlockTaming = {}));
//# sourceMappingURL=list.js.map