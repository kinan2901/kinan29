const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const roomName = document.getElementById("roomName");
const actionText = document.getElementById("actionText");
const message = document.getElementById("message");
const coinsDisplay = document.getElementById("coins");

let coins = 100;

const player = {
  x: 200,
  y: 220,
  speed: 3,
  direction: "down",
  moving: false,
  frame: 0
};

const keys = {};
const touch = { up:false, down:false, left:false, right:false };

let currentRoom = "Living Room";
let nearby = null;
let messageTimer = 0;

const rooms = {
  "Living Room": {
    floor: "#d9b99d",
    objects: [
      {name:"Sofa", x:100, y:110, w:150, h:65, color:"#d88eae", type:"sofa", action:"Kamu duduk santai di sofa 🛋️"},
      {name:"Coffee Table", x:300, y:170, w:95, h:65, color:"#a96f4e", type:"table", action:"Kamu meletakkan minuman di meja ☕"},
      {name:"TV", x:340, y:55, w:90, h:48, color:"#4b454d", type:"tv", action:"Kamu menonton TV 📺"},
      {name:"Plant", x:55, y:245, w:45, h:55, color:"#61946b", type:"plant", action:"Kamu menyiram tanaman 🌱"}
    ]
  },
  "Bedroom": {
    floor: "#dfc4cf",
    objects: [
      {name:"Bed", x:490, y:90, w:190, h:125, color:"#e9a9c5", type:"bed", action:"Kamu beristirahat di kasur 💤"},
      {name:"Wardrobe", x:690, y:65, w:75, h:130, color:"#a87865", type:"wardrobe", action:"Kamu memilih pakaian 👗"},
      {name:"Mirror", x:700, y:230, w:45, h:80, color:"#b7d6d8", type:"mirror", action:"Kamu bercermin ✨"},
      {name:"Rug", x:520, y:245, w:120, h:55, color:"#d78bad", type:"rug", action:"Karpetnya terasa lembut!"}
    ]
  },
  "Kitchen": {
    floor: "#d8c9a9",
    objects: [
      {name:"Kitchen Counter", x:80, y:390, w:210, h:65, color:"#f0e4d8", type:"counter", action:"Kamu menyiapkan makanan 🍳"},
      {name:"Fridge", x:315, y:370, w:65, h:120, color:"#dce5e9", type:"fridge", action:"Kamu membuka kulkas 🥛"},
      {name:"Dining Table", x:100, y:490, w:130, h:65, color:"#a96f4e", type:"table", action:"Kamu makan di meja 🍰"}
    ]
  },
  "Bathroom": {
    floor: "#c6dce0",
    objects: [
      {name:"Bathtub", x:500, y:385, w:180, h:90, color:"#f5f5f5", type:"bath", action:"Kamu berendam santai 🛁"},
      {name:"Sink", x:700, y:400, w:65, h:65, color:"#f5f5f5", type:"sink", action:"Kamu mencuci tangan 💧"},
      {name:"Mirror", x:700, y:490, w:55, h:65, color:"#a8d3d8", type:"mirror", action:"Kamu melihat cermin ✨"}
    ]
  }
};

function say(text) {
  message.textContent = text;
  messageTimer = 180;
}

function drawFloor(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "#ffffff25";
  ctx.lineWidth = 1;

  for (let i=x; i<x+w; i+=40) {
    ctx.beginPath();
    ctx.moveTo(i,y);
    ctx.lineTo(i,y+h);
    ctx.stroke();
  }

  for (let i=y; i<y+h; i+=40) {
    ctx.beginPath();
    ctx.moveTo(x,i);
    ctx.lineTo(x+w,i);
    ctx.stroke();
  }
}

function drawRoom() {
  ctx.clearRect(0,0,800,600);

  // Four rooms
  drawFloor(0,0,398,298,rooms["Living Room"].floor);
  drawFloor(402,0,398,298,rooms["Bedroom"].floor);
  drawFloor(0,302,398,298,rooms["Kitchen"].floor);
  drawFloor(402,302,398,298,rooms["Bathroom"].floor);

  // Outer walls
  ctx.fillStyle = "#8d625c";
  ctx.fillRect(0,0,800,12);
  ctx.fillRect(0,588,800,12);
  ctx.fillRect(0,0,12,600);
  ctx.fillRect(788,0,12,600);

  // Inner walls with door gaps
  ctx.fillRect(395,0,10,210);
  ctx.fillRect(395,270,10,330);
  ctx.fillRect(0,295,180,10);
  ctx.fillRect(240,295,560,10);

  // Room labels
  label("LIVING ROOM", 190,25);
  label("BEDROOM", 600,25);
  label("KITCHEN", 190,330);
  label("BATHROOM", 600,330);

  // Doors
  ctx.fillStyle = "#b98262";
  ctx.fillRect(395,210,10,60);
  ctx.fillRect(180,295,60,10);

  drawObjects();
  drawPlayer();
}

function label(text,x,y) {
  ctx.fillStyle = "#795b5b";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text,x,y);
}

function drawObjects() {
  Object.entries(rooms).forEach(([room,data]) => {
    data.objects.forEach(obj => {
      drawObject(obj);
    });
  });
}

function drawObject(o) {
  const {x,y,w,h,color,type} = o;

  // Soft shadow
  ctx.fillStyle = "#00000018";
  ctx.fillRect(x+5,y+6,w,h);

  if(type === "sofa") {
    ctx.fillStyle = "#b86f91";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = color;
    ctx.fillRect(x+8,y+8,w-16,h-16);
    ctx.fillStyle = "#f7d5e3";
    ctx.fillRect(x+18,y+15,48,30);
    ctx.fillRect(x+78,y+15,48,30);
  }

  else if(type === "bed") {
    ctx.fillStyle = "#a77879";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = color;
    ctx.fillRect(x+8,y+35,w-16,h-43);
    ctx.fillStyle = "#fff4f6";
    ctx.fillRect(x+18,y+8,65,34);
    ctx.fillRect(x+95,y+8,65,34);
    ctx.fillStyle = "#d77fa7";
    ctx.fillRect(x+8,y+60,w-16,12);
  }

  else if(type === "table") {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#d5a47e";
    ctx.fillRect(x+8,y+8,w-16,h-16);
    ctx.fillStyle = "#7c503c";
    ctx.fillRect(x+8,y+h-5,8,12);
    ctx.fillRect(x+w-16,y+h-5,8,12);
  }

  else if(type === "tv") {
    ctx.fillStyle = "#302d36";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#8eb5bd";
    ctx.fillRect(x+7,y+7,w-14,h-14);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x+w/2-3,y+h,6,8);
  }

  else if(type === "plant") {
    ctx.fillStyle = "#9d604b";
    ctx.fillRect(x+8,y+30,w-16,h-30);
    ctx.fillStyle = "#477d58";
    ctx.beginPath();
    ctx.arc(x+22,y+20,18,0,Math.PI*2);
    ctx.arc(x+35,y+15,18,0,Math.PI*2);
    ctx.arc(x+25,y+5,15,0,Math.PI*2);
    ctx.fill();
  }

  else if(type === "wardrobe") {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    ctx.strokeStyle = "#704b40";
    ctx.strokeRect(x+5,y+5,w-10,h-10);
    ctx.beginPath();
    ctx.moveTo(x+w/2,y+5);
    ctx.lineTo(x+w/2,y+h-5);
    ctx.stroke();
    ctx.fillStyle = "#e8c49e";
    ctx.fillRect(x+25,y+60,5,5);
    ctx.fillRect(x+45,y+60,5,5);
  }

  else if(type === "mirror") {
    ctx.fillStyle = "#9c7669";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = color;
    ctx.fillRect(x+5,y+5,w-10,h-10);
    ctx.fillStyle = "#ffffff88";
    ctx.fillRect(x+10,y+10,8,h-20);
  }

  else if(type === "rug") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = "#fff2";
    ctx.stroke();
  }

  else if(type === "counter") {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#c99c83";
    ctx.fillRect(x,y,w,12);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(x+20,y+20,55,30);
    ctx.fillRect(x+120,y+20,55,30);
  }

  else if(type === "fridge") {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
    ctx.strokeStyle = "#9baeb4";
    ctx.strokeRect(x+5,y+5,w-10,h-10);
    ctx.fillRect(x+52,y+20,3,30);
    ctx.fillRect(x+52,y+65,3,30);
  }

  else if(type === "bath") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#a6d7dc";
    ctx.fillRect(x+12,y+12,w-24,h-24);
    ctx.strokeStyle = "#9abdc2";
    ctx.strokeRect(x+12,y+12,w-24,h-24);
  }

  else if(type === "sink") {
    ctx.fillStyle = "#eee";
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#a8d6dc";
    ctx.beginPath();
    ctx.ellipse(x+w/2,y+h/2,22,18,0,0,Math.PI*2);
    ctx.fill();
  }

  ctx.fillStyle = "#684d4b";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(o.name,x+w/2,y+h+13);
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;

  // Shadow
  ctx.fillStyle = "#00000030";
  ctx.beginPath();
  ctx.ellipse(x,y+12,13,7,0,0,Math.PI*2);
  ctx.fill();

  // Legs
  ctx.fillStyle = "#f2c6a8";
  ctx.fillRect(x-7,y+3,5,12);
  ctx.fillRect(x+3,y+3,5,12);

  // Shoes
  ctx.fillStyle = "#76505e";
  ctx.fillRect(x-9,y+12,7,4);
  ctx.fillRect(x+3,y+12,7,4);

  // Body
  ctx.fillStyle = "#e78db2";
  ctx.fillRect(x-10,y-12,20,18);

  // Head
  ctx.fillStyle = "#f4c5a6";
  ctx.beginPath();
  ctx.arc(x,y-19,10,0,Math.PI*2);
  ctx.fill();

  // Hair
  ctx.fillStyle = "#65402f";
  ctx.beginPath();
  ctx.arc(x,y-23,11,Math.PI,Math.PI*2);
  ctx.fill();
  ctx.fillRect(x-10,y-24,4,13);
  ctx.fillRect(x+6,y-24,4,13);

  // Face direction
  ctx.fillStyle = "#49332f";
  if(player.direction === "down") {
    ctx.fillRect(x-4,y-19,2,2);
    ctx.fillRect(x+3,y-19,2,2);
  } else if(player.direction === "left") {
    ctx.fillRect(x-6,y-19,2,2);
  } else if(player.direction === "right") {
    ctx.fillRect(x+4,y-19,2,2);
  }
}

function getCurrentRoom(x,y) {
  if(x < 395 && y < 295) return "Living Room";
  if(x >= 405 && y < 295) return "Bedroom";
  if(x < 395 && y >= 305) return "Kitchen";
  if(x >= 405 && y >= 305) return "Bathroom";
  return currentRoom;
}

function movePlayer() {
  let dx = 0;
  let dy = 0;

  if(keys["ArrowUp"] || keys["w"] || touch.up) dy--;
  if(keys["ArrowDown"] || keys["s"] || touch.down) dy++;
  if(keys["ArrowLeft"] || keys["a"] || touch.left) dx--;
  if(keys["ArrowRight"] || keys["d"] || touch.right) dx++;

  player.moving = dx !== 0 || dy !== 0;

  if(player.moving) {
    const length = Math.sqrt(dx*dx+dy*dy);
    dx /= length;
    dy /= length;

    player.x += dx * player.speed;
    player.y += dy * player.speed;

    if(Math.abs(dx) > Math.abs(dy)) {
      player.direction = dx > 0 ? "right" : "left";
    } else {
      player.direction = dy > 0 ? "down" : "up";
    }

    player.frame += 0.15;
  }

  // Keep player inside the house
  player.x = Math.max(25,Math.min(775,player.x));
  player.y = Math.max(35,Math.min(565,player.y));

  // Door passages
  if(player.x > 390 && player.x < 410 && !(player.y > 205 && player.y < 275)) {
    player.x = player.x < 400 ? 388 : 412;
  }

  if(player.y > 290 && player.y < 310 && !(player.x > 175 && player.x < 245)) {
    player.y = player.y < 300 ? 288 : 312;
  }

  const newRoom = getCurrentRoom(player.x,player.y);

  if(newRoom !== currentRoom) {
    currentRoom = newRoom;
    roomName.textContent = currentRoom;
    say("You entered the " + currentRoom + " ♡");
  }
}

function findNearby() {
  nearby = null;
  let bestDistance = 65;

  rooms[currentRoom].objects.forEach(obj => {
    const ox = obj.x + obj.w/2;
    const oy = obj.y + obj.h/2;
    const distance = Math.hypot(player.x-ox,player.y-oy);

    if(distance < bestDistance) {
      bestDistance = distance;
      nearby = obj;
    }
  });

  if(nearby) {
    actionText.textContent = "Dekati: " + nearby.name;
  } else {
    actionText.textContent = "Explore your house!";
  }
}

function interact() {
  if(nearby) {
    say(nearby.action);
    coins += 5;
    coinsDisplay.textContent = coins;
  } else {
    say("Jalan mendekati perabot dulu ya! ♡");
  }
}

document.getElementById("interact").addEventListener("click",interact);

document.querySelectorAll("[data-dir]").forEach(button => {
  const dir = button.dataset.dir;

  button.addEventListener("pointerdown",e => {
    e.preventDefault();
    touch[dir] = true;
  });

  ["pointerup","pointerleave","pointercancel"].forEach(eventName => {
    button.addEventListener(eventName,() => touch[dir] = false);
  });
});

window.addEventListener("keydown",e => {
  keys[e.key] = true;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
    e.preventDefault();
  }
  if(e.key === " " || e.key === "Enter") interact();
});

window.addEventListener("keyup",e => {
  keys[e.key] = false;
});

function gameLoop() {
  movePlayer();
  findNearby();
  drawRoom();

  if(messageTimer > 0) {
    messageTimer--;
  } else {
    message.textContent = nearby
      ? "Press INTERACT to use " + nearby.name
      : "Welcome home! ♡";
  }

  requestAnimationFrame(gameLoop);
}

roomName.textContent = currentRoom;
gameLoop();