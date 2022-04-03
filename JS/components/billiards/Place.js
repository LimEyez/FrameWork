figure.prototype.Place = (
    color = "#ff0000",
    a = 10,
    b = 5,
    c = 1,
    animations = [],
    point = new Point(0, 0, 0),
) => {

    const check = true;

    const points = [
        new Point(point.x + a, point.y + b, point.z + c), new Point(point.x + -a, point.y + b, point.z + c),
        new Point(point.x + -a, point.y + -b, point.z + c), new Point(point.x + a, point.y + -b, point.z + c),
        new Point(point.x + a, point.y + b, point.z + -c), new Point(point.x + -a, point.y + b, point.z + -c),
        new Point(point.x + -a, point.y + -b, point.z + -c), new Point(point.x + a, point.y + -b, point.z + -c),
    ];
    const edges = [
        //-----------------------------//
        new Edge(0, 1), new Edge(1, 2),
        new Edge(2, 3), new Edge(3, 0),
        //-----------------------------//
        new Edge(4, 5), new Edge(5, 6),
        new Edge(6, 7), new Edge(7, 4),
        //-----------------------------//
        new Edge(7, 3), new Edge(4, 0),
        new Edge(5, 1), new Edge(6, 2),
    ];
    const polygons = [
        new Polygon([0, 3, 2, 1], color),
        new Polygon([4, 5, 6, 7], color),
        new Polygon([1, 2, 6, 5], color),
        new Polygon([4, 7, 3, 0], color),
        new Polygon([0, 1, 5, 4], color),
        new Polygon([2, 3, 7, 6], color)
    ]
    polygons.forEach(poly => {
        poly.check = check;
    });
    return new Subject(points, edges, polygons, animations, point);
}