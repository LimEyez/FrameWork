class Subject {
    constructor(points = [], edges=[], polygons = [], animations = [], center = new Point) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
	    this.animations = animations;
    }
}