class Segment {
    /**
     * Устанавливает отрезок
     * @param fromPoint (Point) - начало отрезка
     * @param toPoint (Point) - конец отрезка
     * @param color - цвет линии
     * @param lineWidth - толщина линии
     */
    constructor(fromPoint, toPoint, color, lineWidth){
        this.from = fromPoint;
        this.to = toPoint;
        this.color = color === undefined?Canvas.getRandomColorRGBA():color;
        this.lineWidth = lineWidth === undefined?1:lineWidth;
    }

    /**
     * Передвигает отрезок к финальной точке
     * @param normalize
     */
    normalizeSegment(normalize){
        this.from.normalizePoint(normalize);
        this.to.normalizePoint(normalize);
    }
    /**
     * Выводит линию
     * @param ctx
     * @param direction - Есть ли направление у линии
     * @param text - текст надписи
     * @param fontSize - размер текста
     */
    paintSegment(ctx, direction, text, fontSize){
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        if(direction === true && direction !== undefined){
            let sizeArrow = 10,
                angle = Math.atan2(this.to.y - this.from.y, this.to.x - this.from.x),
                line = new Path2D();

            if(text !== undefined){
                ctx.font = `${fontSize}px Arial`;
                ctx.strokeText(text, this.to.x + sizeArrow, this.to.y + sizeArrow);
            }

            line.moveTo(this.from.x, this.from.y);
            line.lineTo(this.to.x, this.to.y);
            line.lineTo(this.to.x-sizeArrow*Math.cos(angle-Math.PI/6),this.to.y-sizeArrow*Math.sin(angle-Math.PI/6));
            line.moveTo(this.to.x, this.to.y);
            line.lineTo(this.to.x-sizeArrow*Math.cos(angle+Math.PI/6),this.to.y-sizeArrow*Math.sin(angle+Math.PI/6));
            ctx.stroke(line);
        }
        else {
            ctx.moveTo(this.from.x, this.from.y);
            ctx.lineTo(this.to.x, this.to.y);
            ctx.stroke();
        }
    }

    /**
     * Делает линию но не выводит, специально для рисования фигуры
     * @param ctx
     */
    paintSegmentFromFigure(ctx){
        ctx.lineWidth = this.lineWidth;
        ctx.lineTo(this.to.x, this.to.y);
    }

    /**
     * Пересекаются ли отрезки
     * @param segment - (new Segment())
     * @return {*} - Point() || bool
     */
    isCross(segment){

        let d = (this.from.x - this.to.x) * (segment.to.y - segment.from.y) - (this.from.y - this.to.y) * (segment.to.x - segment.from.x);
        let da = (this.from.x - segment.from.x) * (segment.to.y - segment.from.y) - (this.from.y - segment.from.y) * (segment.to.x - segment.from.x);
        let db = (this.from.x - this.to.x) * (this.from.y - segment.from.y) - (this.from.y - this.to.y) * (this.from.x - segment.from.x);

        let ta = da / d;
        let tb = db / d;

        if (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1)
            return new Point(this.from.x + ta * (this.to.x - this.from.x), this.from.y + ta * (this.to.y - this.from.y));

        return false;
    }

    /**
     * Разделяет отрезок на 2 отрезка
     * @param point
     * @return {*}
     */
    devideSegment(point){
        if(point === undefined ) return false;
        if(!this.isPointOfSegment(point)) return false;
        return [
            new Segment(new Point(this.from.x,this.from.y), new Point(point.x, point.y)),
            new Segment(new Point(point.x, point.y), new Point(this.to.x,this.to.y), ),
        ]
    }

    /**
     * Лежит ли точка на отрезке
     * @param point
     * @return {boolean}
     */
    isPointOfSegment(point){
        if((point.x-this.from.x)/(this.to.x-this.from.x) === (point.y-this.from.y)/(this.to.y-this.from.y)) return true;
        return false;
    }

    /**
     * Возвращает длинну отрезка
     * @return {number}
     */
    getDistanceSegment(){
        return Math.sqrt( Math.pow(this.to.x - this.from.x, 2) + Math.pow(this.to.y - this.from.y, 2));
    }

}