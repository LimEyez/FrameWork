Template.prototype.ui3DTemplate = () => `
<div style="width: 600px">
    <div>
        <p style="text-align: center;" class = "texts">Нажмите на окно  для выбора цвета</p>
        <input type="color" id="color3D" value = "#e66465">
        <br>
        <br>
        <button class = 'butfig butfig-three' id="solarSystem" style = "width: 93.5%">Солнечная система</button>
    </div>
    <div>
        <button class = 'butfig butfig-three' id="sphere">Сфера</button>
        <button class = 'butfig butfig-three' id="cube">Куб</button>
        <button class = 'butfig butfig-three' id="torus">Тор</button>
        <button class = 'butfig butfig-three' id="cone">Конус</button>
        <button class = 'butfig butfig-three' id="ellipsoid">Элипсоид</button>
        <button class = 'butfig butfig-three' id="hyperboloid1">Гиперболоид (1.line)</button>
        <button class = 'butfig butfig-three' id="hyperboloid2">Гиперболоид (2.line)</button>
        <button class = 'butfig butfig-three' id="ellipticalCylinder">Цилиндр (ell)</button>
        <button class = 'butfig butfig-three' id="hyperbolicCylinder">Цилиндр (hyp)</button>
        <button class = 'butfig butfig-three' id="parabolicCylinder">Цилиндр (par)</button>
        <button class = 'butfig butfig-three' id="ellipticalParaboloid">Параболоид (ell)</button>
        <button class = 'butfig butfig-three' id="hyperbolicParaboloid">Параболоид (hyp)</button>
    </div>
</div>
`;