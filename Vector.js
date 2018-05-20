class Vector {
    /**
     * TODO:Возвращает пересекаются ли фигуры
     * @param firstFigure
     * @param secondFigure
     * @returns bool - пересекаются или нет
     */
    static crossingFigures(firstFigure, secondFigure) {
        let vectorsFirstFigure = this.getArrVectorsFromFigure(firstFigure),
            vectorsSecondFigure = this.getArrVectorsFromFigure(secondFigure)

        for (let i = 0; i < vectorsFirstFigure.length; i++){

        }
    }

    /**
     * Возвращает массив векторов фигуры
     * @param figure
     * @return {Array} objects type{x:coor,y:coor}
     */
    static getArrVectorsFromFigure(figure){
        let arrPoints = this.getArrPointsVectorsFromFigure(figure);
        let vectors = [];
        for (let i =0; i<arrPoints.length;i++){
            vectors.push(this.getCoorVectorFromPoints(arrPoints[i]));
        }
        return vectors;
    }

    /**
     * Возвращает координаты вектора относительно точек вектора
     * @param vector
     * @return {{x: number, y: number}}
     */
    static getCoorVectorFromPoints(vector){
        return {x: vector.to.x - vector.from.x, y: vector.to.y - vector.from.y}
    }

    /**
     * Возвращает массив точек координат векторов фигуры
     * @param figure
     * @return {Array}
     */
    static getArrPointsVectorsFromFigure(figure){
        let arr = [];
        for(let i = 0; i < figure.x.length; i++){
            let toX = figure.x[i+1],
                toY = figure.y[i+1];

            if(i === figure.x.length-1){
                toX = figure.x[0];
                toY = figure.y[0];
            }

            arr.push({
                from: {x:figure.x[i], y:figure.y[i]},
                to: {x:toX, y:toY}
            });
        }
        return arr;
    }

    /**
     * Возвращает Проекцию вектора from на to
     * @param from
     * @param to
     * @returns {{x: number, y: number}}
     */
    static getProjectionVectors(from, to) {
        let scalar = this.getScalarMultiplying(from,to);
        return {
            x: ( scalar / (to.x * to.x + to.y * to.y) ) * to.x,
            y: ( scalar / (to.x * to.x + to.y * to.y) ) * to.y
        };
    }

    /**
     * Возвращает скалярное произведение двух векторов
     * @param vector1
     * @param vector2
     * @returns {number}
     */
    static getScalarMultiplying(vector1, vector2){
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    /**
     * Возвращает нормированый вектор
     * @param vector
     * @returns object || -1 если длинна = 0
     */
    static getNormalizeVector(vector){
        let len = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
        if (len !== 0)
            return {x: vector.x/len, y: vector.y/len};
        else
            return -1;
    }

    static getNormalLeft(vector){
        return {x: vector.y, y: -vector.x}
    }
}