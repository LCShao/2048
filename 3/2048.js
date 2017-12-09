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
function updateView(){ 
    radiusRect(0,0,SIZE,SIZE,RADIUS,BG);
    //遍历二维数组data中每个格子
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            //每遍历一个格子，就先绘制一个背景格
            //paintGrid:自定义的绘制背景格的方法
            //参数: paintGrid(行,列)
            //说明: paintGrid中将会根据行，列，以及格子大小自动计算精确x,y坐标
            paintGrid(r,c);
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
//自定义绘制每个背景格的方法，参数: 背景格的行，列下标
function paintGrid(r=0,c=0){
    //每个背景格，其实都是一个圆角矩形，所以，只要调用上一步自定义的radiusRect方法，传入新的位置和大小即可
    //计算绘制当前背景格的绝对坐标x=间距+(间距+格子大小)*列下标
    var x=OFFSET+(OFFSET+CSIZE)*c,
        y=OFFSET+(OFFSET+CSIZE)*r;//同x坐标算法
    //调用radiusRect方法，传入新的位置,大小和颜色，绘制小圆角矩形
    radiusRect(x,y,CSIZE,CSIZE,CRADIUS,GRIDBG);
}
//阶段测试: 运行，看到背景格