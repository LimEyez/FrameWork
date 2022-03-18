class Matrix {
    constructor(values = [[]]) {
        this.values = [];
        values.forEach((array, i) => {
            this.values[i] = [];
            array.forEach(el => this.values[i].push(el));
        });
    }

    toString() {
        return this.values.map(array => array.map(el => el.toString()).join(', ')).join('\n');
    }
}