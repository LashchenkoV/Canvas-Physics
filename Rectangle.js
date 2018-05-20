class Rectangle extends Figure{
    constructor(sizeX, sizeY, centerPoint, speed, color){
        Rectangle.sizeX = sizeX/2;
        Rectangle.sizeY = sizeY/2;
        Rectangle.centerPoint = centerPoint;
        let p1 = new Point(Rectangle.centerPoint.x-Rectangle.sizeX, Rectangle.centerPoint.y-Rectangle.sizeY),
            p2 = new Point(Rectangle.centerPoint.x+Rectangle.sizeX, Rectangle.centerPoint.y-Rectangle.sizeY),
            p3 = new Point(Rectangle.centerPoint.x+Rectangle.sizeX, Rectangle.centerPoint.y+Rectangle.sizeY),
            p4 = new Point(Rectangle.centerPoint.x-Rectangle.sizeX, Rectangle.centerPoint.y+Rectangle.sizeY);
        super([p1,p2,p3,p4],speed, color);

    }
}
