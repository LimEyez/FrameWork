class Polynomial {
	constructor(poly = []) {
		this.poly = poly;
		this.poly.sort((a, b) => b.power - a.power/*функция сравнения*/);
	}
	
	getValue(x){
		const calc = new Calculator;
		/* Есть функция reduce*/ /* S - накапливающий элемент*/ /*elem - какой-то элемент*/
		return this.poly.reduce((S, elem) => 
			calc.add(
				S,
				calc.prod(
					calc.pow(x, elem.power), 
					elem.value)
			), 
			calc.zero(null, x)
		);
	}

	// toString() {
    //     return this.toStr('toString')
    // }

    // toMath() {
    //     return this.toStr('toMath')
    // }

	// toStr(key) {
    //     return this.poly.map((el, i) => (el.value > 0) ? 
    //         `${i == 0 ? '' : '+'}${el[key]()}` :
    //         el[key]()).join('');
    // }
	
    toString() {
        return this.poly.map(
            (el, i) => (el.value > 0) ? 
                `${(i == 0) ? '' : '+'}${el.toString()}` : 
                el.toString()
        ).join('');
    }
}