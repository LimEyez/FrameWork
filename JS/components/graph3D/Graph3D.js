class Graph3D {
    constructor({ WIN }) {
        this.WIN = WIN;
    }

    xs(point) {
        return point.x * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) / (this.WIN.CAMERA.z - point.z);
    }
    ys(point) {
        return point.y * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) / (this.WIN.CAMERA.z - point.z);
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
        const array = this.multMatrix(matrix, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
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
            (a.x * b.x + a.y * b.y + a.z * b.z) /
            (Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2)) * Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2) + Math.pow(b.z, 2)));
        if ((Math.acos(resault) >= 0 && Math.acos(resault) <= 7 * Math.PI / 12) || check) {
            return true
        }
        else {
            return false
        }
    }

}