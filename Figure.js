class Figure {
    constructor(points, massa, power, color){
        this.id = Canvas.getRandomInt(Canvas.getRandomInt(0,new Date().getTime()),new Date().getTime());
        this.fillStyle = color === undefined? Canvas.getRandomColorRGBA():color;
        this.power = power === undefined?1:power;
        this.massa = massa === undefined?1:massa;
        this.gravity = 9.34;
        this.acceleration = this.power/this.massa;
        this.segments = [];
        this.centerMass = {};
        this.collisionFigures = [];
        this.zoneDetect = 350;
        this.shapeFigure(points);
        this.active = 0;
        this.freeze = this.power !== 0 ? 0 : 1;
        this.zoneDetect = this.freeze === 1?0:410;
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
     * Проверка, находится ли центр фигуры на point
     * @param radius - Радиус проверки(половина стороны квадрата)
     * @param point - проверяемая точка
     * @return {boolean}
     */
    isFigureFromPoint(point,radius){
        radius = radius === undefined?5:radius;
        let p1 = new Point(this.centerMass.x-radius,this.centerMass.y-radius),
            p2 = new Point(this.centerMass.x+radius, this.centerMass.y-radius),
            p4 = new Point(this.centerMass.x-radius, this.centerMass.y+radius);

        if((point.x > p1.x && point.x<p2.x) && (point.y>p1.y && point.y<p4.y))
            return true;
        else return false;
    }

    /**
     * Обновляет центр массы фигуры
     */
    updateCenterMass(){
        let center = {X:{min:0,max:0}, Y:{min:0,max:0}};
        let points = this.getArrPointsFromFigure();
        center.X.min = Canvas.getMinOfArray(points.x)/2;
        center.X.max = Canvas.getMaxOfArray(points.x)/2;
        center.Y.min = Canvas.getMinOfArray(points.y)/2;
        center.Y.max = Canvas.getMaxOfArray(points.y)/2;
        this.centerMass = new Point(center.X.min + center.X.max, center.Y.min + center.Y.max)
    }

    /**
     * Вращает фигуру вокруг указанной точки
     * @param point - точка вокруг которой нужно вращать
     * @param direction - в какую сторону, -> -(int) || +(int)
     * @param deg - колличество градусов на которое повернуть
     */
    rotate(point, deg, direction){
        for (let i = 0; i< this.segments.length; i++) {
            this.segments[i].rotateSegment(point, deg, direction);
        }
    }

    /**
     * Сдвигает обьект к конечной точке на нужное колл пикселей
     */
    normalize(normalize){
        this.updateCenterMass();
        normalize = normalize===undefined?this.centerMass.getNormalizePoint(this.finalMovePoint, this.power):normalize;
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
            //Если это мы то ничего не делаем
            if (figures[i].id === this.id)  continue;
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
     * @param callbackForPoint - функция которую нужно применить для точки, например рисовать.
     * @return {object}||-1 - Если есть сопадения то обьект с id figure and cross Points
     */
    getArrPointFromCrossingFigures(figure, callbackForPoint){
        let arrPoints = {idFigure:figure.id,points:[]};
        for (let i = 0; i < this.segments.length; i++){
            for (let j = 0; j < figure.segments.length; j++){
                let isCross = this.segments[i].isCross(figure.segments[j]);
                if(isCross !== false){
                    callbackForPoint!==undefined?callbackForPoint(isCross):0;
                    arrPoints.points.push(isCross)
                }
            }
        }
        if(arrPoints.points.length !== 0)
            return arrPoints;
        else return -1;
    }

    /**
     * Обнаруживает столкновения с figures, результат хранится в this.collisionFigures
     * @param callbackForPoint - функция которую нужно применить для Point.
     * @param callbackForFigure - функция которую нужно применить для Figure c которой
     *                            столкнулись, если она не нужна, а callbackPoint нужна,
     *                            передать вместо ф-ции null
     * @param figures - Фигуры с которыми проверять столкновение,
     *                  не стоит забывать, если они не входят в зону
     *                  обнаружения (zoneDetect), они будут проигнорированы
     */
    detectCollision(figures, callbackForFigure, callbackForPoint){
        let arrDetectFigure = this.getDetectedNearestFigures(figures, this.zoneDetect);
        this.collisionFigures = [];
        //Обнаруживаем столкновения с фигурами
        for(let i = 0; i < arrDetectFigure.length; i++){
            let collisionFigure = this.getArrPointFromCrossingFigures(arrDetectFigure[i], callbackForPoint);
            //Если есть столкновение то добавляем его в массив столкновений проверяемой фигуры
            if(collisionFigure !== -1){
                callbackForFigure !== null?callbackForFigure(arrDetectFigure[i]):0;
                this.collisionFigures.push(collisionFigure);
            }
        }
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
        ctx.beginPath();
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
            if(this.segments[i].id === segment.id) return i;
        }
        return -1;
    }

    /**
     * Возвращает периметр фигуры
     * @return {number}
     */
    getPerimeter(){
        let p = 0;
        for (let i=0; i<this.segments.length;i++)
            p += this.segments[i].getDistanceSegment();
        return Canvas.getRoundNum(p,0);
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