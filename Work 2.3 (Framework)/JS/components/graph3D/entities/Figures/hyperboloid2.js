figure.prototype.Hyperboloid2 = (color, a = -1, b = 1, c = 1, count = 10) => {
    const points = [];
    const edges = [];
    const polygons = []
    const twoPi = 2 * Math.PI;
    const dt = Math.PI / count;
    const df = twoPi / count;
    const check = true;

    let t = -Math.PI;
    while (t < Math.PI) {
        let f = 0;
        while (f < twoPi) {
            points.push(new Point(
                a * Math.sinh(t) * Math.cos(f),
                -b * Math.cosh(t),
                c * Math.sinh(t) * Math.sin(f)
            ));
            f += df;
        };
        t += df;
    }
    t = -Math.PI;
    while (t < Math.PI) {
        let f = 0;
        while (f < twoPi) {
            points.push(
                new Point(
                a * Math.sinh(t) * Math.cos(f),
                b * Math.cosh(t),
                c * Math.sinh(t) * Math.sin(f)
                ),
            )
            f += df;
        };
        t += df;
    }


    //edges
    for(let i = 0; i < points.length / 2 - count; i++) {
        if(points[i + 1]) {
            if((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if(points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
    }
    for(let i = points.length / 2; i < points.length; i++) {
        if(points[i + 1]) {
            if((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if(points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
    }
    edges.push(new Edge(points.length - count, points.length - 1));

    //polygons
    for(let i = 0; i < points.length / 2 - count; i++) {
        if(points[i + count + 1]) {
            if((i + 1) % count === 0) {
                null
            } else
            polygons.push(new Polygon(
                [i, i + 1, i + count + 1, i + count], color, check
            ));
        }
    }
    for(let i = points.length / 2; i < points.length; i++) {
        if(points[i + count + 1]) {
            if((i + 1) % count === 0) {
                null
            } else
            polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color, check));
        }
    }
    polygons.push(new Polygon([0, count - 1, 2 * count - 1, count], color, check));
    polygons.push(new Polygon([points.length / 2 + count - 1, points.length / 2, points.length / 2 + count , points.length / 2 + 2 * count - 1], color, check));
    
    return new Subject(points, edges, polygons)

}