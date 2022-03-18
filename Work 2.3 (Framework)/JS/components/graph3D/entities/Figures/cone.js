figure.prototype.Cone = (color, a = 4, b = 4, c = 4, count = 10) => {
    const points = [];
    const edges = [];
    const polygons = []
    const twoPi = 2 * Math.PI;
    const check = true;

    let t = 0;
    let dt = Math.PI / count;
    let df = twoPi / count;
    while (t <= Math.PI) {
        let f = -twoPi;
        while (f < twoPi) {
            points.push(new Point(
                a * t * Math.sin(f),
                b * t,
                c * t * Math.cos(f)
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
                polygons.push(new Polygon([i, i + count, i + 1, i - count + 1], color, check));
            } 
            else {
                polygons.push(new Polygon([i, i + count , i + count + 1, i + 1], color, check))
            }
        }
    }


    return new Subject(points, edges, polygons)

}