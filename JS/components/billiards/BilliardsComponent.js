class BilliardsComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            P1: new Point(-10, 10, 50), //левый верхний угол
            P2: new Point(-10, -10, 50), //левый нимжний угол
            P3: new Point(10, -10, 50), //правый нимжний угол
            CAMERA: new Point(0, 0, 80),
            DISPLAY: new Point(0, 0, 50)
        };
        this.canvas = new Canvas({
            callbacks: {
                wheel: event => this.wheel(event),
                mouseup: event => this.mouseup(event),
                mousedown: event => this.mousedown(event),
                mousemove: event => this.mousemove(event),
            },
            WIN: this.WIN,
            id: 'canvasGame',
            width: 750,
            height: 750
        });
        this.LIGHT = new Light(0, 0, 50, 100000);

        this.graph3D = new Graph3D({
            WIN: this.WIN,
        });

        // this.Billiards = new Billiards({
        //     graph3D: this.graph3D,
        //     })

        let FPS = 0;
        this.FPS = 0;
        this.dx = 0;
        this.dy = 0;
        let lastTimestamp = Date.now();

        this.startPosition()

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
            this.calcPlaneEqution(); // получить и записать плоскость экрана
            this.calcWindowVectors(); // вычислить вектора экрана
            this.render();
            requestAnimFrame(animLoop);
        }
        animLoop();
    }

    BounceWall(radians, incRadians) {
        const result = (2 * incRadians) - radians;
        return result;
    }


    //===========================================

    ballMove(figure, powerX = 1, powerY = 0.2) {
        let modulX = Math.abs(powerX);
        let modulY = Math.abs(powerY);
        if (modulX > 0.01 || modulY > 0.01) {
            //============= POWER Y ================
            // if (modulY > 0.01) {
                let gain = modulY / 50;
                if (figure.center.y > 1800) {
                    powerY = -powerY;
                }
                else if (figure.center.y < -1800) {
                    powerY = -powerY;
                }
                if (powerY / modulY == 1) {
                    powerY -= gain;
                }
                else {
                    powerY += gain;
                }
             // }
            //=========== POWER X ==================
            // if (modulX > 0.01) 
            {
                let gain = modulX / 50;
                if (figure.center.x > 600) {
                    powerX = -powerX;
                }
                else if (figure.center.x < -600) {
                    powerX = -powerX;
                }
                if (powerX / modulX == 1) {
                    powerX -= gain;
                }
                else {
                    powerX += gain;
                }
            }
        // }
        //======================================
        //if (modulX > 0.01 && modulY > 0.01) {
            this.moveSceneBall(figure, powerX, powerY, 0);
            setTimeout(
                () => {
                    this.ballMove(figure, powerX, powerY)
                },
                5
            );
        }
    }

    moveSceneBall(figure, dx = 0, dy = 0, dz = 0) {
        const matrix = this.graph3D.move(dx, dy, dz);
        figure.points.forEach(point => {
            this.graph3D.transformation(matrix, point);
            this.graph3D.transformation(matrix, figure.center);
            // console.log(figure.center)
        });
    }

    //==============================================

    startPosition() {
        this.figures = [
            (new figure).solarSystem(20, 0.25, new Point(0, 0.25, 0), "#1E90FF"),
            /*----------------------------------------------------------------------------------*/

            //  (new figure).solarSystem(20, 0.25, new Point(0, 0.25, 6), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(-0.5, 0.25, 6), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(0.5, 0.25, 6), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(-0.25, 0.25, 5.5), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(0.25, 0.25, 5.5), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(0, 0.25, 5), "#1E90FF"),
            //  (new figure).Place("#006400", 5, 10, 0, [], new Point(0, 0, 0)),

            /*----------------------------------------------------------------------------------*/
            (new figure).Place("#8B4513", 5, 0.5, 0.25, [], new Point(0, 9.5, 0.25)),
            (new figure).Place("#8B4513", 5, 0.5, 0.25, [], new Point(0, -9.5, 0.25)),
            (new figure).Place("#8B4513", 0.5, 10, 0.25, [], new Point(4.5, 0, 0.25)),
            (new figure).Place("#8B4513", 0.5, 10, 0.25, [], new Point(-4.5, 0, 0.25)),
        ]
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

    calcWindowVectors() {
        this.P1P2 = this.graph3D.calcVector(this.WIN.P2, this.WIN.P1);
        this.P2P3 = this.graph3D.calcVector(this.WIN.P2, this.WIN.P3)
    }

    calcPlaneEqution() {
        this.graph3D.calcPlane(this.WIN.CAMERA, this.WIN.DISPLAY);
    }

    render() {
        // console.log(this.WIN.DISPLAY)
        this.canvas.clear();
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
            if (this.graph3D.sortByVector(polygon.normal, this.WIN.CAMERA, polygon.check)) {
                this.canvas.polygon3D(points, polygon.rgbToHex(r, g, b));
            }

            //Точки по координатам нормальных векторов

            // let x = this.graph3D.xs(polygon.normal);
            // let y = this.graph3D.ys(polygon.normal);
            // this.canvas.printpoint(x, y)
        })

        /*this.figures.forEach(figure => {
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
           /* if (this.pointT) {
                figure.points.forEach(point => {
                    let a = this.getProection(point);
                    this.canvas.printpoint(a.x, a.y)
                });
            } 
        }); */
        this.canvas.text(`FPS = ${this.FPS}`, -9, 9, 18);
    };

    _addEventListeners() {
        document.addEventListener('keydown', event => this.keyDownHandler(event));
        document.getElementById('pushBall').addEventListener("click", () => {
            this.ballMove(this.figures[0]);
        })
        document.getElementById('cleanPlace').addEventListener("click", () => {
            this.startPosition();
        })
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
        this.transformator(this.graph3D.move(
            this.WIN.CAMERA.x * delta,
            this.WIN.CAMERA.y * delta,
            this.WIN.CAMERA.z * delta)
        )

    }

    transformator(matrix) {
        // console.log(matrix);
        this.graph3D.transformation(matrix, this.WIN.CAMERA);
        this.graph3D.transformation(matrix, this.LIGHT);
        this.graph3D.transformation(matrix, this.WIN.DISPLAY);
        this.graph3D.transformation(matrix, this.WIN.P1);
        this.graph3D.transformation(matrix, this.WIN.P2);
        this.graph3D.transformation(matrix, this.WIN.P3)
    }

    mousemove(event) {
        // if (this.canMove) {
        //     const gradus = Math.PI / 180 / 4;

        //     {
        //         const matrix = this.graph3D.rotateOy((this.dy - event.offsetY) * gradus);
        //         this.calcPlaneEqution();
        //         this.transformator(matrix);
        //     } {
        //         const matrix = this.graph3D.rotateOx((this.dx - event.offsetX) * gradus);
        //         this.calcPlaneEqution();
        //         this.transformator(matrix);
        //     }
        //     this.dx = event.offsetX;
        //     this.dy = event.offsetY;
        // }
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
}

