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
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            paintGrid(r,c);
            //获得数组中当前行列的数值
            var n = data[r][c];
            //只有数值不为0，才需要绘制前景格和数字
            if(n!=0){
                //paintCell:自定义的绘制前景格的方法
                //原理和paintGrid类似，只不过，前景格还需要绘制数字，所以，多一个参数n，传入当前元素值，将来作为文字绘制在前景格内。
                paintCell(r,c,n);
            }
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
function paintGrid(r=0,c=0){
    var x=OFFSET+(OFFSET+CSIZE)*c,
        y=OFFSET+(OFFSET+CSIZE)*r;
    radiusRect(x,y,CSIZE,CSIZE,CRADIUS,GRIDBG);
}
//定义绘制前景小格的方法，原理和绘制背景小格一样!
function paintCell(r=0,c=0,n){
    var x=OFFSET+(OFFSET+CSIZE)*c,
        y=OFFSET+(OFFSET+CSIZE)*r;
    radiusRect(x,y,CSIZE,CSIZE,CRADIUS,CELLBGS[n]);
    //只不过,前景需要根据字数和数值，修改字体大小和字体颜色
    var fontSize=n<1024?50:30;
    var color=n>=8?"#fff":"#776E65";
    //阶段测试: 运行，可看到两个彩色前景格，刷新，两个彩色前景格位置改变
    
    //前景格需要绘制文字: 
    //paintText是自定义的专门绘制文字的方法
    //参数: 字体大小，字体颜色, 文字内容, x, y坐标
    //说明: 因为希望文字在小格中央，所以，需要将绘制文字的位置，定位到小格的正中心，然后，在绘制时，再根据中心点，居中对齐。
    paintText(fontSize,color,n,x+CSIZE/2,y+CSIZE/2)
}
//自定义绘制文本的方法
//参数: 字体大小，字体颜色, 文字内容, x, y坐标
function paintText(fontSize,color,txt,x,y){
    pen.save();//开始绘制前，保存初始绘图环境，总是好习惯
    //定义字体样式: 粗体，字号，字体名。其中，字体名，是必须的！
    pen.font = 'bold '+fontSize+'px consolas';//必须加字体名!!!
    pen.textAlign = 'center';//以传入的x坐标为中心，水平居中对齐
    pen.textBaseline = 'middle';//以传入的y坐标为中心，垂直居中
    pen.fillStyle = color; //字体颜色
    pen.fillText(txt, x, y); //绘制文字！
    pen.restore(); //恢复绘图环境，为绘制下一幅图做准备
}
//阶段测试: 运行，发现小格中，居中显示出文字，刷新，有变化