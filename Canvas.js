/**
 * Class Canvas 0.1
 * Расширяет функционал элемента Canvas путем упрощения некоторых встроенных возможностей, а так же добавляет новый,
 * Имеет некоторые полезные функции, такие как, например:
 *   - отрисовка вектора ,
 *   - рисование любой фигуры по вашим координатам,
 *   - проверка входа точки в фигуру,
 *   - получение случайного цвета и др.
 *
 * @author - Viktor Lashchenko
 * @email - lashenko.vitek@gmail.com
 * @version - 0.1
 * @licence
 *
 */
class Canvas{


    /**
     * Возвращает площадь произвольной фигуры
     * @param figure
     * @return {number}
     */
    static getSquareFigure(figure){
        let square = 0;
        let segmentsFigure = this.getSegmentsFromFigure(figure);
        for (let i =0;i<segmentsFigure.length; i++)
           square += ((segmentsFigure[i].from.x * segmentsFigure[i].to.y)-(segmentsFigure[i].to.x * segmentsFigure[i].from.y));
        return this.getRoundNum(Math.abs(0.5*square),2);
    }

    /**
     * Возвращает массив точек пересечения 2 фигур
     * @param mainFigure
     * @param figure
     * @return {Array}
     */
    static getPointsFromCrossingFigures(mainFigure, figure){
        let arrPoints = [];
        let segmentsMainFigure = this.getSegmentsFromFigure(mainFigure);
        let segmentsFigure = this.getSegmentsFromFigure(figure);
        for (let i = 0; i < segmentsMainFigure.length; i++){
            for (let j = 0; j < segmentsFigure.length; j++){
                let isCross = this.isCrossLine(segmentsMainFigure[i],segmentsFigure[j]);
                if(isCross !== false)
                    arrPoints.push(isCross)
            }
        }
        return arrPoints;
    }

    /**
     * Возвращает массив отрезков из которых состоит фигура
     * @param figure
     * @return {Array}
     */
    static getSegmentsFromFigure(figure){
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
     * Инкрементирует свойства обьекта на значение
     * @param object - Обьект который нужно инкрементировать
     * @param propertyObjectForIncrement - Обьект (что инкрементировать и на сколько), например:
     *                                     {id:5,x:0.3} - т.е. свойство id на 5, х на 0.3,
     *                                     если id это массив, то каждый его элемент будет проинкрементирован.
     * @returns {*} - готовый обьект
     */
    static incrementElementsObject(object, propertyObjectForIncrement){
        for(let prop in object){
            if(propertyObjectForIncrement.hasOwnProperty(prop)){
                if(Array.isArray(object[prop])){
                    for(let i = 0; i < object[prop].length; i++)
                        object[prop][i] += propertyObjectForIncrement[prop]
                }else
                    object[prop] += propertyObjectForIncrement[prop];
            }
        }
        return object;
    }

    /**
     * Делает элемент последним в массиве со сдвигом всех остальных,
     * Например: [1,2,3,4,5,6] - [1,3,4,5,6,2]
     * @param arr - сам массив
     * @param indexElement - индекс элемента в массиве который нужно поставить в конец
     * @returns array
     */
    static surfacingElementInArray(arr,indexElement){
        for(let i = arr.length-1; i>=indexElement; i--){
            let tmp = arr[i];
            arr[i] = arr[indexElement];
            arr[indexElement] = tmp;
        }
        return arr;
    }

    /**
     * Рисует сетку на Canvas
     * @param ctx - canvas с ОБЯЗАТЕЛЬНЫМИ параметрами height, width
     * @param step - {x:0,y:0} - размер клетки
     * @param color - цвет сетки
     */
    static paintMash(ctx,step,color){
        let mash = new Path2D(),
            width = parseInt(ctx.width),
            height = parseInt(ctx.height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = color === undefined ? "#999" : color;

        for(let i = 0; i < width; i += step.x){
            mash.moveTo(i+0.5,0);
            mash.lineTo(i+0.5,height);
        }
        for(let i = 0 ; i < height; i +=  step.y){
            mash.moveTo(0,i+0.5);
            mash.lineTo(width,i+0.5);
        }
        ctx.stroke(mash);
    }
    /**
     * Рисует стрелку с текстом
     * @param ctx - Поле на котором рисовать
     * @param coordinateFrom - координата откуда
     * @param coordinateTo - координата куда
     * @param text - Текст возле стрелки
     * @param sizeArrow - длинна веток стрелки.
     */
    static paintVector(ctx, coordinateFrom, coordinateTo, text, color, sizeArrow){
        sizeArrow = sizeArrow === undefined ? 10 : sizeArrow;
        color = color === undefined ? "#111":color;
        ctx.strokeStyle = color;
        let angle = Math.atan2(coordinateTo.y - coordinateFrom.y, coordinateTo.x - coordinateFrom.x),
            maxWidthText = 50,
            line = new Path2D();

        if(text !== undefined){
            ctx.font = "11px Arial";
            ctx.strokeText(text, coordinateTo.x + sizeArrow, coordinateTo.y + sizeArrow, maxWidthText);
        }

        line.moveTo(coordinateFrom.x, coordinateFrom.y);
        line.lineTo(coordinateTo.x, coordinateTo.y);
        line.lineTo(coordinateTo.x-sizeArrow*Math.cos(angle-Math.PI/6),coordinateTo.y-sizeArrow*Math.sin(angle-Math.PI/6));
        line.moveTo(coordinateTo.x, coordinateTo.y);
        line.lineTo(coordinateTo.x-sizeArrow*Math.cos(angle+Math.PI/6),coordinateTo.y-sizeArrow*Math.sin(angle+Math.PI/6));
        ctx.stroke(line);
    }

    /**
     * Рисует фигуру по заданым точкам на поле.
     * @param ctx - поле на котором рисовать
     * @param figure - {x:[], y:[], color:"#ddd"}
     */
    static paintFigure(ctx,figure){
        let fig = new Path2D();
        ctx.fillStyle = figure.color;
        fig.moveTo(figure.x[0],figure.y[0]);
        for(let i = 1; i < figure.x.length; i++)
            fig.lineTo(figure.x[i],figure.y[i]);
        ctx.fill(fig);
    }

    /**
     * Пересекаются ли 2 линии
     * @param firstLine
     * @param secondLine
     * @return {*} false || точку пересечения в формате {x:float,y:float}
     */
    static isCrossLine(firstLine, secondLine){
        let point = {x:0,y:0};

        let d = (firstLine.from.x - firstLine.to.x) * (secondLine.to.y - secondLine.from.y) - (firstLine.from.y - firstLine.to.y) * (secondLine.to.x - secondLine.from.x);
        let da = (firstLine.from.x - secondLine.from.x) * (secondLine.to.y - secondLine.from.y) - (firstLine.from.y - secondLine.from.y) * (secondLine.to.x - secondLine.from.x);
        let db = (firstLine.from.x - firstLine.to.x) * (firstLine.from.y - secondLine.from.y) - (firstLine.from.y - firstLine.to.y) * (firstLine.from.x - secondLine.from.x);

        let ta = da / d;
        let tb = db / d;

        if (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1)
        {
            point.x = firstLine.from.x + ta * (firstLine.to.x - firstLine.from.x);
            point.y = firstLine.from.y + ta * (firstLine.to.y - firstLine.from.y);
            return point;
        }

        return false;
    }

    /**
     * Проверяет входит ли точка в круг
     * @param point - {x:0,y:0}
     * @param circle - {x:0,y:0,r:0}
     * @return {boolean}
     */
    static isPointOfCircle(point, circle){
        if(Math.sqrt(Math.pow(circle.x - point.x,2)+Math.pow(circle.y - point.y,2)) <= circle.r) return true;
        return false;
    }

    /**
     * Проверяет входит ли точка в фигуру, возвращает id-figure
     * @param figures  = [{id:0,x:[],y:[]}.{id:1,x:[],y:[]}] - массив обьектов (фигур)
     * @param XY - координата точки которую нужно проверить на вхождение
     * @returns {number} -1 если вхождений не найдено, или индекс элемента.
     */
    static isEntrance(figures, XY) {
        for(let indexFigure = 0; indexFigure < figures.length; indexFigure++){
            let j = figures[indexFigure].x.length-1;
            let c = 0;
            for (let i = 0; i < figures[indexFigure].x.length; i++) {
                if (((figures[indexFigure].y[i] <= XY.y && XY.y < figures[indexFigure].y[j]) || (figures[indexFigure].y[j] <= XY.y && XY.y < figures[indexFigure].y[i])) && XY.x > (figures[indexFigure].x[j] - figures[indexFigure].x[i]) * (XY.y - figures[indexFigure].y[i]) / (figures[indexFigure].y[j] - figures[indexFigure].y[i]) + figures[indexFigure].x[i])
                    c = !c;
                j = i;
            }
            if(c) return figures[indexFigure].id;
        }
        return -1;
    }

    /**
     * Возвращает массив обьектов которые входят в зону поиска
     * @param objects - обьекты которые нужно проверить
     * @param centerPoint - центр круга
     * @param radius - радиус круга в котором будет проверка
     * @return {Array}
     */
    static getDetectedNearestObject(objects, centerPoint, radius){
        let arrObjects = [];
        for (let i=0; i<objects.length; i++){
            if (objects[i].centerMass === centerPoint)  continue;
            for (let j=0; j < objects[i].x.length; j++) {
                if (this.isPointOfCircle({x:objects[i].x[j], y:objects[i].y[j]}, {x:centerPoint.x, y:centerPoint.y, r:radius})){
                    arrObjects.push(objects[i]);
                    break;
                }
            }
        }
        return arrObjects;
    }

    /**
     * Возвращает значения на сколько нужно сдвигать, что бы достич конечную точку, а проще (нормализацию)
     * @param from - кто двигается
     * @param to - куда двигаться
     * @param speed - скорость движения
     * @returns {{x: number, y: number}}
     */
    static getNormalize(from, to, speed) {
        speed = speed === undefined ? 1 : speed;
        let normalize = {x:0,y:0},
            target = this.getTarget(from,to);
        normalize.x = target.x / Math.sqrt(Math.pow(target.x, 2) + Math.pow(target.y, 2)) * speed;
        normalize.y = target.y / Math.sqrt(Math.pow(target.x, 2) + Math.pow(target.y, 2)) * speed;

        return normalize;
    }

    /**
     * Возвращает расстояние от координаты - from, до координаты - to
     * @param from - object {x:numb,y:numb}
     * @param to - object {x:numb,y:numb}
     * @returns {{x: number, y: number}}
     */
    static getTarget(from, to){return {x: to.x - from.x, y: to.y - from.y}}

    /**
     * Возвращает первый Index обьекта в Array в котором произошло совпадение значения заданого параметра
     * @param arrObjects - Массив обьектов типа: [[object],[object]]
     * @param param - По какому параметру в обьекте искать обьект
     * @param value - Значение параметра
     * @returns {number} - Index обьекта или -1 когда не найдено
     */
    static getIdArrFromParameterObject(arrObjects, param, value){
        for (let i = 0; i< arrObjects.length;i++){
            if(arrObjects[i][param] === value) return i;
        }
        return -1;
    }

    /**
     * Возвращает координаты квадрата вокруг точки
     * @param centerMass - {x:50,y:127} Сама точка
     * @param radius - Радиус квадрата
     * @returns {{x: *[], y: *[]}} - массив с координатами 4 точек
     */
    static getCenterMiniFigure(centerMass,radius){
        return {x:[centerMass.x-radius,centerMass.x+radius,centerMass.x+radius,centerMass.x-radius], y:[centerMass.y-radius,centerMass.y-radius,centerMass.y+radius,centerMass.y+radius]};
    }

    /**
     * Возвращает максимальный елемент массива
     * @param numArray - массив
     * @returns {number}
     */
    static getMaxOfArray(numArray) {return Math.max.apply(null, numArray)}

    /**
     * Возвращает минимальный елемент массива
     * @param numArray - массив
     * @returns {number}
     */
    static getMinOfArray(numArray) {return Math.min.apply(null, numArray)}

    /**
     * Возвращает случайное число от min до max
     * @param min - минимальное значение
     * @param max - максимальное значение
     * @returns {number}
     */
    static getRandomInt(min,max){return Math.round(min - 0.5 + Math.random() * (max - min + 1))};

    /**
     * Округляет число до заданой точности
     * @param number - число которое нужно округлить
     * @param n - колличество знаков после запятой
     * @return {number}
     */
    static getRoundNum(number, n){return +parseFloat(number).toFixed(n)}

    /**
     * Возвращает случайный код цвета типа #ffffff
     * @returns {string}
     */
    static getRandomColor(){return '#'+Math.floor(Math.random()*16777215).toString(16)}

    /**
     * Возвращает случайный цвет типа rgba(0,0,0,0.5)
     * @param transperent - прозрачность float(0-1)
     * @return {string}
     */
    static getRandomColorRGBA(transperent){
        transperent = transperent === undefined ? 1 : transperent;
        return `rgba(${this.getRandomInt(0,255)},${this.getRandomInt(0,255)},${this.getRandomInt(0,255)},${transperent})`;
    }
}