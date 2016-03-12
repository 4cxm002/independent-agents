module BlockTaming {
    export class ActionQueue<T> {

        private actions: T[]
        private ranks: number[];

        constructor() {
            this.ranks = new Array<number>();
            this.actions = new Array<T>();
        }

        Add(rank: number, action: T): void {
            for (var i = 0; i < this.ranks.length; i++) {
                if (this.ranks[i] < rank) {
                    this.ranks.splice(i, 0, rank);
                    this.actions.splice(i, 0, action);
                    return;
                }
            }
            
            this.ranks.push(rank);
            this.actions.push(action);
        }

        Shift(): T {
            if (this.ranks.length > 0) {
                this.ranks.shift();
                return this.actions.shift();
            } else {
                return undefined;
            }
        }
    }

} 