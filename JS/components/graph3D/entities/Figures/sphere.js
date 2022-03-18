figure.prototype.Sphere = (color, R = 10, count = 20) => {
    const animations = [
        {
            method: "rotateOx",
            value: 0.02,
            center: new Point(10, 0 , 0)
        }
        // ,
        // {
        //     method: "rotateOx",
        //     value: 0.01,
        //     center: new Point(-10, 5 , 0)
        // }
    ];
    const points = [];
    const edges = [];
    const polygons = [];
    const center = new Point(10, 0, 0)
    const twoPi = 2 * Math.PI;

    let t = 0;
    let dt = Math.PI / count;
    let df = twoPi / count;
    while (t <= Math.PI) {
        let f = 0;
        while (f < twoPi) {
            points.push(new Point(
                R * Math.cos(t),
                R * Math.sin(t) * Math.cos(f),
                R * Math.sin(t) * Math.sin(f),
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

        if (points[i + 1] && points[i + count + 1]) {
            if ((i + 1) % (count) == 0) {
                polygons.push(new Polygon([i, i - count + 1, i + 1,  i + count], color));
            }
            else {
                polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color))
            }
            if (i + 1 == (points.length - 1) - (count)) {
                polygons.push(new Polygon([i+1, i + 1 - count + 1 , i + 1 + 1,i + 1 + count], color));
            }
        }
    }


    return new Subject(points, edges, polygons, animations, center)

}
