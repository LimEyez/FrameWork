class Calculator extends RealCalculator {

    // toValue(str) {
    //     if (str.includes("*x^")) {return this.toPolinom(str)}
    //     else if (str.includes("\n")) {return this.toMatrix(str)}
    //     else if (str.includes("(")) {return this.toVector(str)} 
    //     else if (str.includes("i*")){ return this.toComplex(str)} 
    //     else {return str - 0}
    // }

    toValue(str) {
        if(str.includes('*x^')) { return this.toPolynomial(str);}
        if(str.includes('\n')) { return this.toMatrix(str);}
        if(str.includes('(')) { return this.toVector(str);}
        if(str.includes('i')) { return this.toComplex(str);}
        return str - 0;
        // return this.toMatrix(str) ||
        //     this.toVector(str) ||
        //     this.toComplex(str) || str - 0;
    }

    // toPolinom(str) {
    //     if (str =="string" && str) {
    //         const arr = str.replace('-', " -").replace("+", " ").split(" ");
    //         return new Polynomial(arr.map(str => this.toMember(str)));

    //     }
    // }


    // toPolynomial(str) {
    //     const arrStr = str.replace('-', ' -').replace('+', ' ').split(' ');
    //     return new Polynomial(arrStr.map(str => this.toMember(str)));
    // }

    toPolynomial(str) {
        if(str instanceof Array) {
            return new Polynomial(str)
        }
        if(str && typeof str == 'string') {
            const members = [];
            const arrStr = str.replace(/\s+/g, '').replace(/-/g, ' -').split(/[+ ]/g);
            for(let i = 0; i < arrStr.length; i++) {
                members.push(this.toMember(arrStr[i]));
            }
            return new Polynomial(members);
        }

    }

	//=============================

    toMember(str) {
        if(typeof str == 'number') {
            return new Member(str);
        }
        if(str && typeof str == 'string') {
            const arrStr = str.split('*x^')
            return new Member(this.toValue(arrStr[0]), arrStr[1] - 0);
        }
    }

    //==============================
	
    toVector(str) {
        if (str instanceof Array) {
            return new Vector(str);
        }
        if (typeof str == 'string' && str) {
            const arr = str.replace('(', '').replace(')', '')
                .split(' ');
            if (arr.length >= 2) {
                return new Vector(arr.map(el => this.toValue(el)));
            }
        }
        return null;
    }

	//=============================

    toComplex(str) {
        if (typeof str == 'number') {
            return str-0;
        }
        if (typeof str == 'string' && str) {
            const arr = str.split('i*');
            if (arr.length == 2) {  
                const operand = arr[0].substr(arr[0].length - 1);
                return new Complex(
                    arr[0].slice(0, -1) - 0,
                    (operand == '-') ?
                    (operand + arr[1]) - 0 : arr[1] - 0
                );
            }
            if (arr.length == 1) {
                return arr[0] - 0;
            }
        }
        return null;
    }

	//=============================

    toMatrix(str) {
        console.log("матрица");
        if (str instanceof Array && str[0] instanceof Array) {
            return new Matrix(str);
        }
        if (typeof str == 'string' && str) {
            const arr = str.split('\n');
            if (arr.length >= 2) {
                return new Matrix(arr.map(
                    row => row.split(', ').map(
                        el => this.toValue(el)
                    )
                ));
            }
        }
        return null;
    }

	//=============================
    member(value, power) {
        return new Member(value, power)
    }
    polynomial(members) {
        return new Polynomial(members);
    }
	
	complex(re, im) {
		return new Complex(re, im);
	}

	vector(values){
		return new Vectror(values);
	}
	
	matrix(values) {
		return new Matrix(values);
	}

	add(a, b){
		return this.get(a).add(a, b);
	}

	sub(a, b) {
        return this.get(a).sub(a, b);
    }

	mult(a, b) {
        return this.get(a).mult(a, b);
    }

	prod(a, p) {
		if (typeof p == "number"){
			return this.get(a).prod(a, p);
		}
		return null
	}

	pow(a, n) {
        if (typeof n == "number"){
			return this.get(a).pow(a, n);
        }
        return null;
	}

	one (type, elem) {
		type = type?type: (elem)? elem.constructor.name: null;
        switch(type) {
            case "Complex" :
                return (new ComplexCalculator).one();
            case "Vector" :
                return (new VectorCalculator).one(elem.values.length, elem.values[0]);
            case "Matrix" :
                return (new MatrixCalculator).one(elem.values.length, elem.values[0][0]);
        }
        return super.one();
    }

	zero (type, elem) {
		type = type?type: (elem)? elem.constructor.name: null;
        switch(type) {
            case "Complex" :
                return (new ComplexCalculator).zero();
            case "Vector" :
                return (new VectorCalculator).zero(elem.values.length, elem.values[0]);
            case "Matrix" :
                return (new MatrixCalculator).zero(elem.values.length, elem.values[0][0]);
        }
        return super.zero();
    }
    
}

		

	