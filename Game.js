class Game{
    constructor(){
        this.cursor = {x:0,y:0};
        this.figures = [
            {
                id:0,
                x:[0, 0, 40, 40, 120, 120, 160, 160],
                y:[0, 200, 200, 40, 40, 120, 120, 0],
                massa:10,
                centerMass:{x:0,y:0},
                indentFromCenterMass:{x:0,y:0},
                finalMovePoint:{x:0,y:0},
                color:Canvas.getRandomColor()
            },
            {
                id:5,
                x:[180,280,280,180],
                y:[200,200,300,300],
                massa:20,
                centerMass:{x:0,y:0},
                indentFromCenterMass:{x:0,y:0},
                finalMovePoint:{x:0,y:0},
                color:Canvas.getRandomColor()
            },
            {
                id:4,
                massa:150,
                x:[25,50,50,100,175,175,125,125,100,100,50,25],
                y:[0,10,150,200,250,200,250,300,325,425,350,325],
                centerMass:{x:0,y:0},
                indentFromCenterMass:{x:0,y:0},
                finalMovePoint:{x:0,y:0},
                color:Canvas.getRandomColor()
            },
        ];
        this.idActiveFigure = -1;
        this.indexActiveFigureFromArray = -1;
        this.arrReachingFigure = [];
        window.addEventListener("load",()=>this.init())
    }

    updateCenterMass(indexFigure, x,y){
        if(y !== undefined ){
            this.figures[indexFigure].centerMass.x = x;
            this.figures[indexFigure].centerMass.y = y;
            return true;
        }
        else {
            for (let i = 0; i<this.figures.length; i++){
                let center = {X:{min:0,max:0}, Y:{min:0,max:0}};

                center.X.min = Canvas.getMinOfArray(this.figures[i].x);
                center.X.max = Canvas.getMaxOfArray(this.figures[i].x);
                center.Y.min = Canvas.getMinOfArray(this.figures[i].y);
                center.Y.max = Canvas.getMaxOfArray(this.figures[i].y);

                this.figures[i].centerMass.x = center.X.min/2 + center.X.max/2;
                this.figures[i].centerMass.y = center.Y.min/2 + center.Y.max/2;
            }
        }
    }

    init(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        //FPS счётчик
        this.fps = new Stats();
        this.fps.showPanel(0);
        document.body.appendChild(this.fps.dom);

        this.bindEvent();
        this.update();
    }

    bindEvent(){
        window.addEventListener("mousemove",(e)=>{
            this.cursor.x = e.clientX - this.canvas.offsetLeft;
            this.cursor.y = e.clientY - this.canvas.offsetTop;
        });
        window.addEventListener("mousedown",()=>{
            //Проверка нажали ли на фигуру, если да - то её id, нет -1 return
            this.idActiveFigure = Canvas.isEntrance(this.figures, this.cursor);
            if (this.idActiveFigure === -1)  return false;

            //Узнаём её индекс в массиве.
            this.indexActiveFigureFromArray = Canvas.getIdArrFromParameterObject(this.figures,"id",this.idActiveFigure);

            this.figures[this.indexActiveFigureFromArray].finalMovePoint.x = this.cursor.x;
            this.figures[this.indexActiveFigureFromArray].finalMovePoint.y = this.cursor.y;

            // -------------- Всплытие обьекта который взяли наверх ----------------
            this.figures = Canvas.surfacingElementInArray(this.figures,this.indexActiveFigureFromArray);
            this.indexActiveFigureFromArray = Canvas.getIdArrFromParameterObject(this.figures,"id",this.idActiveFigure);
        });
        window.addEventListener("mouseup",(e)=>{
            //Если есть активная фигура то упдейтим финальную точку
            if(this.indexActiveFigureFromArray === -1) return false;

            this.figures[this.indexActiveFigureFromArray].finalMovePoint.x = this.cursor.x;
            this.figures[this.indexActiveFigureFromArray].finalMovePoint.y = this.cursor.y;
            this.arrReachingFigure.push(this.idActiveFigure);

            this.indexActiveFigureFromArray = -1;
            document.body.style.cursor = 'crosshair';
        });

    }

    update(){
        this.fps.begin();
        this.ctx.clearRect(0,0,800,600);

        //Додвигаем фигуры которые бросили, до конечных точек
        for (let j = 0; j < this.arrReachingFigure.length; j++){
            let index = Canvas.getIdArrFromParameterObject(this.figures,"id",this.arrReachingFigure[j]);
            //Если фигура уже на конечной точке, удаляем её индекс из массива
            if(Canvas.isEntrance([Canvas.getCenterMiniFigure(this.figures[index].centerMass, 5)], this.figures[index].finalMovePoint) !== -1) {
                this.arrReachingFigure.splice(j,1);
            }
            else {
                Canvas.incrementElementsObject(
                    this.figures[index],
                    Canvas.getNormalize(
                        this.figures[index].centerMass,
                        this.figures[index].finalMovePoint,
                        2
                    )
                );
            }
        }

        //Перерисовываем все фигуры.
        for(let i = 0; i < this.figures.length; i++){
            //---------- Рисование стрелками----------
            // let vectors = Vector.getArrPointsVectorsFromFigure(this.figures[i]);
            // for (let j =0; j<vectors.length;j++)
            //     Canvas.paintVector(this.ctx,vectors[j].from,vectors[j].to)
            Canvas.paintFigure(this.ctx, this.figures[i]);
        }

        //Если фигура не достигла точки то двигаем её.
        if(this.indexActiveFigureFromArray !== -1 && Canvas.isEntrance([Canvas.getCenterMiniFigure(this.figures[this.indexActiveFigureFromArray].centerMass, 5)], this.cursor) === -1){
            document.body.style.cursor = 'none';
            Canvas.incrementElementsObject(this.figures[this.indexActiveFigureFromArray], Canvas.getNormalize(this.figures[this.indexActiveFigureFromArray].centerMass,this.cursor, 5));
            Canvas.paintVector(this.ctx, this.figures[this.indexActiveFigureFromArray].centerMass, this.cursor, this.indexActiveFigureFromArray);
        }
        this.updateCenterMass();

        this.fps.end();
        requestAnimationFrame(()=>this.update());
    }
}

new Game();