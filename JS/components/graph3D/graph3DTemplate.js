Template.prototype.graph3DTemplate = () => `
<div class="opo" id = 'opo2'>
    <canvas id="Canvas3D"></canvas>
    <div id = "lineset">
        <button class = "settings settings-three" id = "points">POINTS</button>
        <button class = "settings settings-three" id = "edges">EDGES</button>
        <button class = "settings settings-three" id = "polygons">POLYGONS</button>
        <button class = "settings settings-three" id = "lightCent">MID LIGHT </button>
        <button class = "settings settings-three" id = "moveLight">LIGHT</button>
        <button class = "settings settings-three" id = "animation">ANIMATIONS</button>
        <button class = "settings settings-three" id = "cleanfigures">CLEAN</button>
        <button class = "settings settings-three" id = "lightSec">SIDE LIGHT</button>
        
        <br>
        <input type="range" name="brushsize" list="tickmarks" class="rangelumen" min="1000" max="1000000" id="power" 
        step="1" value="500000">
    </div>
</div>
`;