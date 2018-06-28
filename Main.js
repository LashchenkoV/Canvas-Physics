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
        this.figures.push(new Circle(new Point(100,400), 7, 70, 100, 40, "rgba(83, 138, 255, 0.56)"));
        this.figures.push(new Rectangle(100,100, new Point(500,250) ,50, 20, "rgba(255,0,255,0.5)"));
        this.idActiveFigure = -1;
        this.indexActiveFigureFromArray = -1;

        this.unitSpaceName = 'cm'||'mm';
        //Сколько пикселей в одном unitSpace
        this.unitSpaceValue = 40;
        this.unitAngleName = 'deg' || 'rad';
        //Сколько радиан в одном unitAngle
        this.unitAngleValue = Math.PI/180;

        window.addEventListener("load",()=>this.init())
    }

    init(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.initUnits();

        //FPS счётчик
        this.fps = new Stats();
        this.fps.showPanel(0);
        document.body.appendChild(this.fps.dom);

        this.bindEvent();
        this.update();
    }

    /**
     * Присваивает Canvas -у единицы измерения пространства и углов.
     */
    initUnits(){
        this.ctx.width = parseInt(this.canvas.width);
        this.ctx.height = parseInt(this.canvas.height);
        this.ctx.unitSpace = this.unitSpaceName;
        this.ctx.unitSpaceRatio = this.unitSpaceValue;
        this.ctx.spaceX = this.ctx.width/this.unitSpaceValue;
        this.ctx.spaceY = this.ctx.height/this.unitSpaceValue;
        this.ctx.unitAngle = this.unitAngleName;
        this.ctx.unitAngleValue = this.unitAngleValue;
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
        Canvas.paintMash(this.ctx,new Point(50,50,"#DEDEDE"));
        for(let i = 0; i<this.figures.length; i++){
            this.figures[i].paintFigure(this.ctx);
            //Если фигура на конечной точке то ничего не делаем
            if(this.figures[i].isFigureFromPoint(this.figures[i].finalMovePoint) && this.figures[i].freeze===1 ){
                continue;
            }
            //Проверяем на столкновение фигуры которые двигаются
            this.figures[i].detectCollision(this.figures,
                null,
                (point)=>{
                    point.paintPoint(this.ctx, 3, false ,"red");
                }
            );
            this.figures[i].normalize();
            new Segment(this.figures[i].centerMass, this.figures[i].finalMovePoint, "#111").paintSegment(this.ctx,true,"Power: "+this.figures[i].maxSpeed+" Massa: "+this.figures[i].massa)
        }
        this.fps.end();
        requestAnimationFrame(()=>this.update());
    }
}

new Main();