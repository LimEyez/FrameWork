figure.prototype.Cube = (    
    color = "#ff0000",
    r = 5,
    point = new Point(0, 0, 0),
    animations = []
    ) => {

    const points = [
        new Point(r, r, r), new Point(r, -r, r),
        new Point(-r, r, r), new Point(r, r, -r),
        new Point(-r, r, -r), new Point(-r, -r, r),
        new Point(-r, -r, -r), new Point(r, -r, -r)
    ];
    const edges = [
        //-----------------------------//
        new Edge(4, 2), new Edge(r, 2),
        new Edge(6, 5), new Edge(6, 4),
        //-----------------------------//
        new Edge(7, 3), new Edge(0, 1),
        new Edge(7, 1), new Edge(0, 3),
        //-----------------------------//
        new Edge(0, 2), new Edge(5, 1), 
        new Edge(4, 3), new Edge(7, 6),
    ];
    const polygons = [
        new Polygon([0, 1, 5, 2], color), 
        new Polygon([0, 2, 4, 3], color),
        new Polygon([0, 3, 7, 1], color), 
        new Polygon([2, 5, 6, 4], color),
        new Polygon([1, 7, 6, 5], color), 
        new Polygon([4, 6, 7, 3], color)
        ]
    return new Subject (points, edges, polygons, animations); 
}