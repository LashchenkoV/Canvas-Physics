class Main{
    constructor(){
        this.figures = [];
        this.figures.push(new Figure([new Point(120,160), new Point(200,160), new Point(320,40), new Point(320,80), new Point(280,120), new Point(320,160), new Point(360,200), new Point(280,280), new Point(240,280), new Point(200,320), new Point(200,160), new Point(200,200), new Point(120,200),], 5));
        this.figures.push(new Circle(new Point(200,200), 3, 100,20));
        this.figures.push(new Circle(new Point(300,200), 4, 100,20));
        this.figures.push(new Circle(new Point(500,400), 30, 70, 40));
        this.figures.push(new Circle(new Point(100,400), 6, 70, 40));
        this.figures.push(new Rectangle(100,100,new Point(500,300) ,20, "red"));
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
                if(this.figures[i].isPointFromFigure(this.cursor)){
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
                //this.figures = Canvas.surfacingElementInArray(this.figures, this.indexActiveFigureFromArray);
                //this.indexActiveFigureFromArray = Canvas.getIdArrFromParameterObject(this.figures, "id", this.idActiveFigure);
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
            let arrDetectFigure = this.figures[i].getDetectedNearestFigures(this.figures, 200);
            for(let j = 0; j < arrDetectFigure.length; j++){
                let arrPoints = this.figures[i].getArrPointFromCrossingFigures(arrDetectFigure[j]);
                if(arrPoints.length !== 0){
                    for (let p = 0; p<arrPoints.length; p++){
                        arrPoints[p].paintPoint(this.ctx, 4, true, "red")
                    }
                }
            }
            //Если фигура не на конечной точке
            if(!(this.figures[i].getMiniFigureFromCenterFigure(this.figures[i].speed)).isPointFromFigure(this.figures[i].finalMovePoint)){
                new Segment(this.figures[i].centerMass, this.figures[i].finalMovePoint, "#111").paintSegment(this.ctx,true,this.figures[i].speed)
                this.figures[i].normalize();
            }

        }
        this.fps.end();
        requestAnimationFrame(()=>this.update());
    }
}

new Main();