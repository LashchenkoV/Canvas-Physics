class Main{
    constructor(){
        this.figures = [];
        this.figures.push(new Rectangle(10,600,new Point(0,300), 0, "#666"));
        this.figures.push(new Rectangle(800,10,new Point(400,600), 0, "#666"));
        this.figures.push(new Rectangle(10,600,new Point(800,300), 0, "#666"));
        this.figures.push(new Rectangle(800,10,new Point(400,0), 0, "#666"));
        this.figures.push(new Rectangle(300,10,new Point(200,100), 0, "#666"));

        this.figures.push(new Circle(new Point(300,250), 3, 100,20));
        this.figures.push(new Circle(new Point(300,450), 4, 100,20));
        this.figures.push(new Circle(new Point(500,400), 30, 70, 40));
        this.figures.push(new Circle(new Point(100,400), 7, 70, 40));
        this.figures.push(new Rectangle(100,100,new Point(500,250) ,20, "green"));
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
                //Проверяем столкновение
                this.figures[i].detectCollision(this.figures);
                // if(this.indexActiveFigureFromArray !== -1)
                //     console.log(this.figures[this.indexActiveFigureFromArray].collisionFigures)

                //Если фигура не на конечной точке
                if(!(this.figures[i].isFigureFromPoint(5,this.figures[i].finalMovePoint))){
                    new Segment(this.figures[i].centerMass, this.figures[i].finalMovePoint, "#111").paintSegment(this.ctx,true,"Speed: "+this.figures[i].speed+" Square: "+this.figures[i].getSquareFigure()+" P: "+this.figures[i].getPerimeter())
                    this.figures[i].normalize();
                }
            }
        }
        this.fps.end();
        requestAnimationFrame(()=>this.update());
    }
}

new Main();