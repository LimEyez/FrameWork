class Subject {
    constructor(
        points = [], 
        edges=[], 
        polygons = [], 
        animations = [], 
        center = new Point,
        R = 0
        ) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.animations = animations;
        this.center = center;
        this.R = R
    }
}