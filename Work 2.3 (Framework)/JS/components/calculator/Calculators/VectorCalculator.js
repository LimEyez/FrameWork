class VectorCalculator extends RealCalculator {
    add(a, b) {
        const calc = this.get(a.values[0]);
        return new Vector(a.values.map((elem, i) => calc.add(elem, b.values[i])));
    }

    sub(a, b) {
        const calc = this.get(a.values[0]);
        return new Vector(a.values.map((elem, i) => calc.sub(elem, b.values[i])));
    }

    mult(a, b) {
        const calc = this.get(a.values[0]);
        //console.log(a.values[1]);
        return new Vector([
            calc.sub(
                calc.mult(a.values[1], b.values[2]), 
                calc.mult(a.values[2], b.values[1])
            ),
            calc.sub(
                calc.mult(a.values[2], b.values[0]), 
                calc.mult(a.values[0], b.values[2])
            ),
            calc.sub(
                calc.mult(a.values[0], b.values[1]), 
                calc.mult(a.values[1], b.values[0])
            )
        ]);
    }

    prod(a, p) {
        const calc = this.get(a.values[0]);
            p = new Complex(p);
        return new Vector(a.values.map(elem => calc.mult(elem, p)));
    }

    zero(length, elem) {
        const calc = this.get(elem);
        const values = [];
        for(let i = 0; i < length; i++) {
            values.push(this.type(calc, elem, 'zero'));
        }
        return new Vector(values);
    }

    one(length, elem) {
        const calc = this.get(elem);
        const values = [];
        console.log("111");
        for (let i = 0; i < length; i++) {
            values.push(this.type(calc, elem, 'one'));
        }
        return new Vector(values);
    }

    pow(a, n) {
        console.log(n);
        let c = a;
        for (let i = 1; i < n; i++) {
            c = this.mult(a, c);
            console.log(i,  c);
        }
        return c;
    }

    div() {
        return null;
    }
}