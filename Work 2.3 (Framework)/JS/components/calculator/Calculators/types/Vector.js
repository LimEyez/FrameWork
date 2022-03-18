/*class Vector {
	constructor (x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
        this.z = z;
		//console.log(this.re, this.im)
	}
	
}*/

class Vector{
    constructor(values = []) {
        this.values = [];
        values.forEach(el => this.values.push(el));
    }

    toString() {
        return '(' + 
            this.values.map(el => el.toString()).join(' ') + 
            ')';
    }
}