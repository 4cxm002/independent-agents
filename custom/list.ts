module BlockTaming {
    export class List<T>{
        private items: Array<T>;

        constructor() {
            this.items = [];
        }

        size(): number {
            return this.items.length;
        }

        add(value: T): void {
            this.items.push(value);
        }

        get(index: number): T {
            return this.items[index];
        }

        remove(value: T): void{
            for (var i = 0; i < this.size(); i++)
            {
                var item = this.get(i);
                if (item == value) {
                    this.items.splice(i, 1);
                    return;
                }
            }
        }
    }
} 