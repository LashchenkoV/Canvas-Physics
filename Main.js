class Main{
    constructor(){
        this.figures = [];
        this.figures.push(new Rectangle(10,600,new Point(0,300), 0, 0, "#666"));
        this.figures.push(new Rectangle(800,10,new Point(400,600),0, 0, "#666"));
        this.figures.push(new Rectangle(10,600,new Point(800,300), 0, 0, "#666"));
        this.figures.push(new Rectangle(800,10,new Point(400,0), 0, 0, "#666"));
        this.figures.push(new Rectangle(300,10,new Point(200,200),0, 0, "#666"));

        this.figures.push(new Circle(new Point(300,250), 3, 100, 20, 20));
        this.figures.push(new Circle(new Point(300,450), 4, 100, 20, 20));
        this.figures.push(new Circle(new Point(500,400), 30, 70, 10, 40));
        this.figures.push(new Circle(new Point(100,400), 7, 70, 100, 40));
        this.figures.push(new Rectangle(100,100, new Point(500,250) ,50, 20, "green"));
        this.idActiveFigure = -1;
        this.indexActiveFigureFromArray = -1;
        window.addEventListener("load",()=>this.init())
    }

    init(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.width = parseInt(this.canvas.width);
        this.ctx.height = parseInt(this.canvas.height);

        //Cвет
        // this.ctx.globalCompositeOperation = 'lighter';

        //Прозрачность
        // this.ctx.globalAlpha = 1;

        //Тень
        // this.ctx.shadowColor = '#999';
        // this.ctx.shadowOffsetY = 100;
        // this.ctx.shadowOffsetX = 100;

        //FPS счётчик
        this.fps = new Stats();
        this.fps.showPanel(0);
        document.body.appendChild(this.fps.dom);

        this.bindEvent();
        this.update();
    }

    bindEvent(){
        window.addEventListener("mousemove",(e)=>{
            this.cursor = new Point(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
            if(this.indexActiveFigureFromArray !== -1){
                this.figures[this.indexActiveFigureFromArray].finalMovePoint = this.cursor;
            }
        });
        window.addEventListener("mousedown",()=>{
            for(let i = 0; i<this.figures.length; i++){
                if(this.figures[i].speed !== 0 && this.figures[i].isPointFromFigure(this.cursor)){
                    document.body.style.cursor = 'none';
                    this.figures[i].rotate(this.figures[i].centerMass, 1);
                    this.figures[i].active = 1;
                    this.indexActiveFigureFromArray = i;
                    this.idActiveFigure = this.figures[i].id;
                    break;
                }
                else {
                    this.figures[i].active = 0;
                }
            }
            if(this.indexActiveFigureFromArray !== -1) {
                // -------------- Всплытие обьекта который взяли наверх ----------------
                this.figures = Canvas.surfacingElementInArray(this.figures, this.indexActiveFigureFromArray);
                this.indexActiveFigureFromArray = Canvas.getIdArrFromParameterObject(this.figures, "id", this.idActiveFigure);
            }
        });
        window.addEventListener("mouseup",(e)=>{
            document.body.style.cursor = 'crosshair';
            if(this.indexActiveFigureFromArray !== -1){
                this.figures[this.indexActiveFigureFromArray].finalMovePoint = this.cursor;
                this.figures[this.indexActiveFigureFromArray].active = 0;
            }
            this.indexActiveFigureFromArray = -1;
            this.idActiveFigure = -1;
        });

    }

    update(){
        this.fps.begin();
        this.ctx.clearRect(0,0,800,600);
        Canvas.paintMash(this.ctx,{x:50,y:50},"#DEDEDE");
        for(let i = 0; i<this.figures.length; i++){
            this.figures[i].paintFigure(this.ctx);
            //Если предмет не замороженный
            if(this.figures[i].freeze !== 1){
                this.figures[i].rotate(this.figures[i].segments[0].from, -1);
                //Проверяем столкновение, и вызываем callback сначала для Figure
                //с которой collision потом для Point
                this.figures[i].detectCollision(this.figures,
                    null,
                    // (figure)=>{
                    //     if (figure.freeze === 1) return false;
                    //     let norm = figure.centerMass.getNormalizePoint(this.figures[i].finalMovePoint,this.figures[i].power)
                    //     figure.normalize(norm);
                    // },
                    (point)=>{
                        point.paintPoint(this.ctx, 5, false ,"red");
                    }
                );

                // let gravityNormalize = this.figures[i].centerMass.getNormalizePoint(new Point(this.figures[i].finalMovePoint.x, 600), this.figures[i].acceleration)
                // this.figures[i].normalize(gravityNormalize);
                // //Если фигура не на конечной точке
                if(!(this.figures[i].isFigureFromPoint(this.figures[i].finalMovePoint))){
                    new Segment(this.figures[i].centerMass, this.figures[i].finalMovePoint, "#111").paintSegment(this.ctx,true,"Power: "+this.figures[i].power+" Massa: "+this.figures[i].massa)
                    this.figures[i].normalize();
                }
            }
        }
        this.fps.end();
        requestAnimationFrame(()=>this.update());
    }
}

new Main();