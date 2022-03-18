Template.prototype.graph3DTemplate = () => `
<div class="opo" id = 'opo2'>
    <canvas id="Canvas3D"></canvas>
    <div id = "lineset">
        <button class = "settings" id="points">Точки</button>
        <button class = "settings" id="edges">Ребра</button>
        <button class = "settings" id="polygons">Полигоны</button>
        <br>
        <button id = "moveLight">light</button>
        <button id = "animation">Анимация</button>
        <button id="cleanfigures">Отчистка</button>
        <br>
        <input type="range" name="brushsize" list="tickmarks" class="rangelumen" min="1000" max="70000" id="power" 
        step="1" value="25000">
    </div>
</div>
`;