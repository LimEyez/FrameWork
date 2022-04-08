figure.prototype.solarSystem = (
    count = 40,
    R = 15,
    point = new Point(0, 0, 0),
    color = "#ff0000",
    animations = [],
    offDark = false
    ) => {

    const points = [];
    const edges = [];
    const polygons = [];

    //точки
    const dt = Math.PI * 2 / count;
    for (let i = 0; i <= Math.PI; i += dt) {
        for (let j = 0; j < Math.PI * 2; j += dt) {
            const x = point.x + R * Math.cos(j) * Math.sin(i);
            const z = point.y + R * Math.cos(i);
            const y = point.z + R * Math.sin(j) * Math.sin(i);
            points.push(new Point(x, y, z));
        }
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
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
        }
    }

    polygons.forEach(poly => {
        poly.color = poly.hexToRgb(color);
        poly.offDark = offDark;
    });

    return new Subject(points, edges, polygons, animations, point, R);
}