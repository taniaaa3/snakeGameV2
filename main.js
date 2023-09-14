//Game Constants

let dir = { x: 0, y: 0 };
const foodSound = new Audio('./sounds/food.mp3');
const gameOver = new Audio('./sounds/gameOver.mp3');
const move = new Audio('./sounds/move.mp3');
const music = new Audio('./sounds/music.mp3');
let lastPaintTime = 0;
let speed = 5;
let snake = [{ x: 13, y: 15 }];
const board = document.querySelector('.board');
let food = { x: 6, y: 7 };
let score = 0;
let scoreBox = document.querySelector('.scoreBox');
let highScoreBox = document.querySelector('.highScore')
let highScoreVal;
const child = document.querySelector('.child');
let snakeChild = [{x: 2, y: 3}];


//Game Functions

const main = (curTime) => {
    window.requestAnimationFrame(main);
    if ((curTime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = curTime;
    gameEngine();
}

const collapse = (snakeArr)=>{
        //When snake bumps into itself
        for (let i = 1; i < snakeArr.length; i++) {
            if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y){
                return true;
            }
        }
        //When snake bumps into the wall
            if(snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0){
                    return true;
            }
            
}

const gameEngine = () => {

    //Updating the Snake
    if(collapse(snake)){
        gameOver.play();
        music.pause();
        dir = {x: 0, y: 0};
        alert('Game Over :( Press any key to play again.');
        snake = [{x: 13, y: 15}];
        snakeChild = [{x: 2, y: 3}];
        music.play();
        score = 0;
        scoreBox.innerHTML = `Score: ${score}`
    }

    //If snake has eaten the food, increasing the score & regenerating the food
    if(snake[0].y === food.y && snake[0].x === food.x){
        foodSound.play();
        score += 1;
        if(score>highScoreVal){
            highScoreVal = score 
            localStorage.setItem('highScore', highScoreVal);
            highScoreBox.innerHTML = `High Score : ${highScoreVal}`;
        }
        if(score>5){
            speed = 7;
        }
        else if(score>15){
            speed = 10;
        }
        else if(score > 25){
            speed = 15
        }
        scoreBox.innerHTML = `Score: ${score}`
        snake.unshift({x: snake[0].x + dir.x , y: snake[0].y + dir.y});
        snakeChild.unshift({x: snakeChild[0].x + 1 , y: snakeChild[0].y });

        //Generating food
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    //Moving Snake
    for (let i = snake.length - 2; i >= 0 ; i--) {
        snake[i+1] = {...snake[i]};
    }
    snake[0].x += dir.x;
    snake[0].y += dir.y;
    //Displaying Snake
    board.innerHTML = '';
    snake.forEach((val, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = val.y;
        snakeElement.style.gridColumnStart = val.x;
        if (index == 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement); 
        
    })


    //Displaying Food
    let FoodElement = document.createElement('div');
    FoodElement.style.gridRowStart = food.y;
    FoodElement.style.gridColumnStart = food.x;
    FoodElement.classList.add('food');
    board.appendChild(FoodElement);

        //Displaying Child Snake
        child.innerHTML = ''
        snakeChild.forEach((val, index) => {
            let element = document.createElement('div');
            element.style.gridRowStart = val.y;
            element.style.gridColumnStart = val.x;
            if(index == 0){
                element.classList.add('childHead');
            }
            else{
                element.classList.add('snake2');
            }
            child.appendChild(element);
        })


}







//Game Logic
let highScore = localStorage.getItem('highScore');
if(highScore === null){
    localStorage.setItem('highScore',JSON.stringify(0));
}
else{
    highScoreVal = JSON.parse(localStorage.getItem('highScore')); 
    highScoreBox.innerHTML = `High Score : ${highScoreVal}`;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
    dir = { x: 0, y: 1 } //Starting the game
    music.play();
    move.play();
    switch (e.key) {
        case 'ArrowUp':
            dir.x = 0;
            dir.y = -1;
            break;

        case 'ArrowDown':
            dir.x = 0;
            dir.y = 1;
            break;

        case 'ArrowLeft':
            dir.x = -1;
            dir.y = 0;
            break;

        case 'ArrowRight':
            dir.x = 1;
            dir.y = 0;
            break;

        default:
            break;
    }
})