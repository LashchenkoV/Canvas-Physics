class Circle extends Figure{
    constructor(centerPoint, countPoint, radius, massa, speed, color){
        Circle.centerMass = centerPoint;
        Circle.radius = radius;
        Circle.countPoint = countPoint <= 100 ? countPoint : 100;
        super(null, massa, speed, color );
    }

    shapeFigure(){
        let x1,y1,x2,y2,
            arrSegment = [],
            step = (Math.PI*2)/Circle.countPoint;

        for(let i=0; i < Math.PI*2; i+=step){
            x1 = Math.round(Circle.centerMass.x + Circle.radius * Math.cos(i));
            y1 = Math.round(Circle.centerMass.y + Circle.radius * Math.sin(i));
            x2 = Math.round(Circle.centerMass.x + Circle.radius * Math.cos(i+step));
            y2 = Math.round(Circle.centerMass.y + Circle.radius * Math.sin(i+step));
            arrSegment.push(new Segment(new Point(x1, y1), new Point(x2,y2)))
        }
        this.segments = arrSegment;
    }
}