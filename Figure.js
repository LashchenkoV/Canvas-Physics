class Figure {
    constructor(points, speed, color){
        this.id = new Date().getTime();
        this.fillStyle = color === undefined? Canvas.getRandomColorRGBA():color;
        this.speed = speed === undefined?1:parseFloat(speed);
        this.segments = [];
        this.centerMass = {};
        this.shapeFigure(points);
        this.active = 0;
        this.updateCenterMass();
        this.finalMovePoint = this.centerMass;
    }

    /**
     * Формирует фигуру из точек, задавая её отрезками
     * @param points
     */
    shapeFigure(points){
        for(let i = 0; i < points.length; i++){
            let p1,p2;
            if(i === points.length-1){
                p1 = points[i];
                p2 = points[0];
            }
            else{
                p1 = points[i];
                p2 = points[i+1];
            }
            this.segments.push(new Segment(p1, p2))
        }
    }

    /**
     * Возвращает квадрат который лежит в центре фигуры
     * @param radius - половина стороны квадрата
     * @return {Figure}
     */
    getMiniFigureFromCenterFigure(radius){
        let p1 = new Point(this.centerMass.x-radius,this.centerMass.y-radius),
            p2 = new Point(this.centerMass.x+radius, this.centerMass.y-radius),
            p3 = new Point(this.centerMass.x+radius, this.centerMass.y+radius),
            p4 = new Point(this.centerMass.x-radius, this.centerMass.y+radius);
        return new Figure([p1,p2,p3,p4],0);
    }

    /**
     * Обновляет центр массы фигуры
     */
    updateCenterMass(){
        let center = {X:{min:0,max:0}, Y:{min:0,max:0}};
        let points = this.getArrPointsFromFigure();
        center.X.min = Canvas.getMinOfArray(points.x);
        center.X.max = Canvas.getMaxOfArray(points.x);
        center.Y.min = Canvas.getMinOfArray(points.y);
        center.Y.max = Canvas.getMaxOfArray(points.y);
        this.centerMass = new Point(center.X.min/2 + center.X.max/2, center.Y.min/2 + center.Y.max/2)
    }

    /**
     * Сдвигает обьект к конечной точке на нужное колл пикселей
     */
    normalize(){
        this.updateCenterMass();
        let normalize = this.centerMass.getNormalizePoint(this.finalMovePoint, this.speed);
        for (let i = 0; i< this.segments.length; i++){
            this.segments[i].normalizeSegment(normalize);
        }


    }

    /**
     * Выдаёт какие фигуры входят в зону поиска вокруг нашей фигуры
     * @param figures - массив проверяемых фигур
     * @param radius - зона поиска
     * @return {Array}
     */
    getDetectedNearestFigures(figures, radius){
        let arrFigures = [];
        for (let i=0; i<figures.length; i++){
            if (figures[i].centerMass.isSame(this.centerMass))  continue;
            for (let j=0; j < figures[i].segments.length; j++) {
                if (figures[i].segments[j].from.isPointOfCircle(this.centerMass, radius) || figures[i].segments[j].to.isPointOfCircle(this.centerMass, radius)){
                    arrFigures.push(figures[i]);
                    break;
                }
            }
        }
        return arrFigures;
    }

    /**
     * Пересекаются ли фигуры
     * @param figure - фигура которую проверяем на пересекаемость с нашей
     * @return {Array}
     */
    getArrPointFromCrossingFigures(figure){
        let arrPoints = [];
        for (let i = 0; i < this.segments.length; i++){
            for (let j = 0; j < figure.segments.length; j++){
                let isCross = this.segments[i].isCross(figure.segments[j]);
                if(isCross !== false){
                    arrPoints.push(isCross)
                }
            }
        }
        return arrPoints;
    }

    /**
     * Возвращает массив точек фигуры
     * @return {{x: Array, y: Array}}
     */
    getArrPointsFromFigure(){
        let obj = {x:[],y:[]};
        for(let i=0;i<this.segments.length;i++){
            obj.x.push(this.segments[i].from.x);
            obj.y.push(this.segments[i].from.y);
            obj.x.push(this.segments[i].to.x);
            obj.y.push(this.segments[i].to.y);
        }
        return obj;
    }

    /**
     * Входит ли точка в фигуру
     * @param point
     * @return {boolean}
     */
    isPointFromFigure(point){
        let arrPoint = this.getArrPointsFromFigure();
        let j = arrPoint.x.length-1;
        let c = 0;
        for (let i = 0; i < arrPoint.x.length; i++) {
            if (((arrPoint.y[i] <= point.y && point.y < arrPoint.y[j]) || (arrPoint.y[j] <= point.y && point.y < arrPoint.y[i])) && point.x > (arrPoint.x[j] - arrPoint.x[i]) * (point.y - arrPoint.y[i]) / (arrPoint.y[j] - arrPoint.y[i]) + arrPoint.x[i])
                c = !c;
            j = i;
        }
        if(c) return true;
        return false;
    }

    /**
     * Рисует фигуру
     * @param ctx
     */
    paintFigure(ctx){
        ctx.beginPath()
        ctx.fillStyle = this.fillStyle;
        ctx.moveTo(this.segments[0].from.x, this.segments[0].from.y);
        for(let i = 0; i < this.segments.length; i++){
            this.segments[i].paintSegmentFromFigure(ctx);
        }
        ctx.fill();
    }

    /**
     * Возвращает позицию отрезка в фигуре
     * @param segment - какой отрезок найти
     * @return {number}
     */
    getPositionSegmentFromFigure(segment){
        for(let i = 0; i< this.segments.length; i++){
            if(this.segments[i] === segment) return i;
        }
        return -1;
    }

    /**
     * Возвращает периметр фигуры
     * @return {number}
     */
    getPerimetr(){
        let perim = 0;
        for (let i=0; i<this.segments.length;i++){
            perim += this.segments[i].getDistanceSegment();
        }
        return perim;
    }

    /**
     * Возвращает площадь фигуры
     * @return {number}
     */
    getSquareFigure(){
        let square = 0;
        for (let i =0;i<this.segments.length; i++)
            square += ((this.segments[i].from.x * this.segments[i].to.y)-(this.segments[i].to.x * this.segments[i].from.y));
        return Canvas.getRoundNum(Math.abs(0.5*square),2);
    }
}