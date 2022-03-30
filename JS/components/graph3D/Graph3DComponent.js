class Graph3DComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            P1: new Point(-10, 10, -30), //левый верхний угол
            P2: new Point(-10, -10, -30), //левый нимжний угол
            P3: new Point(10, -10, -30), //правый нимжний угол
            CAMERA: new Point(0, 0, -70),
            DISPLAY: new Point(0, 0, -50)
        };
        this.canMove = false;
        this.graph3D = new Graph3D({
            WIN: this.WIN,
        });
        this.LIGHT = new Light(0, 0, 0, 500000);
        this.planets = new Planets;
        //-------------------------------------//
        this.dx = 0;
        this.dy = 0;
        //===============
        this.figures = [];
        this.allPolygons = [];
        this.gradusCam = 1;
        //===============
        this.moveLight = false;
        this.switchLight = document.getElementById('moveLight');
        this.power = document.getElementById('power');
        this.animation = false;
        //===============
        this.pointT = 0;
        this.edgeT = 0;
        this.polyT = 1;
        //===============
        this.canvas3D = new Canvas({
            callbacks: {
                wheel: event => this.wheel(event),
                mouseup: event => this.mouseup(event),
                mousedown: event => this.mousedown(event),
                mousemove: event => this.mousemove(event),
            },
            WIN: this.WIN,
            id: 'Canvas3D',
            width: 600,
            height: 600,
            graph3D: this.graph3D,
        });

        this.ui = new UI3DComponent({
            id: "ui3D",
            parent: this.id,
            template: template.ui3DTemplate,
            callbacks: {
                CreateFigure: (name, color) => this.createFigure(name || '', color),
                createSolarSystem: () => this.figures = this.planets.solarSystem
            }
        });
        //======================    СОЗДАНИЕ ФИГУР  ==============
        //this.figure = (new figure).Wheel(25, 10);
        //this.figure = (new figure).Cube('#e66465');
        //this.figure = (new figure).Sphere(10, 20);
        //this.figure = (new figure).Tor(10, 5, 21);
        //this.figure = (new figure).Ellipsoid();
        //this.figure = (new figure).Hyperboloid1();
        //this.figure = (new figure).Hyperboloid2();
        //this.figure = (new figure).Cone();
        //this.figure = (new figure).EllipticalParaboloid();
        //this.figure = (new figure).EllipticalCylinder();
        //this.figure = (new figure).ParabolicCylinder();
        // this.figure = (new figure).HyperbolicParaboloid();
        // this.figure = (new figure).HyperbolicCylinder();
        //this.figures = [(new figure).Cube('#e66465')]
        //========================================================


        //===================================
        this.figures = this.planets.solarSystem;
        this.animations = this.planets.animationSolarSystem;
        //===================================
        let FPS = 0;
        this.FPS = 0;
        let lastTimestamp = Date.now();

        const animLoop = () => {
            this.calcPlaneEqution(); // получить и записать плоскость экрана
            this.calcWindowVectors(); // вычислить вектора экрана
            // calc fps 
            
            FPS++;
            const timestamp = Date.now();
            if (timestamp - lastTimestamp >= 1000) {
                this.FPS = FPS;
                FPS = 0;
                lastTimestamp = timestamp;
            }
            // print scene
            if (this.animation) {
                this.goAnimation(this.animations);
            }
            this.render();
            requestAnimFrame(animLoop);
        }
        animLoop();
    }

    _addEventListeners() {
        document.addEventListener('keydown', event => this.keyDownHandler(event));
        document.getElementById('points').addEventListener('click', () => this.pointCheck());
        document.getElementById('edges').addEventListener('click', () => this.edgeCheck(this.edgeT));
        document.getElementById('polygons').addEventListener('click', () => this.polyCheck(this.polyT));
        document.getElementById('moveLight').addEventListener('click', () => this.checklight());
        document.getElementById('power').addEventListener('mousemove', () => this.correctionLumen());
        document.getElementById('cleanfigures').addEventListener('click', () => { this.figures = []; this.animation = []; if (this.animation) { this.animation = !this.animation } });
        document.getElementById('animation').addEventListener('click', () => this.checkAnimation());
        document.getElementById('lightSec').addEventListener('click', () => this.LIGHT = new Light(-40, 2, 0, 25000))
        document.getElementById('lightCent').addEventListener('click', () => this.LIGHT = new Light(0, 0, 0, 30000))
    }

    //===================================== Функции изменения сцены =========================================================

    moveScene(figure, dx, dy, dz) {
        const matrix = this.graph3D.move(dx, dy, dz);
        figure.points.forEach(point => {
            this.graph3D.transformation(matrix, point)
        });
        if (this.moveLight) {
            this.graph3D.transformation(matrix, this.LIGHT)
        }
    }

    getProection(point) {
        const M = this.graph3D.getProection(point) ;
        const P2M = this.graph3D.calcVector(this.WIN.P2, M);
        const cosa = this.graph3D.calcCorner(this.P2P3, M);
        const cosb = this.graph3D.calcCorner(this.P1P2, M);
        const module = this.graph3D.calcVectorModule(P2M)
        return {
            x: cosa * module,
            y: cosb * module
        };  
    }

    transformator(matrix) {
        this.graph3D.transformation(matrix, this.WIN.CAMERA);
        this.graph3D.transformation(matrix, this.WIN.DISPLAY);
        this.graph3D.transformation(matrix, this.WIN.P1);
        this.graph3D.transformation(matrix, this.WIN.P2);
        this.graph3D.transformation(matrix, this.WIN.P3)
    }
    

    goAnimation(animations, parentMatrix) {
        // console.log(animations)
        animations.forEach(anim => {
            const matrix = this.figureAnimate(anim.root, parentMatrix)
            if (anim.nodes) {
                this.goAnimation(anim.nodes, matrix);
            }
            // console.log(anim)
        })
    }

    figureAnimate(figure, parentMatrix = this.graph3D.one()) {
        const matrix = figure.animations.reduce(
            (S, animation) => {
                const { method, value } = animation;
                // console.log(animation.check)
                var resMatrix = this.graph3D.one();
                const center = animation.center || figure.center;
                const { x, y, z } = center;
                if (animation.check) {
                    resMatrix = this.graph3D.animateMatrix(-x, -y, -z, method, value);
                    // console.log(1)
                }
                else {
                    let temporaryMatrix = this.graph3D.animateMatrix(-x, -y, -z, method, value);
                    figure.points.forEach(point =>
                        this.graph3D.transformation(temporaryMatrix, point)
                    );
                    // console.log(2)
                }
                if (animation.center) {
                    this.graph3D.transformation(resMatrix, figure.center);
                    // console.log(3)
                }
                return this.graph3D.multMatrixes(S, resMatrix);
            },
            parentMatrix
        );
        figure.points.forEach(point =>
            this.graph3D.transformation(matrix, point)
        );

        return matrix
    }


//================================================== Вывод фигур =====================================================

    render() {
        this.canvas3D.clear();
        if (this.polyT) {
            this.allPolygons = [];
            this.figures.forEach((figure, index) => {
                this
                this.graph3D.calcDistance(figure, this.WIN.CAMERA, 'distance');
                this.graph3D.calcDistance(figure, this.LIGHT, 'lumen');
                figure.polygons.forEach(polygon => {
                    polygon.figureIndex = index;
                    this.allPolygons.push(polygon);
                });
            });
            this.graph3D.sortByArtistAlgoritm(this.allPolygons);
            this.allPolygons.forEach(polygon => {
                const figure = this.figures[polygon.figureIndex];
                polygon.normal = this.graph3D.multVector(polygon.points, figure);
                const points = polygon.points.map(point => {
                    return this.getProection(figure.points[point]);
                    // {
                    // x: this.graph3D.xs(figure.points[point]),
                    // y: this.graph3D.ys(figure.points[point]) 
                    // }
                });
                const lumen = this.graph3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                let { r, g, b } = polygon.color
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);

                //Отсечение невидимых полигонов
                if (this.graph3D.sortByVector(polygon.normal, this.WIN.CAMERA, polygon.check)) {
                    this.canvas3D.polygon(points, polygon.rgbToHex(r, g, b));
                }

                //Точки по координатам нормальных векторов

                // let x = this.graph3D.xs(polygon.normal);
                // let y = this.graph3D.ys(polygon.normal);
                // this.canvas3D.printpoint(x, y)
            })
        }

        this.figures.forEach(figure => {
            if (this.edgeT) {
                figure.edges.forEach(edge => {
                    const point1 = this.getProection(figure.points[edge.p1]);
                    const point2 = this.getProection(figure.points[edge.p2]);
                    this.canvas3D.line(
                        point1.x,
                        point1.y,
                        point2.x,
                        point2.y
                    )
                });
            }
            if (this.pointT) {
                figure.points.forEach(point => {
                    let x = this.graph3D.xs(point);
                    let y = this.graph3D.ys(point);
                    this.canvas3D.printpoint(x, y)
                });
            }
        });
        this.canvas3D.text(`FPS = ${this.FPS}`, -9, 9, 18);
    }


//====================================== ЧЕК-БОКСЫ =============================================
    checklight() {
        if (this.moveLight) {
            this.switchLight.style.backgroundColor = '#5ef7d4';
            this.switchLight.style.color = "black";
        } else {
            this.switchLight.style.backgroundColor = '#e84157';
            this.switchLight.style.color = 'white'
        }
        this.moveLight = !this.moveLight;
    }

    checkAnimation() {
        if (this.animation) {
            this.animation = !this.animation;
        } else {
            this.animation = !this.animation;
        }
    }

    pointCheck() {
        this.pointT = !this.pointT;
    }

    edgeCheck(edge) {
        edge == 0 ? this.edgeT = 1 : this.edgeT = 0;
    }

    polyCheck(poly) {
        poly == 0 ? this.polyT = 1 : this.polyT = 0;
    }
    
//===================================================== Действия пользователя =============================================

    mouseup(event) {
        this.canMove = false;
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    mousedown(event) {
        this.canMove = true;
        this.dx = event.offsetX;
        this.dy = event.offsetY; // Фиксация координат точек клика на мышь
    }

    wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? 10 : -10;
        // this.calcPlaneEqution();
        // const matrix = this.graph3D.zoom(delta);
        // this.graph3D.transformation(matrix, this.WIN.DISPLAY);
        // this.graph3D.transformation(matrix, this.WIN.CAMERA);
        // console.log(this.WIN.DISPLAY)
        this.WIN.CAMERA.z += delta;
        this.WIN.DISPLAY.z += delta;

    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180 / 4;
            
            {
                const matrix = this.graph3D.rotateOy((this.dy - event.offsetY) * gradus);
                this.calcPlaneEqution();
                this.transformator(matrix);
            } {
                const matrix = this.graph3D.rotateOx((this.dx - event.offsetX) * gradus);
                this.calcPlaneEqution();
                this.transformator(matrix);
            }
            this.dx = event.offsetX;
            this.dy = event.offsetY;
        }
        // console.log(this.WIN.CAMERA)
    }

    keyDownHandler(event) {
        let matrix;
            switch (event.keyCode) {
                case 87: //w
                    matrix = this.graph3D.move(0, 1, 0); 
                    this.transformator(matrix);
                break;
                case 65: //a
                    matrix = this.graph3D.move(-1, 0, 0);
                    this.transformator(matrix);  
                break;
                case 83: //s
                    matrix = this.graph3D.move(0, -1, 0); 
                    this.transformator(matrix); 
                break;
                case 68: //d
                    matrix = this.graph3D.move(1, 0, 0); 
                    this.transformator(matrix); 
                break;
            }
            
            //console.log(this.WIN.CAMERA)
    }

    
//===================================================== ВЫЧИСЛЕНИЯ =============================================

    calcWindowVectors(){
        this.P1P2 = this.graph3D.calcVector(this.WIN.P2, this.WIN.P1);
        this.P2P3 = this.graph3D.calcVector(this.WIN.P2, this.WIN.P3)
    }

    calcPlaneEqution() {
        this.graph3D.calcPlane(this.WIN.CAMERA, this.WIN.DISPLAY);
    }

    correctionLumen() {
        this.LIGHT.lumen = this.power.value;
    }

    createFigure(name = '', color) {
        this.figures.push((new figure)[name](color));
    }

}