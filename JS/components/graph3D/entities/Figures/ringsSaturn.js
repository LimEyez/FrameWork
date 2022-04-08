figure.prototype.ringsSaturn = (
    count = 40,
    R = 15,
    point = new Point(0, 0, 0),
    color = "#ff0000",
    animations,
    center) => {

    const dt = Math.PI * 2 / count;
    const points = [];
    const edges = [];
    const polygons = [];
    const check = true;

    //точки 
    for (let i = 0; i < Math.PI * 2; i += dt) {
        const x = point.x + R * Math.sin(i);
        const y = point.y + R * Math.cos(i);
        const z = point.z;
        points.push(new Point(x, y, z));
    }
    R /= 1.5;
    for (let i = 0; i < Math.PI * 2; i += dt) {
        const x = point.x + R * Math.sin(i);
        const y = point.y + R * Math.cos(i);
        const z = point.z;
        points.push(new Point(x, y, z));
    }

    //ребра
    for (let i = 0; i < points.length; i++) {
        //вдоль
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(
                i,
                i + 1
            ));
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(
                i,
                i + 1 - count
            ));
        }
        //поперек
        if (i < points.length - count) {
            edges.push(new Edge(
                i,
                i + count
            ));
        }
    }

    //полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]),);
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
        }
    }

    polygons.forEach(poly => {
        poly.color = poly.hexToRgb(color);
        poly.check = check;
    });

    return new Subject(points, edges, polygons, animations, center);
}