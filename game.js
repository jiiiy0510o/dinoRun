var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 300;

var dinoImg = new Image();
dinoImg.src = "/img/dinosaur.png";

var dino = {
  x: 10,
  y: 232,
  width: 40,
  height: 58,
  draw() {
    ctx.drawImage(dinoImg, this.x - 16, this.y - 6, 72, 68);
  },
};

var cactusImg = new Image();
cactusImg.src = "/img/cactus.png";

class Cactus {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 60;
  }
  draw() {
    ctx.drawImage(cactusImg, this.x - 16, this.y, 60, 60);
  }
}

var cloudImg = new Image();
cloudImg.src = "/img/cloud.png";

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 30;
  }
  draw() {
    ctx.drawImage(cloudImg, this.x, this.y, 60, 30);
  }
}

var timer = 0;
var clouds = [];
var cactusss = [];
var jumpTimer = 0;
var animation;
var score = document.querySelector(".score");
var notice = document.querySelector(".notice");

function repeatFrame() {
  //모니터 프레임에 따라 실행횟수가 다름
  animation = requestAnimationFrame(repeatFrame);
  timer++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //점수 표기, 5자리 기준
  score.innerHTML = String(Math.floor(timer / 5)).padStart(5, "0");

  //구름 높이 조절
  var cloudHeight = Math.random() * canvas.height;

  if (timer % 480 == 0 && !(timer % 960 == 0)) {
    var cloud = new Cloud(800, cloudHeight > 200 ? "" : cloudHeight);
    clouds.push(cloud);
  }

  var interval = [240, 400, 520];
  for (i = 0; i < interval.length; i++) {
    if (timer % interval[i] == 0) {
      var cactus = new Cactus(canvas.width, 240);
      cactusss.push(cactus);
    }
  }

  cactusss.forEach((cactus, i, o) => {
    if (cactus.x <= 0) {
      o.splice(i, 1);
    }
    collisionChk(dino, cactus);
    cactus.x = cactus.x - 3;
    cactus.draw();
  });
  clouds.forEach((cloud, i, o) => {
    if (cloud.x <= 0) {
      o.splice(i, 1);
    }
    cloud.x--;
    cloud.draw();
  });

  //점프 false, true 변경
  if (jump == true) {
    dino.y -= 4;
    jumpTimer++;
  }
  if (jump == false) {
    if (dino.y < 232) {
      dino.y += 4;
      jumpTimer = 0;
    }
  }
  if (jumpTimer > 30) {
    jump = false;
  }

  dino.draw();
}

//충돌 확인
function collisionChk(dino, cactus) {
  var minusX = cactus.x - (dino.x + dino.width);
  var minusY = cactus.y - (dino.y + dino.height);

  if (cactus.y !== 0) {
    //아래 선인장
    if (minusX < 0 && minusY < 0) {
      cancelAnimationFrame(animation);
      notice.innerHTML = "- GAME OVER -";
    }
  }
}

//게임시작 멘트 및 종료시 새로시작
notice.addEventListener("click", function () {
  if (notice.innerHTML == "GAME START") {
    notice.innerHTML = "";
    notice.style.border = 0;
    repeatFrame();
  }
  if (notice.innerHTML == "- GAME OVER -") {
    window.location.reload();
  }
});

var jump = false;
document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && dino.y >= 140) {
    jump = true;
  }
});
document.addEventListener("click", function () {
  jump = true;
});
