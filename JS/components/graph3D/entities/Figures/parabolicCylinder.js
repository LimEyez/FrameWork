figure.prototype.ParabolicCylinder = (color, a = 10, b = 8, count = 10) => {
    const points = [];
    const edges = [];
    const polygons = []
    const twoPi = 2 * Math.PI;
    const deltaC = a / count
    const check = true;

    let t = -a;
    let dt = Math.PI / count;
    let df = twoPi / count;

    while (t < a) {
        let f = 0;
        while (f < twoPi) {
            points.push(new Point(
                Math.sqrt(2 * b * f),
                t,
                f,
            ));
            f += dt;
        };
        t += deltaC;
    }

    t = -a;

    while (t < a) {
        let f = 0;
        while (f < twoPi) {
            points.push(new Point(
                -Math.sqrt(2 * b * f),
                t,
                f,
            ));
            f += dt;
        };
        t += deltaC;
    }

    //Edges
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if (((i + 1) % (count * 2) === 0)) {
                null
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
    }
    for (let j = points.length / 2; j < points.length; j++) {
        if (points[j + count * 2]) {
            edges.push(new Edge(j, j + count * 2));
        }
    }
    for (let j = 0; j < points.length / 2 - count * 2; j++) {
        if (points[j + count * 2]) {
            edges.push(new Edge(j, j + count * 2));
        }
    }

    //Polygons
    for (let i = 0; i < points.length / 2 - count * 2; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count * 2) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + count * 2, i + count * 2 + 1, i + 1], color, check));
        }
    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count * 2) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + 1, i + count * 2 + 1, i + count * 2], color, check));
        }
    }


    return new Subject(points, edges, polygons)

}