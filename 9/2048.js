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
//判断是否游戏结束
function isGAMEOVER(){
    //遍历data中每个元素
    for(var r=0;r<4;r++){
        for(var c=0;c<4;c++){
            //只要有任何一个元素是0，说明还没结束
            if(data[r][c]==0)
                return false;
            //除最右侧列之外，只要任何元素等于右边相邻元素，说明也没结束
            if(c<3&&data[r][c]==data[r][c+1])
                return false;
            //除最底一行外，只要任何元素等于下方相邻元素，说明没结束
            if(r<3&&data[r][c]==data[r+1][c])
                return false;
        }
    }//如果遍历完，都没退出，说明没有0，没有相等的了，说明游戏结束
    return true;
}


function moveUp() {
    var start=String(data);
    for (var c = 0; c < 4; c++) {
        moveUpInCol(c);
    }
    var end=String(data);
    if(start!=end){
        randomNum();
        //在三个移动全部行/列的方法结尾，移动结束位置，添加以下if判断。
        //必须在随机生成数之后，更新页面之前，判断游戏是否结束，并修改游戏状态
        if(isGAMEOVER()){
            state=GAME_OVER;
        }
        //只要状态一修改，更新界面时，就会绘制游戏结束界面，并禁用操作
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


