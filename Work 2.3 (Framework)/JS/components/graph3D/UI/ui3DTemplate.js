Template.prototype.ui3DTemplate = () => `
    <div>
        <p style="text-align: center;" class = "texts">Нажмите на окно  для выбора цвета</p>
        <input type="color" id="color3D" value = "#e66465">
        <br>
        <button id="showHide3D">Фигуры</button>
    </div>
    <div class='overlay3D hide'>
        <button class = 'butfig' id="sphere">Сфера</button>
        <button class = 'butfig' id="cube">Куб</button>
        <button class = 'butfig' id="torus">Тор</button>
        <button class = 'butfig' id="cone">Конус</button>
        <button class = 'butfig' id="ellipsoid">Элипсоид</button>
        <button class = 'butfig' id="hyperboloid1">Гиперболоид (1.line)</button>
        <button class = 'butfig' id="hyperboloid2">Гиперболоид (2.line)</button>
        <button class = 'butfig' id="ellipticalCylinder">Цилиндр (ell)</button>
        <button class = 'butfig' id="hyperbolicCylinder">Цилиндр (hyp)</button>
        <button class = 'butfig' id="parabolicCylinder">Цилиндр (par)</button>
        <button class = 'butfig' id="ellipticalParaboloid">Параболоид (ell)</button>
        <button class = 'butfig' id="hyperbolicParaboloid">Параболоид (hyp)</button>
    </div>
`;