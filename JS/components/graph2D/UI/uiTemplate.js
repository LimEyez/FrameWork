Template.prototype.uiTemplate = () =>`
        <p style="text-align: center;" class = "texts" style="font-size: 14px;">Нажмите на окно  для выбора цвета</p>
        <input type="color" id="Color" value = "#e66465">
        <p class="texts" style="font-size: 14px;">Введите тощину</p>
        <input type="range" name="brushsize" list="tickmarks" class="ranges" min="0" max="14" id="brushSlider" 
        step="1" value="2">
            <p class="texts" style="font-size: 14px;">Ведите начальную точку отрезка</p>
            <input id="input0"  class = "butfig butfig-three">
            <p class="texts" style="font-size: 14px;">Введите конечную точку отрезка</p>
            <input id="input1" class = "butfig butfig-three"> 
        <br>
        <p class="texts" style="font-size: 14px;">С какой точностью определить?</p>
        <input id="inputexp" class = "butfig butfig-three">
        <br>
        <br>
        <button id="resaultf" class = "butfig butfig-three">"0-ли" функций</button> 
        <button id="resaultf2" class = "butfig butfig-three">Пересечения графиков</button>
        <br>
        <br>
        <button id="showHide" class = "butfig butfig-three">Скрыть/Показать</button>
    </div>
    <div class='overlay hide'>
        <button id="addFunction" class = "butfig butfig-three">Добавить функцию</button>
        <div class = "input" id="funcs"></div>
    </div>
`;