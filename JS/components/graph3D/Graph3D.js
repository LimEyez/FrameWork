class Graph3D {
    constructor({ WIN }) {
        this.WIN = WIN;
        this.WIN = WIN;
        this.plane = {
            a: 0,
            b: 0,
            c: 0,

            x0: 0,
            y0: 0,
            z0: 0,

            xs: 0,
            ys: 0,
            zs: 0
        }
    }

    xs(point) {
        return point.x * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) / (this.WIN.CAMERA.z - point.z);
    }
    ys(point) {
        return point.y * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) / (this.WIN.CAMERA.z - point.z);
    }

    calcPlane(point1, point2) {
        const vector = this.calcVector(point1, point2);
        // console.log(vector)
        this.plane.a = vector.x;
        this.plane.b = vector.y;
        this.plane.c = vector.z;

        this.plane.x0 = point2.x;
        this.plane.y0 = point2.y;
        this.plane.z0 = point2.z;

        this.plane.xs = point1.x;
        this.plane.ys = point1.y;
        this.plane.zs = point1.z;
    }

    getProection(point) {
        const {a, b, c, x0, y0, z0, xs, ys, zs} = this.plane;
        const m = point.x - xs;
        const n = point.y - ys;
        const p = point.z - zs;
        const t = (a*(x0 - xs) + b*(y0 - ys)+ c*(z0 - zs)) / (a*m + b*n + c*p);
        const ps = {
            x: x0 + m*t,
            y: y0 + n*t,
            z: z0 + p*t,
        }
        return {
            x: ps.x - a,
            y: ps.y - b,
            z: ps.z - c,
        }
    }

    scalProd(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z
    }

    calcVector(a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }

    calcCorner(a, b) {
        return (this.scalProd(a, b)) / (Math.sqrt(this.scalProd(a, a)) * (Math.sqrt(this.scalProd(b, b))));
    }
    
    calcVectorModule(a) {
        return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
    }

    zoom(delta) {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ]
    }

    move(dx, dy, dz) {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ]
    }

    animateMatrix(dx, dy, dz, method, value) {
        return [
            this.move(dx, dy, dz),
            this[method](value),
            this.move(-dx, -dy, -dz)
        ].reduce(
            (S, matrix) => this.multMatrixes(S, matrix),
            this.one()
        );
    }

    rotateOy(alpha) {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -(Math.sin(alpha)), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ]
    }

    rotateOx(alpha) {
        return [
            [Math.cos(alpha), 0, -(Math.sin(alpha)), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ]
    }

    rotateOz(alpha) {
        return [
            [cos(alpha), 0, -sin(alpha), 0],
            [0, 1, 0, 0],
            [sin(alpha), 0, cos(alpha), 0],
            [0, 0, 0, 1]
        ]
    }

    transformation(matrix, point) {
        // console.log(point)
        const array = this.multMatrix(matrix, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    one() {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }


    //Второй вариан функции вычисления расстояния полигона до опр. объекта
    calcDistance(figure, endPoint, name) {
        figure.polygons.forEach(polygon => {
            const points = polygon.points;
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < points.length; i++) {
                x += figure.points[points[i]].x;
                y += figure.points[points[i]].y;
                z += figure.points[points[i]].z;
            }
            x = x / points.length;
            y = y / points.length;
            z = z / points.length;
            polygon[name] = Math.sqrt(
                Math.pow(endPoint.x - x, 2) +
                Math.pow(endPoint.y - y, 2) +
                Math.pow(endPoint.z - z, 2)
            )
        });
    }

    //Метод, возвращения значения освещенности
    calcIllumination(distance, lumen) {
        const res = distance ? lumen / Math.pow(distance, 3) : 1;
        return res > 1 ? 1 : res;
    }

    sortByArtistAlgoritm(polygons) {
        polygons.sort((a, b) => (b.distance - a.distance));
    }

    multMatrix(delta, defMatrix) {
        const newMatrix = [0, 0, 0, 0];
        for (let i = 0; i < delta.length; i++) {
            for (let j = 0; j < delta.length; j++) {
                newMatrix[i] += defMatrix[j] * delta[j][i];
            }
        }
        return newMatrix;
    }

    multMatrixes(a, b) {
        const c = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let s = 0;
                for (let k = 0; k < 4; k++) {
                    s += a[i][k] * b[k][j];
                }
                c[i][j] = s;
            }
        }
        return c;
    }

    zero() {
        return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    }

    one() {
        return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }

    mult(a, b) {
        const c = this.zero();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let s = 0;
                for (let k = 0; k < 4; k++) {
                    s += a[i][k] * b[k][j];
                }
                c[i][j] = s;
            }
        }
        return c;
    }

    multVector(points, figure) {
        const point = figure.points
        const normal = {
            x: (point[points[1]].y - point[points[2]].y) * (point[points[3]].z - point[points[2]].z) - (point[points[1]].z - point[points[2]].z) * (point[points[3]].y - point[points[2]].y),
            y: (point[points[1]].z - point[points[2]].z) * (point[points[3]].x - point[points[2]].x) - (point[points[1]].x - point[points[2]].x) * (point[points[3]].z - point[points[2]].z),
            z: (point[points[1]].x - point[points[2]].x) * (point[points[3]].y - point[points[2]].y) - (point[points[1]].y - point[points[2]].y) * (point[points[3]].x - point[points[2]].x),
        }
        return normal;
    }

    sortByVector(normal, camera, check) {
        const a = normal;
        const b = camera;
        const resault =
            (this.scalProd(a, b)) /
            (Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2)) * Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2) + Math.pow(b.z, 2)));
        if ((Math.acos(resault) >= 0 && Math.acos(resault) <=  Math.PI / 1.5) || check) {
            return true
        }
        else {
            return false
        }
    }

}