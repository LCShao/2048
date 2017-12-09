function $(id) { return document.querySelector(id); }
var SIZE=500, BG="#BBADA0", RADIUS=10,
    cv=$("#cv"),pen=cv.getContext("2d"),
    OFFSET=20, CSIZE=100, CRADIUS=6, GRIDBG="#ccc0b3",
    CELLBGS={
        "2":"#eee4da",
        "4": "#ede0c8",
        "8": "#f2b179",
        "16": "#f59563",
        "32": "#f67c5f",
        "64": "#f65e3b",
        "128": "#edcf72",
        "256": "#edcc61",
        "512": "#9c0",
        "1024": "#33b5e5",
        "2048": "#09c",
        "4096": "#a6c",
        "8192": "#93c"
    };
var data=null;
var RUNNING = 1, GAME_OVER = 0;
var score = 0;
var state = RUNNING;

function start(){
    score=0; state=RUNNING;
    data=[]
    for (var r = 0; r < 4; r++) {
        data[r]=[];        
        for (var c = 0; c < 4; c++) {
            data[r][c] = 0;
        }
    }
    randomNum();
    randomNum();
    updateView();
}
window.onload=start;//首次绘制，必须在window.onload中！！！
function randomNum() {
    while (true) {
        var c = parseInt(Math.random() * 4);
        var r = parseInt(Math.random() * 4);
        if (data[r][c] == 0) {
            data[r][c] = Math.random() < 0.5 ? 2 : 4;
            break;
        }
    }
}
function radiusRect(x, y, w, h, r, fillStyle) {
    pen.save();
    pen.beginPath();
    pen.moveTo(x + r, y);
    pen.arcTo(x + w, y, x + w, y + h, r);
    pen.arcTo(x + w, y + h, x, y + h, r);
    pen.arcTo(x, y + h, x, y, r);
    pen.arcTo(x, y, x + w, y, r);
    pen.closePath();
    pen.fillStyle=fillStyle;
    pen.fill();
    pen.restore();
}
function updateView(){ 
    radiusRect(0,0,SIZE,SIZE,RADIUS,BG);
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            paintGrid(r,c);
            var n = data[r][c];
            if(n!=0){
                paintCell(r,c,n);
            }
        }
    }
    //实时将分数显示在canvas外的p元素中
    $("#score").innerHTML = score;
    //绘制游戏结束界面,备用(先不要加前边的判断条件，测试通过，再解开注释)
    /*state==GAME_OVER&&*/paintGAMEOVER();
    //正常情况下，只要游戏结束时，才需要绘制游戏结束界面
}
function paintGrid(r=0,c=0){
    radiusRect(OFFSET+(OFFSET+CSIZE)*c,OFFSET+(OFFSET+CSIZE)*r,CSIZE,CSIZE,CRADIUS,GRIDBG);
}
function paintCell(r=0,c=0,n){
    var x=OFFSET+(OFFSET+CSIZE)*c,
        y=OFFSET+(OFFSET+CSIZE)*r;
    radiusRect(x,y,CSIZE,CSIZE,CRADIUS,CELLBGS[n]);
    var fontSize=n<1024?50:30;
    var color=n>=8?"#fff":"#776E65";
    paintText(fontSize,color,n,x+CSIZE/2,y+CSIZE/2)
}
function paintText(fontSize,color,txt,x,y){
    pen.save();
    pen.font = 'bold '+fontSize+'px consolas';//必须加字体名!!!
    pen.textAlign = 'center';
    pen.textBaseline = 'middle';
    pen.fillStyle = color;
    pen.fillText(txt, x, y);
    pen.restore();
}
/**************自定义绘制游戏结束界面的方法***********************/
function paintGAMEOVER(){
    //绘制半透明矩形，完整覆盖canvas，作为模态框的底
    radiusRect(0,0,SIZE,SIZE,RADIUS,"rgba(55,55,55,.5)");
    //定义中心小窗口的大小和左上角坐标位置,以及字体
    var pwidth=300, pheight=200,
        x=(SIZE-pwidth)/2, y=(SIZE-pheight)/2,
        fontSize=40;
    //绘制中心小窗口
    radiusRect(x,y,pwidth,pheight,CRADIUS,"#fff");
    //绘制gameover文字
    paintText(fontSize,"#555","GAME OVER!",x+pwidth/2,y+pheight/6);
    //绘制最终得分文字
    paintText(fontSize,"#555","Score:"+score,x+pwidth/2,y+pheight/2);
    //定义try again按钮左上角的坐标位置
    x+=50; y+=120; 
    //定义按钮大小
    var width=200, height=55;
    //绘制按钮
    radiusRect(x,y,width,height,CRADIUS,BG);
    //绘制按钮文本try again
    paintText(fontSize,"#fff","Try again!",x+width/2,y+height/2);
    //为canvas绑定单击事件，判断是否点在按钮范围内，
    cv.onclick=e=>{
        //这只有在游戏结束时，点击才有效果
        //if(state==GAME_OVER){
            //获得鼠标位置
            var ex=e.offsetX, ey=e.offsetY;
            //如果鼠标位置在按钮位置范围内
            if(ex>=x&&ex<=x+width&&ey>=y&&ey<=y+height)
                start();//调用start重新启动游戏
        //}
        //阶段测试: 运行，看到游戏结束界面
                 //暂时注释掉if(state==GAME_OVER),运行，单击按钮，发现游戏重新开始(随机数变了)
        //测试后: 解开注释if(state==GAME_OVER)，以及updateView方法结尾，paintGAMEOVER()之前的判断条件
    }
}
