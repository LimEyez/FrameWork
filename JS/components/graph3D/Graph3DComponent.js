class Graph3DComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            P1: new Point(-10, 10, -1100), //левый верхний угол
            P2: new Point(-10, -10, -1100), //левый нимжний угол
            P3: new Point(10, -10, -1100), //правый нимжний угол
            CAMERA: new Point(0, 0, -1130),
            DISPLAY: new Point(0, 0, -1100)
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
        this.canvas = new Canvas({
            callbacks: {
                wheel: event => this.wheel(event),
                mouseup: event => this.mouseup(event),
                mousedown: event => this.mousedown(event),
                mousemove: event => this.mousemove(event),
            },
            WIN: this.WIN,
            id: 'Canvas3D',
            width: 600,
            height: 600
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
            // print scene
            this.calcPlaneEqution(); // получить и записать плоскость экрана
            this.calcWindowVectors(); // вычислить вектора экрана
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
        const M = this.graph3D.getProection(point);
        const P2M = this.graph3D.calcVector(this.WIN.P2, M);
        const cosa = this.graph3D.calcCorner(this.P2P3, M);
        const cosb = this.graph3D.calcCorner(this.P1P2, M);
        const module = this.graph3D.calcVectorModule(P2M);
        // console.log(cosa)
        return {
            x: cosa * module,
            y: cosb * module
        };
    }

    transformator(matrix) {
        // console.log(matrix);
        this.graph3D.transformation(matrix, this.WIN.CAMERA);
        this.graph3D.transformation(matrix, this.WIN.DISPLAY);
        this.graph3D.transformation(matrix, this.WIN.P1);
        this.graph3D.transformation(matrix, this.WIN.P2);
        this.graph3D.transformation(matrix, this.WIN.P3)
    }

    figureAnimate(figure, parentMatrix = this.graph3D.one()) {
        const matrix = figure.animations.reduce(
            (S, animation) => {
                const { method, value } = animation;
                const center = animation.center || figure.center;
                const { x, y, z } = center;
                let resMatrix = this.graph3D.one();
                // if (!animation.check) {
                resMatrix = this.graph3D.animateMatrix(-x, -y, -z, method, value);
                // }
                return this.graph3D.multMatrixes(S, resMatrix);
            },
            parentMatrix
        );
        figure.points.forEach(point =>
            this.graph3D.transformation(matrix, point)
        );
        this.graph3D.transformation(matrix, figure.center);
        return figure.animations.reduce(
            (S, animation) => {
                const { method, value } = animation;
                const center = animation.center || figure.center;
                const { x, y, z } = center;
                let resMatrix = this.graph3D.one();
                if (animation.check) {
                    return S;
                }
                resMatrix = this.graph3D.animateMatrix(-x, -y, -z, method, value);
                return this.graph3D.multMatrixes(S, resMatrix);
            },
            parentMatrix
        );;

    }

    goAnimation(animations, parentMatrix) {
        if (this.animation) {
            animations.forEach(anim => {
                const matrix = this.figureAnimate(anim.root, parentMatrix)
                if (anim.nodes) {
                    this.goAnimation(anim.nodes, matrix);
                }
            });
        }
    }
    
    fixPolusSphere(figure, polygon){
        for (let i = 0; i < 3; i++){
            for (let j = i+1; j < 4; j++) {
                if (
                    figure.points[polygon.points[i]].x == figure.points[polygon.points[j]].x &&
                    figure.points[polygon.points[i]].y == figure.points[polygon.points[j]].y &&
                    figure.points[polygon.points[i]].z == figure.points[polygon.points[j]].z 
                ) {
                    polygon.check = true;
                    break
                }
            }
            if (polygon.check == true) {
                break
            }
        }
    }


    //================================================== Вывод фигур =====================================================

    render() {
        this.canvas.clear();
        if (this.polyT) {
            this.allPolygons = [];
            this.figures.forEach((figure, index) => {
                this.graph3D.calcDistance(figure, this.WIN.CAMERA, 'distance');
                this.graph3D.calcDistance(figure, this.LIGHT, 'lumen');
                figure.polygons.forEach(polygon => {
                    polygon.figureIndex = index;
                    // console.log(polygon)
                    this.allPolygons.push(polygon);
                });
            });
            this.graph3D.sortByArtistAlgoritm(this.allPolygons);
            this.allPolygons.forEach(polygon => {
                const figure = this.figures[polygon.figureIndex];
                polygon.normal = this.graph3D.multVector(polygon.points, figure);
                const points = polygon.points.map(point => {
                    // console.log(point);
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
                this.fixPolusSphere(figure, polygon);


                if (this.graph3D.sortByVector(polygon.normal, this.WIN.CAMERA, polygon.check)) {
                    this.canvas.polygon3D(points, polygon.rgbToHex(r, g, b));
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
                    this.canvas.line(
                        point1.x,
                        point1.y,
                        point2.x,
                        point2.y
                    )
                });
            }
            if (this.pointT) {
                figure.points.forEach(point => {
                    let a = this.getProection(point);
                    this.canvas.printpoint(a.x, a.y)
                });
            }
        });

        this.canvas.text(`FPS = ${this.FPS}`, -9, 9, 18);
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
        const delta = (event.wheelDelta > 0) ? -0.02 : 0.02;
        // console.log(this.WIN.CAMERA);
        this.transformator(this.graph3D.move(
            this.WIN.CAMERA.x * delta,
            this.WIN.CAMERA.y * delta,
            this.WIN.CAMERA.z * delta)
        )
        // console.log(this.CAMERA)
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
        switch (event.keyCode) {
            case 65: // key a
                return this.transformator(this.graph3D.rotateOx(Math.PI / 180));
            case 68: // key d
                return this.transformator(this.graph3D.rotateOx(-Math.PI / 180));
            case 83: // key s
                return this.transformator(this.graph3D.rotateOy(Math.PI / 180));
            case 87: // key w
                return this.transformator(this.graph3D.rotateOy(-Math.PI / 180));
            case 81: // key q
                return this.transformator(this.graph3D.rotateOz(Math.PI / 180));
            case 69: // key e
                return this.transformator(this.graph3D.rotateOz(-Math.PI / 180));
        }
    }


    //===================================================== ВЫЧИСЛЕНИЯ =============================================

    calcWindowVectors() {
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