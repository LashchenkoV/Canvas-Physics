class Rectangle extends Figure{
    constructor(sizeX, sizeY, centerPoint, massa, speed, color){
        sizeX/=2;
        sizeY/=2;
        let p1 = new Point(centerPoint.x-sizeX, centerPoint.y-sizeY),
            p2 = new Point(centerPoint.x+sizeX, centerPoint.y-sizeY),
            p3 = new Point(centerPoint.x+sizeX, centerPoint.y+sizeY),
            p4 = new Point(centerPoint.x-sizeX, centerPoint.y+sizeY);
        super([p1,p2,p3,p4], massa, speed, color);
    }
}
