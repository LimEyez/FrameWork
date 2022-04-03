class Billiards {
    constructor({ graph3D}) {
        this.graph3D = graph3D
    }

    ballMove(figure, power) {
        if (power > 0) {
            this.moveScene(figure, 0, power, 0)
            power = power - 1;
            this.ballMove(figure, power)
        }
    }

    moveScene(figure, dx = 0, dy = 0, dz = 0) {
        const matrix = this.graph3D.move(dx, dy, dz);
        figure.points.forEach(point => {
            this.graph3D.transformation(matrix, point)
        });
    }
}