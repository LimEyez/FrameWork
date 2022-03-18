figure.prototype.HyperbolicParaboloid = (color, p = 20, q = 10, c = 10, count = 10) => {
    const points = [];
    const edges = [];
    const polygons = []
    const twoPi = 2 * Math.PI;
    const dt = Math.PI / count;
    const check = true;
    const df = twoPi / count;
    const deltaC = c / count;

    let t = -Math.PI;
    while (t < Math.PI) {
        let f = 0;
        while (f < Math.PI) {
            points.push(new Point(
                t * Math.sqrt(2 * p),
                f * Math.sqrt(2 * q),
                Math.pow(t, 2) - Math.pow(f, 2)
            ));
            f += dt;
        };
        t += dt;
    }
    t = -Math.PI;
    while (t < Math.PI) {
        let f = 0;
        while (f < Math.PI) {
            points.push(new Point(
                t * Math.sqrt(2 * p),
                -f * Math.sqrt(2 * q),
                Math.pow(t, 2) - Math.pow(f, 2)
            ));
            f += dt;
        };
        t += dt;
    }

    for (let i = 0; i < points.length/2; i++) {
        if ((i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if ((points[i + count]) && (i + count < points.length/2)) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = points.length/2; i < points.length; i++) {
        if ((i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        }
        if ((points[i + count]) && (i + count < points.length)) {
            edges.push(new Edge(i, i + count));
        }
    }


    //polygons
    for (let i = 0; i < points.length / 2 - count * 2; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + 1, i + count * 2 + 1, i + count * 2], color, check));
        }
    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (points[i + count * 2 + 1]) {
            if ((i + 1) % (count) === 0) {
                null
            } else
                polygons.push(new Polygon([i, i + count * 2, i + count * 2 + 1, i + 1], color, check));
        }
    }


    return new Subject(points, edges, polygons)

}