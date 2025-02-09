const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.style.background = "#87ceeb";
canvas.width = window.innerWidth / 2;
canvas.height = 700;

// class Cloud {
//   constructor() {
//     this.x = 170;
//     this.y = 200;
//   }
//   draw() {
//     //first
//     // ctx.beginPath()
//     // ctx.arc(120, 200, 20, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(160, 200, 40, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(200, 200, 20, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     //second
//     // ctx.beginPath()
//     // ctx.arc(360, 200, 40, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(400, 200, 20, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     //third
//     // ctx.beginPath()
//     // ctx.arc(460, 200, 40, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(480, 200, 60, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(510, 200, 20, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     //fourth
//     // ctx.beginPath()
//     // ctx.arc(660, 200, 30, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(680, 200, 40, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     // ctx.beginPath()
//     // ctx.arc(750, 200, 50, 0, Math.PI, true )
//     // ctx.fillStyle = 'white';
//     // ctx.fill();

//     //sixth
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, 20, 0, Math.PI, true);
//     ctx.fillStyle = "white";
//     ctx.fill();

//     ctx.beginPath();
//     ctx.arc(this.x + 60, this.y, 50, 0, Math.PI, true);
//     ctx.fillStyle = "white";
//     ctx.fill();
//   }
//   update() {
//     this.x++;
//     if (this.x > canvas.width) {
//       this.x = -100;
//     } // }else if(this.x < 0 ){
//     //     this.x += (-10 * this.x * this.speed)
//     // }else{
//     //     console.log(this.x, this.speed)
//     //     this.x += this.x * this.speed;
//     // }
//   }
// }



class Obstacle{
  constructor(){
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.w = 40 + (Math.random() * 80)
    this.strength = 100;
  }
  draw(){
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, 20);
    ctx.fillStyle = 'brown';
    ctx.fill()
  }
  update(){
    if(this.x > canvas.width){
      this.x = 0
    }
    this.x += 1
  }
}

class Fuel {
  constructor(){
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.strength = 100;
  }
  draw(){
    ctx.beginPath();
    ctx.rect(this.x, this.y, 30, 90);
    ctx.fillStyle = 'blue';
    ctx.fill()
  }
  update(){

  }
}


class Plane {
  constructor() {
    this.x = 20;
    this.y = canvas.height - 10;
    this.speed = 1;
    this.minSpeed = 0.25;
    this.fuel = 100;
  }
  fire(){
    ctx.beginPath();
    ctx.rect(this.x, this.y, 20, 20);
    ctx.fillStyle = "purple";
    ctx.fill()
  }
  fuelUp(){
    this.fuel += 10;
    if(this.fuel > 100){
        this.fuel = 100
    }
    console.log(this.fuel)
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
    ctx.rect(this.x, this.y, 20, 90);
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

class Game{
  constructor(){
    this.plane = new Plane();
    this.obs = new Obstacle();
    this.fuel = new Fuel();
  }
  draw(){
    this.plane.draw()
    this.obs.draw()
    this.fuel.draw()
  }
  update(){
    this.plane.update()
    this.obs.update()
    this.fuel.update()
  }
}

const game = new Game();


document.addEventListener("keydown", (e) => {
    console.log(e)
  if (e.key === "ArrowDown") {
    game.plane.slowDown();
  } else if (e.key === "ArrowRight") {
    game.plane.steerRight();
  } else if (e.key === "ArrowLeft") {
    game.plane.steerLeft();
  } 
});

document.addEventListener("keyup", (e) => {
  if ((e.key === "ArrowDown")) {
    game.plane.reset();
  }else if( e.key === "r"){
    game.plane.fuelUp()
  }else if( e.key === "f"){
    game.plane.fire()
  }
});



function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.draw()
  game.update()
  requestAnimationFrame(animate);
}

animate();
