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
    },
    data=null,
    RUNNING = 1, GAME_OVER = 0,
    score = 0,
    state = RUNNING;

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
    //启动游戏时，自动重绘一切
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
/***************定义重绘一切的统一方法***************************/
function updateView(){ 
    //在canvas中绘制大背景
    //radiusRect:是自定义的专门绘制带圆角的矩形的方法
    //参数: radiusRect(x,y,宽,高,圆角半径,矩形填充色)
    radiusRect(0,0,SIZE,SIZE,RADIUS,BG);
}
/*自定义的绘制圆角矩形的方法*/
//参数: (x,y,宽,高,圆角半径,矩形填充色)
function radiusRect(x, y, w, h, r, fillStyle) {
    //开始任何复杂绘制前，保存当前画笔的绘图环境，总是好的习惯。
    pen.save();//保存现在的初始绘图环境，是为了本次绘制完之后，能将画笔恢复初始状态，而不影响下次绘制。
    //开始记录本次绘图路径
    pen.beginPath();//必须先调用beginPath()！！！和结尾的closePath()配对
    //说明基本路线: 左上角开始，顺时针，延边记录路线
    pen.moveTo(x + r, y);//将画笔移动到左上角圆弧结束的末尾位置
    //再移动到右上角圆角开始的位置,向右上角圆弧结束的末尾位置绘制圆角
    pen.arcTo(x + w, y, x + w, y + h, r);
    //再移动到右下角圆角开始的位置，向右下角圆弧结束位置绘制圆角
    pen.arcTo(x + w, y + h, x, y + h, r);
    //再移动到左下角圆角开始的位置，向左下角圆弧结束位置绘制圆角
    pen.arcTo(x, y + h, x, y, r);
    //再移动到左上角圆角开始的位置，向左上角圆弧结束位置绘制圆角
    pen.arcTo(x, y, x + w, y, r);
    //到此，路线闭合
    pen.closePath();
    //用指定的颜色，设置画笔填充颜色
    pen.fillStyle=fillStyle;
    //调用fill方法，将颜色填充到刚才绘制的矩形区域内
    pen.fill();
    //绘制完，将画笔恢复到初始状态，以防止影响后续图形的绘制。
    pen.restore();
}
//阶段测试: 运行，看到圆角矩形背景