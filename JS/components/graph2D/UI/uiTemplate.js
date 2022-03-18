Template.prototype.uiTemplate = () =>`
        <p style="text-align: center;" class = "texts">Нажмите на окно  для выбора цвета</p>
        <input type="color" id="Color" value = "#e66465">
        <p class="texts">Введите тощину</p>
        <input type="range" name="brushsize" list="tickmarks" class="ranges" min="0" max="12" id="brushSlider" 
        step="1" value="2">
            <p class="texts">Ведите начальную точку отрезка</p>
            <input id="input0">
            <p class="texts">Введите конечную точку отрезка</p>
            <input id="input1"> 
        <br>
        <p class="texts">С какой точностью определить?</p>
        <input id="inputexp">
        <br>
        <br>
        <button id="resaultf">"0-ли" функций</button> 
        <button id="resaultf2">Пересечения графиков</button>
        <br>
        <br>
        <button id="showHide">Скрыть/Показать</button>
    </div>
    <div class='overlay hide'>
        <button id="addFunction">Добавить функцию</button>
        <div class = "input" id="funcs"></div>
    </div>
`;