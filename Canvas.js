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
     * Рисует стрелку с текстом
     * @param ctx - Поле на котором рисовать
     * @param coordinateFrom - координата откуда
     * @param coordinateTo - координата куда
     * @param text - Текст возле стрелки
     * @param sizeArrow - длинна веток стрелки.
     */
    static paintVector(ctx, coordinateFrom, coordinateTo, text, sizeArrow){
        sizeArrow = sizeArrow === undefined ? 10 : sizeArrow;

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
     * Возвращает координаты квадрата вокруг точки
     * @param centerMass - {x:50,y:127} Сама точка
     * @param radius - Радиус квадрата
     * @returns {{x: *[], y: *[]}} - массив с координатами 4 точек
     */
    static getCenterMiniFigure(centerMass,radius){
        return {x:[centerMass.x-radius,centerMass.x+radius,centerMass.x+radius,centerMass.x-radius], y:[centerMass.y-radius,centerMass.y-radius,centerMass.y+radius,centerMass.y+radius]};
    }

    /**
     * Рисует фигуру по заданым точкам на поле.
     * @param ctx - поле на котором рисовать
     * @param paramFigure - {x:[], y:[], color:"#ddd"}
     */
    static paintFigure(ctx,paramFigure){
        let figure = new Path2D();
        ctx.fillStyle = paramFigure.color;
        figure.moveTo(paramFigure.x[0],paramFigure.y[0]);
        for(let i = 1; i < paramFigure.x.length; i++)
            figure.lineTo(paramFigure.x[i],paramFigure.y[i]);
        ctx.fill(figure);
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
        return "rgba("+this.getRandomInt(0,255)+","+this.getRandomInt(0,255)+","+this.getRandomInt(0,255)+","+transperent+")";
    }
}