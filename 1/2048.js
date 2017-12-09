//定义按id查找元素的简便方法
function $(id) { return document.querySelector(id); }
/****************集中定义游戏所需数据*******************/
var SIZE=500, //canvas大小
    BG="#BBADA0", //canvas背景
    RADIUS=10, //canvas圆角
    cv=$("#cv"), //获得canvas对象
    pen=cv.getContext("2d"), //获得画笔(canvas绘图环境)
    OFFSET=20, //小格边距
    CSIZE=100, //小格大小
    CRADIUS=6, //小格圆角
    GRIDBG="#ccc0b3", //背景小格颜色
    CELLBGS={ //不同数字情况下，前景小格颜色
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
    }
    //准备保存游戏数据的二维数组，游戏启动时，在start方法中初始化其内容
    data=null,
    //为游戏状态起的别名: 1为运行中, 0为结束，用于控制是否继续响应键盘或触摸事件
    RUNNING = 1, GAME_OVER = 0,
    score = 0, //实时存储游戏得分
    state = RUNNING; //保存游戏状态: 启动时，初始化为"运行中"
//启动游戏
function start(){
    //初始化得分为0，状态为运行中
    score=0; state=RUNNING;
    //初始化4x4的二维数组
    data=[];//先创建空数组
    for (var r = 0; r < 4; r++) {
        data[r]=[];//再反复创建每一个空行
        for (var c = 0; c < 4; c++) {
            data[r][c] = 0;//再向每行中添加4个0
        }
    }
    //游戏一开始，需要在两个不重复的位置，生成两个随机数2或4
    randomNum();
    randomNum();
    //阶段成果测试: 控制台中，看到二维数组，且随机位置生成随机2或4
    console.log(data.join("\n"));
}
//页面加载完成后，自动启动游戏
window.onload=start;//强调: canvas首次绘制，必须在window.onload中！！！
//在一个随机空位置生成一个随机2或4的方法
function randomNum() {
    while (true) {//随机位置上如果已经有数占用，则需要再反复挑选另一个空位置
        var c = parseInt(Math.random() * 4);//随机生成列坐标
        var r = parseInt(Math.random() * 4);//随机生成行坐标
        if (data[r][c] == 0) {//如果本次随机位置为0，说明没有数
            //就在数组中本次生成的随机位置随机生成一个2或4
            data[r][c] = Math.random() < 0.5 ? 2 : 4;
            break;//只要成功生成一个数，就退出循环
        }
    }
}