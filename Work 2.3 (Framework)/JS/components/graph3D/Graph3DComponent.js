class Graph3DComponent extends Component {
    constructor(options) {

        setInterval( () => {
            if (this.animation)
                this.goAnimation();
                this.render();
        }, 17) 

        super(options)
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
        this.render();
        //========================================================
    }

    _addEventListeners() {
        document.addEventListener('keydown', event => this.keyDownHandler(event));
        document.getElementById('points').addEventListener('click', () => this.pointCheck());
        document.getElementById('edges').addEventListener('click', () => this.edgeCheck(this.edgeT));
        document.getElementById('polygons').addEventListener('click', () => this.polyCheck(this.polyT));
        document.getElementById('moveLight').addEventListener('click', () => this.checklight());
        document.getElementById('power').addEventListener('mousemove', () => this.correctionLumen());
        document.getElementById('cleanfigures').addEventListener('click', () => { this.figures = []; this.render() });
        document.getElementById('animation').addEventListener('click', () => this.checkAnimation());
    }

    

    correctionLumen() {
        this.LIGHT.lumen = this.power.value;
        this.render()
    }
 
    createFigure(name = '', color) {
        this.figures.push((new figure)[name](color));
        this.render();
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
        }
        else {
            this.animation = true;
            this.figures = [];
            this.figures.push((new figure)["Sphere"]('#e66465'));
            this.figures.forEach(figure => {
                figure.animations.forEach(animation => {
                    let center = animation.center;
                    this.moveScene(figure, -center.x, -center.y, center.z)
                })
            })
            this.render;
        }
    }

    pointCheck() {
        this.pointT = !this.pointT;
        this.render()
    }

    edgeCheck(edge) {
        edge == 0 ? this.edgeT = 1 : this.edgeT = 0;
        this.render()
    }

    polyCheck(poly) {
        poly == 0 ? this.polyT = 1 : this.polyT = 0;
        this.render()
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
        this.render();
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
            this.render();
        }
    }

    goAnimation() {

        this.figures.forEach(figure => {
            //console.log(figure);
            figure.animations.forEach (animation => {
                let center = (animation.center || figure.center);
                this.moveScene(figure, center.x, center.y, center.z); 
                const matrix  = this.graph3D[animation.method](animation.value);
    //----------------------------------------
                figure.points.forEach(point => {
                    point = this.graph3D.transformation(matrix, point);    //  X   (для reduce)
                    //console.log(animation, center)
    //----------------------------------------
                    // матрица1 * матрица2 * матрица3 - запоминаем и применяем один раз методом transformation
                });
                this.moveScene(figure, -center.x, -center.y, -center.z);
            });
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
        this.render();
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
                    console.log(point)
                    let x = this.graph3D.xs(point);
                    let y = this.graph3D.ys(point);
                    this.canvas3D.printpoint(x, y)
                }
                );
            }
        })
    };
}