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
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    pen.save();
    pen.beginPath();//必须beginPath()和结尾的closePath()配对
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

    $("#score").innerHTML = score;
    state==GAME_OVER&&paintGAMEOVER();
}

function paintGrid(r=0,c=0){
    var x=OFFSET+(OFFSET+CSIZE)*c,
        y=OFFSET+(OFFSET+CSIZE)*r;
    radiusRect(x,y,CSIZE,CSIZE,CRADIUS,GRIDBG);
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
function paintGAMEOVER(){
    radiusRect(0,0,SIZE,SIZE,RADIUS,"rgba(55,55,55,.5)");
    var pwidth=300, pheight=200,
        x=(SIZE-pwidth)/2, y=(SIZE-pheight)/2,
        fontSize=40;
    radiusRect(x,y,pwidth,pheight,CRADIUS,"#fff");
    paintText(fontSize,"#555","GAME OVER!",x+pwidth/2,y+pheight/6);
    paintText(fontSize,"#555","Score:"+score,x+pwidth/2,y+pheight/2);
    x+=50; y+=120; 
    var width=200, height=55;
    radiusRect(x,y,width,height,CRADIUS,BG);
    paintText(fontSize,"#fff","Try again!",x+width/2,y+height/2);
    cv.onclick=e=>{
        if(state==GAME_OVER){
            var ex=e.offsetX, ey=e.offsetY;
            if(ex>=x&&ex<=x+width&&ey>=y&&ey<=y+height)
                start();
        }
    }
}
window.onkeydown=e=>{
    if(state==RUNNING)
    switch(e.keyCode){
        case 37:
            moveLeft();
            break;
        case 38:
            moveUp();
            break;
        case 39:
            moveRight();
            break;
    }
}
//添加触摸事件
(()=>{
    //定义变量，接收滑动开始和结束的坐标
    var startx,starty,endx,endy;
    //为window添加滑动开始事件，记录鼠标开始的坐标
    window.addEventListener('touchstart',function(e){
        var touch=e.changedTouches;
        startx=touch[0].clientX;
        starty=touch[0].clientY;
    });
    //为window添加滑动结束事件，获得鼠标结束位置
    window.addEventListener('touchend',function(e){
        var touch=e.changedTouches;
        endx=touch[0].clientX;
        endy=touch[0].clientY;
        //稍加延迟，再调用移动方法
        setTimeout(()=>{
            //计算鼠标偏移量
            var movedX=endx-startx, movedY=endy-starty;
            //如果向左滑动，且左滑动的距离>上或下活动距离，说明左移
            if(movedX<0&&Math.abs(movedX)>Math.abs(movedY))
                moveLeft();
            //否则如果向右滑动，且右滑动的距离>上下滑动的距离，说明右移
            else if(movedX>0&&Math.abs(movedX)>Math.abs(movedY))
                moveRight();
            //否则如果向上移动，且上滑动距离>左右移动的距离，说明上移
            else if(movedY<0&&Math.abs(movedY)>Math.abs(movedX))
                moveUp();
        },300);
    });
})();
//测试: 打开网页，键盘可操作。打开f12，在移动端设备模拟器上滑动，测试功能

function moveLeft() {
    var start=String(data);
    for (var r = 0; r < 4; r++) {
        moveLeftInRow(r);
    }
    var end=String(data);
    if(start!=end){
        randomNum();
        if(isGAMEOVER()){
            state=GAME_OVER;
        }
        updateView();
    }
}
function moveLeftInRow(r) {
    for(var c=0;c<3;c++){
        var nextc=getNextInRow(r,c);
        if(nextc==-1) break;
        else{
            if(data[r][c]==0){
                data[r][c]=data[r][nextc];
                data[r][nextc]=0;
                c--;
            }else if(data[r][c]==data[r][nextc]){
                data[r][c]*=2;
                score+=data[r][c];
                data[r][nextc]=0;
            }
        }
    }
}
function getNextInRow(r,c) {
    for(;++c<4;){
        if(data[r][c]!=0)
            return c;
    }
    return -1;
}
function moveRight() {
    var start=String(data);
    for (var r = 0; r < 4; r++) {
        moveRightInRow(r);
    }
    var end=String(data);
    if(start!=end){
        randomNum();
        if(isGAMEOVER()){
            state=GAME_OVER;
        }
        updateView();
    }
}
function moveRightInRow(r) {
    for(var c=3;c>0;c--){
        var prevc=getPrevInRow(r,c);
        if(prevc==-1) break;
        else{
            if(data[r][c]==0){
                data[r][c]=data[r][prevc];
                data[r][prevc]=0;
                c++;
            }else if(data[r][c]==data[r][prevc]){
                data[r][c]*=2;
                score+=data[r][c];
                data[r][prevc]=0;
            }
        }
    }
}
function getPrevInRow(r,c) {
    for(;--c>=0;){
        if(data[r][c]!=0)
            return c;
    }
    return -1;
}

function moveUp() {
    var start=String(data);
    for (var c = 0; c < 4; c++) {
        moveUpInCol(c);
    }
    var end=String(data);
    if(start!=end){
        randomNum();
        if(isGAMEOVER()){
            state=GAME_OVER;
        }
        updateView();
    }
}
function moveUpInCol(c) {
    for(var r=0;r<3;r++){
        var nextr=getNextInCol(r,c);
        if(nextr==-1) break;
        else{
            if(data[r][c]==0){
                data[r][c]=data[nextr][c];
                data[nextr][c]=0;
                r--;
            }else if(data[r][c]==data[nextr][c]){
                data[r][c]*=2;
                score+=data[r][c];
                data[nextr][c]=0;
            }
        }
    }
}
function getNextInCol(r,c) {
    for(;++r<4;){
        if(data[r][c]!=0)
            return r;
    }
    return -1;
}

function isGAMEOVER(){
    for(var r=0;r<4;r++){
        for(var c=0;c<4;c++){
            if(data[r][c]==0)
                return false;
            if(c<3&&data[r][c]==data[r][c+1])
                return false;
            if(r<3&&data[r][c]==data[r+1][c])
                return false;
        }
    }
    return true;
}