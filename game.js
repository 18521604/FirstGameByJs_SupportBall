var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var paddle = {
    width: 100,
    height: 10,
    x: canvas.width/2 - 50,
    y: canvas.height - 30,
    speed: 20,

    //Để paddle move mượt hơn dùng cờ
    isMovingLeft: false,
    isMovingRight: false
};
var ball = {
    x: 600,
    y: 200,
    dx: 5,
    dy: 5,
    radius: 10
};

var brickConfig = {
    offsetX: 20,
    offsetY: 20,
    margin: 20,
    width: 54,
    height: 15,
    totalRow: 3,
    totalCol: 18
};

var BrickList = [];

for(var i = 0; i < brickConfig.totalRow; i++){
    for(var j = 0; j < brickConfig.totalCol; j++){
        BrickList.push({
            x: brickConfig.offsetX + j * (brickConfig.width + brickConfig.margin),
            y: brickConfig.offsetY + i * (brickConfig.height + brickConfig.margin),
            isBroken: false
        });
    }
}

var isGameOver = false;
var isGameWin = false;
var Score = 0;
var MaxScore = brickConfig.totalCol * brickConfig.totalRow;

document.addEventListener("keyup",function(event){
    if(event.keyCode == 37){
        paddle.isMovingLeft = false;
    }
    else if(event.keyCode == 39){
        paddle.isMovingRight = false;
    }
})
document.addEventListener("keydown",function(event){
    if(event.keyCode == 37){
        paddle.isMovingLeft = true;
    }
    else if(event.keyCode == 39){
        paddle.isMovingRight = true;
    }
})

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.strokeStyle = 'red';
    context.fill();
    context.closePath();
}

function drawPandle(){
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle='blue';
    context.fill();
}

// 2*OFFSET + 18*WIDTH + 17*MARGIN
// MARGIN = OFFSET = 20
// ==> WIDTH = 54

function drawBrick(){
    BrickList.forEach(function (b) {
        if(!b.isBroken){
            context.beginPath();
            context.rect(b.x, b.y, brickConfig.width, brickConfig.height);    
            context.fillStyle='green';           
            context.fill();
            context.closePath();  
        }    
    });
}

function handleBallCollidePaddle(){
    if(ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y){
            ball.dy = -ball.dy;
        }
}

function handleBallCollideBounds(){
    if( ball.x < ball.radius || ball.x > canvas.width - ball.radius){
        ball.dx = -ball.dx;
    }
    if( ball.y < ball.radius){
        ball.dy = -ball.dy;
    }
}

function handleBallCollideBricks(){
    BrickList.forEach(function (b){
        if(!b.isBroken){
            if(ball.x >= b.x && ball.x <= b.x + brickConfig.width
                && ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + brickConfig.height){
                ball.dy = -ball.dy;
                b.isBroken = true;
                Score++;
                updateScore();
            }
        }
    });
}

function upadtePaddlePosition(){
    if(paddle.isMovingLeft){
        paddle.x -= paddle.speed;
    }
    else if(paddle.isMovingRight){
        paddle.x += paddle.speed;
    }

    //Giới hạn di chuyển của paddle
    if(paddle.x < 0){
        paddle.x = 0;
    }
    else if(paddle.x > canvas.width - paddle.width){
        paddle.x = canvas.width - paddle.width;
    }
}

function updateBallPosition(){
    ball.x += ball.dx;
    ball.y += ball.dy; 
}

function checkGameOver(){
    if(ball.y > canvas.height - ball.radius){
        isGameOver = true;
    }
}

function HandleGameOver(){
    if(isGameWin){
        alert("YOU WIN");
    }
    else{
        
        alert("CONGRATULATE. Your Score: "+ Score);
    }
}

function updateScore(){
    var eleScore = document.getElementById("numberScore");

    eleScore.innerText = Score;
}

// setInterval(() => {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     //vẽ bóng
//     drawBall();

//     x+=2;
//     y+=2; 
// }, 10);

//Để render mượt hơn thì dùng 1 cách khác
function draw(){
    if(!isGameOver){
        context.clearRect(0, 0, canvas.width, canvas.height);
        //vẽ bóng
        drawBall();

        //vẽ paddle
        drawPandle();

        //Vẽ brick
        drawBrick();

        handleBallCollideBounds();
        handleBallCollidePaddle();
        handleBallCollideBricks();
        updateBallPosition();
        upadtePaddlePosition();

        //Hàm này giúp cho chuyển động mượt hơn(Visual hỗ trợ)
        requestAnimationFrame(draw);

    }
    else{
        HandleGameOver();
    }
}
draw();
