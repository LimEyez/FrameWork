figure.prototype.EllipticalParaboloid = (color, a = 7, b = 10, c = 0.5, count = 10) => {
    const points = [];
    const edges = [];
    const polygons = []
    const twoPi = 2 * Math.PI;

    let t = -Math.PI;
    let dt = Math.PI / count;
    let df = twoPi / count;
    while (t <= Math.PI) {
        let f = -Math.PI;
        while (f < Math.PI) {
            points.push(new Point(
                t * Math.sqrt(b) * Math.cos(f),
                c * Math.pow(t, 2),
                t * Math.sqrt(a) * Math.sin(f)
            ));
            f += df;
        };
        t += df;
    }




    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count == 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }

        if (points[i + 1] && points[i + count + 1]) {
            if ((i + 1) % (count) == 0) {
                polygons.push(new Polygon([i, i - count + 1, i + 1, i + count], color));
            } else {
                polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color))
            }
            if (i + 1 == (points.length - 1) - (count)) {
                polygons.push(new Polygon([i + 1, i + 1 - count + 1, i + 1 + 1, i + 1 + count], color));
            }
        }
    }


    return new Subject(points, edges, polygons)

}