Template.prototype.calculatorTemplate = () => `
<div class = "calcdivinputs">
    <h1>Калькулятор</h1>
    <textarea class = "inputnumbers" placeholder = "First num" id = "firstnumcalc"></textarea>

    <textarea class = "inputnumbers" placeholder = "Second num" id = "secondnumcalc"></textarea>
    <p class = "texts">Результат:</p>
    <textarea class = "inputnumbers"placeholder = "Resault" id = "resaultcalc" readonly = "readonly"></textarea>
    <br>
    <br>
    <button data-operand="add" class="buttonscalc">+</button>
    <button data-operand = "mult" class = "buttonscalc">x</button>
    <button data-operand = "div" class = "buttonscalc">/</button>
    <button data-operand = "sub" class = "buttonscalc">-</button>
    <button data-operand = "pow" class = "buttonscalc">^</button>
    <button data-operand = "prod" class = "buttonscalc">λ</button>
    <button data-operand = "one" class = "buttonscalc">1</button>
    <button data-operand = "zero" class = "buttonscalc">0</button>
    <br>
            <div class="results">
            <textarea  class="resultNumber" id="resultNumber"></textarea>
            <button id="point"> point </button>
            <textarea  class="resultNumber" id="resultPoint"></textarea>
        </div>
    
</div> 
    `;