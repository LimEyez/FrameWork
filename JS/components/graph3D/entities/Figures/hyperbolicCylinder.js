figure.prototype.HyperbolicCylinder = (color, a = 1, b = 3, c = 4, count = 10) => {
    const points = [];
    const edges = [];
    const polygons = []
    const twoPi = 2 * Math.PI;
    const dt = Math.PI / count;
    const check = true;
    const x1 = -0.5; 
    const x2 = 0.5;

    let t = -Math.PI;
    while (t <= Math.PI) {
        let f = 0;
        while (f < Math.PI) {
            points.push(new Point(
                x1 * a * Math.cosh(t),
                x1 * b * Math.sinh(t),
                x1 * c * f
            ));
            f += dt;
        };
        t += dt;
    }
    t = -Math.PI;
    while (t <= Math.PI) {
        let f = 0;
        while (f < Math.PI) {
            points.push(new Point(
                x1 * a * -Math.cosh(t),
                x1 * b * -Math.sinh(t),
                x1 * c * f
            ));
            f += dt;
        };
        t += dt;
    }
    t = -Math.PI;
    while (t <= Math.PI) {
        let f = 0;
        while (f < Math.PI) {
            points.push(new Point(
                x2 * -a * Math.cosh(t),
                x2 * b * Math.sinh(t),
                x2 * c * f
            ));
            f += dt;
        };
        t += dt;
    }
    t = -Math.PI;
    while (t <= Math.PI) {
        let f = 0;
        while (f < Math.PI) {
            points.push(new Point(
                x2 * -a * -Math.cosh(t),
                x2 * b * -Math.sinh(t),
                x2 * c * f
            ));
            f += dt;
        };
        t += dt;
    }


    //edges
    for (let i = 0; i < points.length/4; i++) {
        if ((i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if ((points[i + count]) && (i + count < points.length/2)) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = points.length/4; i < points.length/2; i++) {
        if ((i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if ((points[i + count]) && (i + count < points.length)) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = points.length/2; i < 3*points.length/4; i++) {
        if ((i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if ((points[i + count]) && (i + count < points.length/2)) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = 3*points.length/4; i < points.length; i++) {
        if ((i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if ((points[i + count]) && (i + count < points.length)) {
            edges.push(new Edge(i, i + count));
        }
    }


    //polygons
    for (let i = 0; i < points.length / 4 - count * 2; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + 1, i + count * 2 + 1, i + count * 2], color, check));
        }
    }
    for (let i = points.length / 4; i < points.length / 2 - count * 2; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + 1, i + count * 2 + 1, i + count * 2], color, check));
        }
    }
    for (let i = points.length / 2; i < 3/4*points.length - count * 2; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + count * 2, i + count * 2 + 1, i + 1], color, check));
        }
    }
    for (let i = 3/4*points.length; i < points.length - count * 2; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + 1, i + count * 2 + 1, i + count * 2], color, check));
        }
    }
    
    


    return new Subject(points, edges, polygons)

}