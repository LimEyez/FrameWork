class Canvas {
    constructor({ callbacks, WIN, id, width, height }) {
        this.WIN = WIN;
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('wheel', callbacks.wheel);
        this.canvas.addEventListener('mousemove', callbacks.mousemove);
        this.canvas.addEventListener('mouseup', callbacks.mouseup);
        this.canvas.addEventListener('mousedown', callbacks.mousedown);
        this.canvas.addEventListener('mouseleave', callbacks.mouseleave);
    }

    xs(x) {
        return this.canvas.width * (x - this.WIN.LEFT) / this.WIN.WIDTH
    }

    ys(y) {
        return this.canvas.height - this.canvas.height * (y - this.WIN.BOTTOM) / this.WIN.HEIGHT
    }

    sx(x) {
        return x * this.WIN.WIDTH / this.canvas.width;
    }

    sy(y) {
        return y * this.WIN.HEIGHT / this.canvas.height;
    }

    clear() {
        this.context.fillStyle = "white";
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    line(x1, y1, x2, y2, color = "black", width, isDash) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        if (isDash) {
            this.context.setLineDash([9, 7]);
        }
        else {
            this.context.setLineDash([])
        }
        this.context.lineWidth = width;
        this.context.globalAlpha = 1;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
    };

    text(str, x, y, size = 18, color = 'black') {
        this.context.beginPath();
        this.context.font = `italic ${size}pt cursive`;
        this.context.fillStyle = color;
        this.context.fillText(str, this.xs(x), this.ys(y));
        this.context.closePath();

    }

    //Локация нумерации
    locatenum(i, x1, y1) {
        if (i) {
            this.text(i, x1, y1, 15);
        } else {
            this.text(i, x1, y1, 18, 'red');
        }
    }

    //Вырисовка 0 функции
    printzero(x) {
        this.context.beginPath();
        this.context.strokeStyle = "red";
        this.context.fillStyle = "red";
        this.context.globalAlpha = 1;
        this.context.arc(this.xs(x), this.ys(0), 3, Math.PI * 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    };


    printpoint(x, y) {
        this.context.beginPath();
        this.context.strokeStyle = "green";
        this.context.fillStyle = "green";
        this.context.globalAlpha = 1;
        this.context.arc(this.xs(x), this.ys(y), 2, Math.PI * 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    };

    XY() {
        this.context.beginPath();
        this.context.fillStyle = "black";
        this.context.font = "italic 12pt cursive";
        this.context.fillText('X', this.canvas.width - 15, this.canvas.height / 2 + 35);
        this.context.fillText('Y', this.canvas.width / 2 + 30, 25);
        this.context.closePath();
    }

    polygon(points, color = '#FF800055') { // псоледние 55 - прозрачности
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.context.closePath();
        this.context.fill();
    }
}