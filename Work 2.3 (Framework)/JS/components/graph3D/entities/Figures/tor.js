figure.prototype.Tor = (color, R = 10, r = 5, count = 21) => {
    const points = [];
    const edges = [];
    const polygons = [];
    const twoPi = 2 * Math.PI;

    let t = 0;
    let dt = Math.PI / count;
    let df = twoPi / count;
    while (t <= twoPi) {
        let f = 0;
        while (f <= twoPi) {
            points.push(new Point(
                (R + r * cos(t)) * cos(f),
                r * sin(t),
                (R + r * cos(t)) * sin(f)
            ));
            f += df;
        };
        t += dt;
    }

   
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count == 0) {
                edges.push(new Edge(i, i + 1 - count));
            }
            else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }

        if (points[i+1] && points[i+count+1]) {
            
            if ((i+1) % (count) == 0) {
                polygons.push(new Polygon([i, i-count+1 , i+1,i+count], color));
            }
            else {
                polygons.push(new Polygon([i, i+1, i+count+1, i+count], color));
            }
            if (i+1 == (points.length-(count+1))) {
                polygons.push(new Polygon([i+1, i+1-count+1 , i+1+1, i+1+count], color));
            }
        }
    }

    return new Subject(points, edges, polygons)

}