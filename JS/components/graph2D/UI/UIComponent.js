function sin(x) { return Math.sin(x); };
function cos(x) { return Math.cos(x); };
function tan(x) { return Math.tan(x); };
function sqrt(x) { return Math.sqrt(x); };
function abs(x) { return Math.abs(x); };
function pow(x) { return Math.pow(x); };

class UIComponent extends Component {
    constructor(options) {
        super(options);
        this.num = 0;
        this.cmd = false;
        
    }

    _addEventListeners() {
        document.getElementById('showHide').addEventListener('click', this.showHide);
        document.getElementById('addFunction').addEventListener('click', () => {
            this.addFunction()
        });
    };

    showHide() {
        document.querySelector('.overlay').classList.toggle('hide');
    };

    addFunction() {
        
        const inputX = document.createElement('input');
        inputX.setAttribute('placeholder', `Значение f(X)`);
        inputX.setAttribute('class', 'secondelem3');
        inputX.addEventListener('keyup', () => this.keyup(input, false, inputfirst, inputdouble, id, inputX));
        //Добавить ввод для функции
        this.cmd = false;
        let input = document.createElement('input');
        input.setAttribute('placeholder', `function №${this.num}`);
        input.setAttribute('class', 'secondelem');
        input.dataset.num = this.num;
        input.addEventListener('keyup', () => {
            this.keyup(input, false, inputfirst, inputdouble, id, inputX);
        });

        //Добавить кнопку для удаления
        let button = document.createElement('button');
        button.innerHTML = 'Удалить';
        button.setAttribute('class', 'secondelem2');
        button.addEventListener('click', () => {
            this.callbacks.delFunction(input.dataset.num);
            this.callbacks.delFunction(inputfirst.dataset.pointone);
            this.callbacks.delFunction(inputdouble.dataset.pointtwo);
            funcInputs.removeChild(input);
            funcInputs.removeChild(button);
            funcInputs.removeChild(check);
            funcInputs.removeChild(resaultS);
            funcInputs.removeChild(inputfirst);
            funcInputs.removeChild(inputdouble);
            funcInputs.removeChild(inputX);
            funcInputs.removeChild(buttonintegral);
        });

        //Добавить кнопку вкл/выкл касательной к графику
        let check = document.createElement('button');
        check.innerHTML = ' ';
        check.setAttribute('class', 'Checkin')
        check.addEventListener('click', () => {
            if (this.cmd == false) {
                this.cmd = true;
                check.style.backgroundColor = 'rgb(0, 255, 85)';
            }
            else {
                this.cmd = false;
                check.style.backgroundColor = 'red';
            }
            this.keyup(input, false, inputfirst, inputdouble, id, inputX);
        });


        //Добавить кнопку вкл/выкл касательной к графику
        let inputfirst = document.createElement('input');
        inputfirst.setAttribute('class', 'inputintegral1');
        inputfirst.setAttribute('placeholder', `1-я точка`);
        //inputfirst.dataset.pointone = document.getElementsByClassName("inputintegral1")[this.num];
        inputfirst.addEventListener('keyup', () => {
            this.keyup(input, false, inputfirst, inputdouble, id, inputX)
        });

        let inputdouble = document.createElement('input');
        inputdouble.setAttribute('class', 'inputintegral2');
        inputdouble.setAttribute('placeholder', `2-я точка `);
        //inputdouble.dataset.pointtwo = document.getElementsByClassName("inputintegral2")[this.num];
        inputdouble.addEventListener('keyup', () => {
            this.keyup(input, false, inputfirst, inputdouble, id,  inputX)
        });

        let buttonintegral = document.createElement('button');
        buttonintegral.setAttribute('class', 'buttonintegral');
        buttonintegral.innerHTML = 'Найти S';
        buttonintegral.addEventListener('click', () => {
            this.keyup(input, true, inputfirst, inputdouble, id,  inputX)
        });

        let resaultS = document.createElement('input');
        resaultS.setAttribute('readonly', 'readonly');
        resaultS.setAttribute('id', `resaultS${this.num}`);
        let id = resaultS.id;
        resaultS.setAttribute('class', 'resaultS');

        //Добавить элементы на страницу
        const funcInputs = document.getElementById('funcs');
        funcInputs.appendChild(button);
        funcInputs.appendChild(input);
        funcInputs.appendChild(check);
        funcInputs.appendChild(inputfirst);
        funcInputs.appendChild(inputdouble);
        funcInputs.appendChild(inputX);
        funcInputs.appendChild(buttonintegral);
        funcInputs.appendChild(resaultS);
        this.num += 1;
    };



    keyup(elem, S, one, two, id, inputX) {
        try {
            let f;
            eval(`f = function (x) { return ${elem.value}; }`)
            console.log(id, inputX.value-0)
            this.callbacks.addFunction(f, elem.dataset.num, this.cmd, S, one.value - 0, two.value - 0, id, inputX.value-0);
        } catch (e) {
            console.log('ошибка ввода функции', e);
        }
    }
}