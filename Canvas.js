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
     * Делает элемент последним в массиве со сдвигом всех остальных, (всплытие)
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
     * Возвращает первый Index обьекта в Array в котором произошло совпадение значения заданого параметра
     * @param arrObjects - Массив обьектов типа: [[object],[object]]
     * @param param - По какому параметру в обьекте искать обьект
     * @param value - Значение параметра
     * @returns {number} - Index обьекта или -1 когда не найдено
     */
    static getIdArrFromParameterObject(arrObjects, param, value){
        for (let i = 0; i< arrObjects.length;i++){
            if(arrObjects[i][""+param+""] === value) return i;
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