class CalculatorComponent extends Component {
    constructor(options) {
        super(options);
        this.complexCalculator = new ComplexCalculator();
        this.vectorCalculator = new VectorCalculator();
        this.matrixCalculator = new MatrixCalculator();
        this.calculator = new Calculator();
        this.polynomCalculator = new PolynomialCalculator();
    }

    _addEventListeners() {
        const buttons = document.querySelectorAll('.buttonscalc');
        buttons.forEach(button => {
            button.addEventListener('click', () => this.Calculate(button.dataset.operand));
        })
        document.getElementById('point').addEventListener('click', () => this.CalculatorPoint());
    }

    Calculate(method = "add") {
        const firstnum = document.getElementById("firstnumcalc").value;
        const secondnum = document.getElementById("secondnumcalc").value;
        const resault = document.getElementById("resaultcalc");

        let a = this.calculator.toValue(firstnum);
        let b = this.calculator.toValue(secondnum);
        

        if(a && b) {
            if( method == 'zero' || method == 'one') {
                resault.value = this.calculator[method](null, a).toString();
                return;
            }
            return resault.value = this.calculator[method](a, b).toString();
        }
            const c = this.calculator[method](
                this.calculator.toValue(firstnum),
                this.calculator.toValue(secondnum)
            );
            resault.value = (c.toString());

    }

    CalculatorPoint() {
        const textC = document.getElementById('resultNumber');
        const resultPoint = document.getElementById('resultPoint');

        if(resultPoint.value) {
            let point = this.calculator.toValue(resultPoint.value);
            let result = this.calculator.toValue(textC.value)
            console.log(result);
            return resultPoint.value = result.getValue(point);
        }
    }
}