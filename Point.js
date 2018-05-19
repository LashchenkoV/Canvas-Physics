class Point {

    constructor(x,y, color){
        this.x = x;
        this.y = y;
        this.color = color === undefined?"#111":color;
    }

    /**
     * Рисует точку
     * @param ctx - поле на котором рисовать
     * @param r - радиус
     * @param flag - может прийнять значение fill- тогда будет полная заливка.
     */
    paintPoint(ctx, r, flag, color){
        r = r === undefined ? 5:r;
        ctx.beginPath();
        ctx.fillStyle = color === undefined?this.color:color;
        ctx.strokeStyle = undefined?this.color:color;
        ctx.arc(this.x, this.y, r, 0, Math.PI*2);
        flag === true? ctx.fill():ctx.stroke();
    }

    /**
     * Входт ли точка в круг
     * @param center - Point()- Центр круга
     * @param r - радиус круга
     * @return {boolean}
     */
    isPointOfCircle(center, r){
        if(this.getDistance(center) <= r)
            return true;
        else
            return false;
    }

    /**
     * Совпадает ли точка с нашей точкой
     * @param point - точка с которой проверяем
     * @return {boolean}
     */
    isSame(point){
        if(point.x === this.x && point.y === this.y)
            return true;
        else return false;
    }

    /**
     * Дистанция между точками, или длинна отрезка
     * @param point - точка проверки
     * @return {number}
     */
    getDistance(point){
        return Math.sqrt( Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2) );
    }

    /**
     * Возвращает сдвиг
     * @param point - к какой точке сдвиг
     * @return {Point}
     */
    getTarget(point){
        return new Point(point.x - this.x, point.y - this.y);
    }


    /**
     * Возвращает колл пикселей на которое нужно сдвинуть точку,
     * для достижения контрольной точки
     * @param point - к какой точке делать сдвиг
     * @param speed - скорость движения
     * @return {Point}
     */
    getNormalizePoint(point, speed){
        speed = speed === undefined?1:speed;
        let target = this.getTarget(point);
        if(target.x === 0  && target.y === 0 )
            return new Point(0, 0);
        let x = target.x / this.getDistance(target) * speed;
        let y = target.y / this.getDistance(target) * speed;
        //let y = target.y / Math.sqrt(Math.pow(target.x, 2) + Math.pow(target.y, 2)) * speed;
        return  new Point(x, y);
    }

    /**
     * Двигает точку на point пикселей
     * @param point
     */
    normalizePoint(point){
        this.x +=  point.x;
        this.y +=  point.y;
    }

}