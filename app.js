const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.style.background = "#87ceeb";
canvas.width = window.innerWidth / 2;
canvas.height = 700;

const speedLabel = document.getElementById('speedValue')
const fuelLabel = document.getElementById('fuelValue')



class Obstacle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.w = 40 + Math.random() * 80;
    this.h = 20;
    this.strength = 100;
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = `rgba(50,50,50,${this.strength / 100})`;
    ctx.fill();
  }
  update() {
    if (this.x > canvas.width) {
      this.x = 0;
    }
    this.x += 1;
  }
}

class Fuel {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.w = 30;
    this.h = 90
    this.strength = 100;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("F", this.x + 8, this.y + 22);
    ctx.fillText("U", this.x + 8, this.y + 42);
    ctx.fillText("E", this.x + 8, this.y + 62);
    ctx.fillText("L", this.x + 8, this.y + 82);
    ctx.restore();

  }
  update() {}
}

class Plane {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height - 10;
    this.w = 20;
    this.h = 90
    this.speed = 1;
    this.minSpeed = 0.25;
    this.fuel = 100;
  }
  fuelUp() {
    this.fuel += 10;
    if (this.fuel > 100) {
      this.fuel = 100;
    }
  }
  steerRight() {
    this.x += 10;
  }
  steerLeft() {
    this.x -= 10;
  }
  reset() {
    this.speed = 1;
  }
  slowDown() {
    if (this.speed > this.minSpeed) {
      this.speed -= 0.25;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "orange";
    
    if (this.fuel < 50) {
      ctx.fillStyle = "red";
    } else if (this.fuel < 70) {
      ctx.fillStyle = "orange";
    } else {
      ctx.fillStyle = "green";
    }

    ctx.fill();
  }
  update() {
    if (this.y < 0) {
      this.y = canvas.height;
      this.fuel = 100;
    } else {
      this.y -= this.speed;
      this.fuel -= 0.1;
    }

  }
}

class Laser{
  constructor(x,y){
    this.x = x
    this.y = y
    this.w = 5
    this.h = 10 
    this.velocity = 5;
  }
  isActive(){
    if(this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height){
      return true
    }
    return false
  }
  update(){
    this.y -= this.velocity
  }
  draw(){
    ctx.beginPath()
    ctx.rect(this.x + 5, this.y, this.w, this.h);
    ctx.fillStyle = "red";
    ctx.fill()
  }
}

class Game {
  constructor() {
    this.plane = new Plane();
    this.obs = []
    this.fuel = new Fuel();
    this.gameOver = false;
    this.lasers = [];
    for(let i = 0; i< 5; i++){
      this.obs.push(new Obstacle())
    }

  }
  fire(){
    this.lasers.push(new Laser(this.plane.x, this.plane.y))
  }
  draw() {
    this.plane.draw();
    for(let i = 0; i< this.obs.length; i++){
      this.obs[i].draw()
    }
    this.fuel.draw();
    for(let i = 0; i< this.lasers.length; i++){
      this.lasers[i].draw()
    }
  }
  update() {
    this.plane.update();
    for(let i = 0; i< this.obs.length; i++){
      this.obs[i].update()
    }
    for(let i = 0; i< this.lasers.length; i++){
      this.lasers[i].update()
    }
    this.fuel.update();

    //laser fuel collision
    for(let i = 0; i< this.lasers.length; i++){
      if(
        this.lasers[i].x + this.lasers[i].w >= this.fuel.x &&
        this.lasers[i].x <= this.fuel.x + this.fuel.w &&
        this.lasers[i].y + this.lasers[i].h >= this.fuel.y &&
        this.lasers[i].y <= this.fuel.y + this.fuel.h
      ){
        this.fuel = new Fuel()
      }
    }

     //laser obstacle collision
     for(let i = 0; i< this.lasers.length; i++){
      for(let j = 0; j< this.obs.length; j++){

      if(
        this.obs[j].strength > 0 && 
        this.lasers[i].x + this.lasers[i].w >= this.obs[j].x &&
        this.lasers[i].x <= this.obs[j].x + this.obs[j].w &&
        this.lasers[i].y + this.lasers[i].h >= this.obs[j].y &&
        this.lasers[i].y <= this.obs[j].y + this.obs[j].h
      ){ 
        this.obs[j].strength -= 10;
        console.log(this.obs[j].strength )
      }
    }
    }

    this.lasers = this.lasers.filter(l => {
      return l.isActive()
    })

    if(
      this.plane.x + this.plane.w >= this.fuel.x &&
      this.plane.x <= this.fuel.x + this.fuel.w &&
      this.plane.y + this.plane.h >= this.fuel.y &&
      this.plane.y <= this.fuel.y + this.fuel.h
    ){
      this.plane.fuelUp()
    }
    for(let i = 0; i< this.obs.length; i++){

    if(
      this.obs[i].strength > 0 &&
      this.plane.x + this.plane.w >= this.obs[i].x &&
      this.plane.x <= this.obs[i].x + this.obs[i].w &&
      this.plane.y + this.plane.h >= this.obs[i].y &&
      this.plane.y <= this.obs[i].y + this.obs[i].h
    ){
      this.gameOver = true
      break;
    }
  }
}
}

const game = new Game();

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    game.plane.slowDown();
  } else if (e.key === "ArrowRight") {
    game.plane.steerRight();
  } else if (e.key === "ArrowLeft") {
    game.plane.steerLeft();
  }else if(e.key === ' '){
    game.fire()
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    game.plane.reset();
  } else if (e.key === "r") {
    game.plane.fuelUp();
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(!game.gameOver){
    game.draw();
    game.update();
    fuelLabel.innerHTML = game.plane.fuel
    speedLabel.innerHTML = game.plane.speed
    requestAnimationFrame(animate);
  }else{
    console.log('Game Over')
  }

}

animate();
