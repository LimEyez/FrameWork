class UI3DComponent extends Component {
    constructor(options) {
        super(options);
        this.color = document.getElementById('color3D');
    }

    _addEventListeners() {
        document.getElementById('showHide3D').addEventListener('click', this.showHide);
        
        document.getElementById('sphere').addEventListener('click', () => {
            this.callbacks.CreateFigure("Sphere", this.color.value);
        });
        document.getElementById('cube').addEventListener('click', () => {
            this.callbacks.CreateFigure("Cube", this.color.value);
        });
        document.getElementById('torus').addEventListener('click', () => {
            this.callbacks.CreateFigure('Tor', this.color.value);
        });
        document.getElementById('cone').addEventListener('click', () => {
            this.callbacks.CreateFigure("Cone", this.color.value);
        });
        document.getElementById('ellipsoid').addEventListener('click', () => {
            this.callbacks.CreateFigure("Ellipsoid", this.color.value);
        });
        document.getElementById('hyperboloid1').addEventListener('click', () => {
            this.callbacks.CreateFigure("Hyperboloid1", this.color.value);
        });
        document.getElementById('hyperboloid2').addEventListener('click', () => {
            this.callbacks.CreateFigure("Hyperboloid2", this.color.value);
        });
        document.getElementById('ellipticalCylinder').addEventListener('click', () => {
            this.callbacks.CreateFigure("EllipticalCylinder",this.color.value);
        });
        document.getElementById('hyperbolicCylinder').addEventListener('click', () => {
            this.callbacks.CreateFigure("HyperbolicCylinder", this.color.value);
        });
        document.getElementById('parabolicCylinder').addEventListener('click', () => {
            this.callbacks.CreateFigure("ParabolicCylinder", this.color.value);
        });
        document.getElementById('ellipticalParaboloid').addEventListener('click', () => {
            this.callbacks.CreateFigure("EllipticalParaboloid", this.color.value);
        });
        document.getElementById('hyperbolicParaboloid').addEventListener('click', () => {
            this.callbacks.CreateFigure("HyperbolicParaboloid", this.color.value);
        });
    };

    showHide() {
        document.querySelector('.overlay3D').classList.toggle('hide');
    };

}
