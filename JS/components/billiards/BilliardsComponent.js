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

        this.buttonPush = document.getElementById('pushBall');
        this.checkTap = true;

        this.graph3D = new Graph3D({
            WIN: this.WIN,
        });

        this.pushX = document.getElementById("inputX");
        this.pushY = document.getElementById("inputY");

        
        this.powerX = this.pushX - 0;
        this.powerY = this.pushY - 0;
        
        this.dx = 0;
        this.dy = 0;
        this.startPosition()
        this.render();



        const anime = () => {
                const figure = this.figures[0];
                let powerX = this.powerX;
                let powerY = this.powerY;  
                const modulX = Math.abs(powerX);
                const modulY = Math.abs(powerY);
                if (modulX > 0.01 || modulY > 0.01) {
                    this.buttonPush.disabled = true
                    this.buttonPush.setAttribute('class', "disablePush disablePush-three")
                    this.checkTap = !this.checkTap;
                    //============= POWER Y ================
                    let gain = modulY / 50;
                    if (figure.center.y >= 1900 && powerY / modulY == 1) {
                        powerY = -powerY;
                    }
                    else if (figure.center.y <= -1900 && powerY / modulY == -1) {
                        powerY = -powerY;
                    }
                    powerY = this.calcGain(powerY, modulY, gain)
                    //=========== POWER X ==================
                    {
                        let gain = modulX / 50;
                        // console.log(gain, "  gain")
                        if (figure.center.x >= 825 && powerX / modulX == 1) {
                            powerX = -powerX;
                        }
                        else if (figure.center.x <= -825 && powerX / modulX == -1) {
                            powerX = -powerX;
                        }
                        // console.log(powerX, '       1')
                        powerX = this.calcGain(powerX, modulX, gain)
                        // console.log(powerX, '       2')
                    }
                    //======================================
                    this.moveSceneBall(figure, powerX, powerY, 0);
                    this.powerX = powerX ;
                    this.powerY = powerY ;  
                }
                
                else { 
                    this.checkTap = true
                    this.buttonPush.setAttribute('class', "btn btn-three");
                    this.buttonPush.disabled = false;
                }
                requestAnimationFrame(anime);

        }
        anime()
    }


    calcGain(power, modul, gain) {
        const PM = power / modul
        if (PM == 1 ) {
            power -= gain;
        }
        else {
            power =  (-power - gain) * -1; //Такая порнография потому что вычисления делаются иначе очень странно
        }
        return power
    }



    //===========================================



    moveSceneBall(figure, dx = 0, dy = 0, dz = 0) {
        const matrix = this.graph3D.move(dx, dy, dz);
        figure.points.forEach(point => {
            this.graph3D.transformation(matrix, point);
            this.graph3D.transformation(matrix, figure.center);
            // console.log(figure.center)
        });
        this.render();
    }

    fixPolusSphere(figure, polygon) {
        for (let i = 0; i < 3; i++) {
            for (let j = i + 1; j < 4; j++) {
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

    //==============================================

    startPosition() {
        this.figures = [
            (new figure).solarSystem(20, 0.25, new Point(0, 0, 0), "#000000"),
            
            /*----------------------------------------------------------------------------------*/

            //  (new figure).solarSystem(20, 0.25, new Point(0, 0.25, 6), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(-0.5, 0.25, 6), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(0.5, 0.25, 6), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(-0.25, 0.25, 5.5), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(0.25, 0.25, 5.5), "#1E90FF"),
            //  (new figure).solarSystem(20, 0.25, new Point(0, 0.25, 5), "#1E90FF"),
            //  (new figure).Place("#006400", 5, 10, 0, [], new Point(0, 0, 0)),

            /*----------------------------------------------------------------------------------*/
            (new figure).Place("#8B4513", 5, 0.5, 0.25, [], new Point(0, 9.5, 0)),
            (new figure).Place("#8B4513", 5, 0.5, 0.25, [], new Point(0, -9.5, 0)),
            (new figure).Place("#8B4513", 0.5, 10, 0.25, [], new Point(4.5, 0, 0)),
            (new figure).Place("#8B4513", 0.5, 10, 0.25, [], new Point(-4.5, 0, 0)),
        ]
        // console.log(this.figures[1].center)
        // console.log(this.figures[0].center)
    }

    calcWindowVectors() {
        this.P1P2 = this.graph3D.calcVector(this.WIN.P2, this.WIN.P1);
        this.P2P3 = this.graph3D.calcVector(this.WIN.P2, this.WIN.P3)
    }

    calcPlaneEqution() {
        this.graph3D.calcPlane(this.WIN.CAMERA, this.WIN.DISPLAY);
    }

    render() {
        // this.animLoop()
        // console.log(this.WIN.DISPLAY)
        this.calcPlaneEqution(); // получить и записать плоскость экрана
        this.calcWindowVectors(); // вычислить вектора экрана

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
            polygon.normal = this.graph3D.calcCenterPolygon(polygon.points, figure);
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
    };

    transformator(matrix) {
        // console.log(matrix);
        this.graph3D.transformation(matrix, this.WIN.CAMERA);
        this.graph3D.transformation(matrix, this.LIGHT);
        this.graph3D.transformation(matrix, this.WIN.DISPLAY);
        this.graph3D.transformation(matrix, this.WIN.P1);
        this.graph3D.transformation(matrix, this.WIN.P2);
        this.graph3D.transformation(matrix, this.WIN.P3)
        this.render()
    }

    _addEventListeners() {
        document.addEventListener('keydown', event => this.keyDownHandler(event));
        document.getElementById('pushBall').addEventListener("click", () => {
            // this.ballMove(this.figures[0]);
            this.checkTap = false;
            this.powerX = this.pushX.value;
            this.powerY = this.pushY.value;
            // console.log(this.powerX)
            // console.log(this.powerX)
        })
        document.getElementById('cleanPlace').addEventListener("click", () => {
            this.startPosition();
            this.render()
        })
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

    mousemove(event) {
        const center =  this.figures[0].center
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
            this.dx = event.offsetX;
            this.dy = event.offsetY;
            // console.log(this.dx, this.dy)
            // this.canvas.printpoint(this.dx, -this.dy);
        // }
        // console.log(this.dx, this.dy)
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

