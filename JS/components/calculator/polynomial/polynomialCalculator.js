class PolynomialCalculator {

	polynomial(members = []) {
		return new Polynomial(members);
	}

	add(a,b) {
		const calc = new Calculator;
		const members = [];
		a.poly.forEach(elemA => {
			const member = b.poly.find(elemB => elemB.power == elemA.power);
			if (member) {
				members.push(new Member(calc.add(elemA.value, member.value), elemA.power));
			} else {
				members.push(new Member(elemA.value, elemA.power));
			}
        });
		b.poly.forEach(elemB => {
			if (!members.find(el => el.power == elemB.power)) {
				members.push(new Member(elemB.value, elemB.power));
			}
		});

		for (let i = members.length - 1; i >= 0; i--) {
            if (members[i].value == 0) {
                members.splice(0, i);
            }
        }
		return new Polynomial(members);
    }

    mult (a, b) {
		const calc = new Calculator;
		let polynomial = new Polynomial;
		a.poly.forEach(elemA => {
			const members = [];
			b.poly.forEach (elemB => {

				members.push(new Member(calc.mult(elemA.value, elemB.value), calc.add(elemA.power, elemB.power)))
			});
			polynomial = this.add(polynomial, new Polynomial(members));
	    });
		return polynomial;
    }

	sub (a, b) {
		const calc = new Calculator;
		const members = [];
		a.poly.forEach(elemA => {
			const member = b.poly.find(elemB => elemB.power == elemA.power);
			if (member) {
				members.push(new Member(calc.sub(elemA.value, member.value), elemA.power))
			}
			else {
				members.push(new Member(elemA.value, elemA.power));
			}
		});
		b.poly.forEach(elemB => {
            if (!members.find(el => el.power == elemB.power)) {
                members.push(new Member(calc.prod(elemB.value, -1), elemB.power));
            }
        });
		return new Polynomial(members);
	}

	//===============================

	div(a, b) {
        return null;
    }
    
    prod(a, p) {
        const calc = new Calculator;
        const members = [];
        a.poly.forEach(elemA => {
            members.push(new Member(calc.prod(elemA.value, p), elemA.power));
        });
        for(let i = members.length - 1; i >= 0; i--) {
            if(members[i].value === 0) {
                return members.slice(0, i);
            }
        }
        return new Polynomial(members);
    }

    pow(a, n) {
        return null;
    }

	
    // div (a, b) {
	// 	const calc = new Calculator;
	// 	let polynomial = new Polynomial;
	// 	a.poly.forEach(elemA => {
	// 		const members = [];
	// 		b.poly.forEach (elemB => {

	// 			members.push(new Member(calc.div(elemA.value, elemB.value), calc.sub(elemA.power, elemB.power)))
	// 		});
	// 		polynomial = this.add(polynomial, new Polynomial(members));
	//     });
	// 	return polynomial;
    // }

	// pow (a, b) {
	// 	const calc = new Calculator;
	// 	console.log(a);
	// 	let poly = new Member(1, 0);
	// 	let polynomial = new Polynomial;
	// 	const members = [];
	// 	for (let i = 0; i <= b; i++) { 
	// 		poly.poly.forEach(elemB => {
	// 			a.poly.forEach (elemA => {
	// 				members.push(new Member(calc.mult(elemB.value, elemA.value), calc.add(elemB.power, elemA.power)));
	// 				console.log(members);
	// 				poly = new Member (members);
	// 			});
	// 		});
	// 	}
	// 	return poly;
	// }
}
    