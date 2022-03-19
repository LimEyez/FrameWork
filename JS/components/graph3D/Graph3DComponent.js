class Graph3DComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            CAMERA: new Point(0, 0, -50),
            DISPLAY: new Point(0, 0, -30)
        };
        this.canMove = false;
        this.graph3D = new Graph3D({
            WIN: this.WIN,
        });
        this.LIGHT = new Light(-40, 2, 0, 25000);
        //-------------------------------------//
        this.dx = 0;
        this.dy = 0;
        //===============
        this.figures = [];
        this.allPolygons = [];
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
            width: 800,
            height: 800,
            graph3D: this.graph3D,
        });

        this.ui = new UI3DComponent({
            id: "ui3D",
            parent: this.id,
            template: template.ui3DTemplate,
            callbacks: {
                CreateFigure: (name, color) => this.createFigure(name || '', color)
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
        this.figures.push((new figure)["Sphere"]('#e66465'))
        //========================================================

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
                this.goAnimation();
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
        document.getElementById('cleanfigures').addEventListener('click', () => this.figures = []);
        document.getElementById('animation').addEventListener('click', () => this.checkAnimation());
    }

    correctionLumen() {
        this.LIGHT.lumen = this.power.value;
    }

    createFigure(name = '', color) {
        this.figures.push((new figure)[name](color));
    }

    //===============================================
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
            this.animation = false;
        } else {
            this.animation = true;
            this.figures = [];
            this.figures.push((new figure)["Sphere"]([
                {
                    method: "rotateOx",
                    value: 0.02,
                    center: new Point(10, 0, 0)
                }, {
                    method: "rotateOx",
                    value: -0.01,
                    //center: new Point(-10, 5, 0)
                }
            ], '#e66465'));
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
    //===============================================


    wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? 0.9 : 1.1;
        const matrix = this.graph3D.zoom(delta);
        this.figures.forEach(figure => {
            figure.points.forEach(point =>
                this.graph3D.transformation(matrix, point)
            );
        })
    }

    mousedown(event) {
        this.canMove = true;
        this.dx = event.offsetX;
        this.dy = event.offsetY; // Фиксация координат точек клика на мышь
    }
    mouseup(event) {
        this.canMove = false;
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180 / 4;
            {
                const matrix = this.graph3D.rotateOy((this.dy - event.offsetY) * gradus);
                this.figures.forEach(figure => {
                    figure.points.forEach(point => {
                        this.graph3D.transformation(matrix, point)
                    })
                })
                if (this.moveLight) {
                    this.graph3D.transformation(matrix, this.LIGHT);
                }
            }
            const matrix = this.graph3D.rotateOx((this.dx - event.offsetX) * gradus);
            this.figures.forEach(figure => {
                figure.points.forEach(point => {
                    this.graph3D.transformation(matrix, point)
                })
            })
            if (this.moveLight) {
                this.graph3D.transformation(matrix, this.LIGHT);
            }
            this.dx = event.offsetX;
            this.dy = event.offsetY;
        }
    }

    goAnimation() {
        this.figures.forEach(figure => {
            const matrix = figure.animations.reduce(
                (S, animation) => {
                    const center = animation.center || figure.center;
                    const m1 = this.graph3D.move(center.x, center.y, center.z);
                    const m2 = this.graph3D[animation.method](animation.value);
                    const m3 = this.graph3D.move(-center.x, -center.y, -center.z);
                    return this.graph3D.mult(
                        S, 
                        this.graph3D.mult(this.graph3D.mult(m1, m2), m3)
                    );
                },
                this.graph3D.one()
            );
            figure.points.forEach(point => this.graph3D.transformation(matrix, point));
        });
    }

    moveScene(figure, dx, dy, dz) {
        const matrix = this.graph3D.move(dx, dy, dz);
        figure.points.forEach(point => {
            this.graph3D.transformation(matrix, point)
        });
        if (this.moveLight) {
            this.graph3D.transformation(matrix, this.LIGHT)
        }
    }

    keyDownHandler(event) {
        this.figures.forEach(figure => {
            switch (event.keyCode) {
                case 65: //a
                    return this.moveScene(figure, -1, 0, 0);
                case 68: //d
                    return this.moveScene(figure, 1, 0, 0);
                case 87: //w
                    return this.moveScene(figure, 0, 1, 0);
                case 83: //s
                    return this.moveScene(figure, 0, -1, 0);
            }
        })
    }


    render() {
        this.canvas3D.clear();
        if (this.polyT) {
            this.allPolygons = [];
            this.figures.forEach((figure, index) => {
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
                    return {
                        x: this.graph3D.xs(figure.points[point]),
                        y: this.graph3D.ys(figure.points[point])
                    };
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
                    const point1 = figure.points[edge.p1];
                    const point2 = figure.points[edge.p2];
                    this.canvas3D.line(
                        this.graph3D.xs(point1),
                        this.graph3D.ys(point1),
                        this.graph3D.xs(point2),
                        this.graph3D.ys(point2),
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
    };
}