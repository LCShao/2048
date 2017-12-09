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
window.onkeydown=e=>{//为窗口绑定键盘按下事件
    if(state==RUNNING)//只有在程序运行时
    switch(e.keyCode){//判断键盘号
        case 37://左
            moveLeft();//调用左移所有行方法
            break;
    }
}
//左移所有行的方法
function moveLeft() {
    //移动前，为数组拍照(将数组内容转为字符串)
    var start=String(data);
    //遍历每一行
    for (var r = 0; r < 4; r++) {
        //每遍历一行，就调用左移一行的方法，左移当前行
        moveLeftInRow(r);
    }
    //移动后再为数组拍照
    var end=String(data);
    //如果开头的照片和结尾的照片不一样，说明发生了更改
    if(start!=end){//只要发生了更改和移动，才
        randomNum();//随机生成数
        updateView();//更新界面
    }
}
//仅左移一行的方法: 
function moveLeftInRow(r) {
    //c从0开始，遍历当前r行的每个格
    for(var c=0;c<3;c++){
        //查找c位置右侧，下一个不为0的位置
        //getNextInRow(r,c)是自定义的专门查找当前行右侧下一个不为0的位置的方法
        var nextc=getNextInRow(r,c);
        //如果返回-1，说明右侧，没有数了，则本行左移结束
        if(nextc==-1) break;
        else{//如果找到右侧下一个不为0的数
            //又分两种情况: 
            if(data[r][c]==0){//如果当前格自己是0
                //就将找到的下一个不为0格的值移动到当前格替换
                data[r][c]=data[r][nextc];
                //然后，将nextc位置的格置为0
                data[r][nextc]=0;
                //c要后退一步，来保障下一轮还能再检查一遍
                c--;
            }else if(data[r][c]==data[r][nextc]){
                //否则，如果当前格和找到的下一个格的值相等，说明要合并
                data[r][c]*=2;//将当前格的值先*2
                //游戏规定，发生合并，就+分，分值为合并后的新值
                score+=data[r][c];
                data[r][nextc]=0;//将nextc位置的值置为0
            }
        }
    }
}
//专门查找r行c位置右侧下一个不为0的位置
function getNextInRow(r,c) {
    //c从c+1位置开始,先后遍历
    for(;++c<4;){
        if(data[r][c]!=0)//只要发现r行中下一个c位置的值不为0，就返回c位置
            return c;
    }//如果遍历完，都没有返回，说明没有数了，都是0，就返回-1，说明找不到了
    return -1;
}
