import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import pocket from "./assets/pocket.png";
import star from "./assets/star.png";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    //  this.load.setBaseURL("http://labs.phaser.io");

    //this.load.image("sky", "assets/skies/space3.png");
    //this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("logo", logoImg);
    this.load.image("pocket", pocket);
    this.load.image("star", star);
  }

  create() {
    this.scene.backgroundColor = "blue";

    //generate question
    let question = generateRandom(1000, 9999);
    const text1 = this.add.text(
      50,
      50,
      `Masukkan ke dalam kantong angka ${question}`
    );

    // const buttonRandomize = this.add
    //   .text(650, 50, "Soal Baru kata")
    //   .setInteractive({ useHandCursor: true });
    // buttonRandomize.on("pointerup", () => {
    //   alert("ditekan");
    // });

    //generate pockets
    let pockets = [];
    let pocketInitialPosX = 100;
    let pocketPosInterval = 200;
    var pocketGridPos = [
      {
        x: -50,
        y: -50,
      },
      {
        x: 0,
        y: -50,
      },
      {
        x: 50,
        y: -50,
      },
      {
        x: -50,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
      {
        x: 50,
        y: 0,
      },
      {
        x: -50,
        y: 50,
      },
      {
        x: 0,
        y: 50,
      },
      {
        x: 50,
        y: 50,
      },
    ];
    console.log(pocketGridPos[0].x)
    for (var i = 0; i < 4; i++) {
      let pocket = this.add
        .sprite(pocketInitialPosX, 400, "pocket")
        .setInteractive();
      pocketInitialPosX += pocketPosInterval;
      pockets.push(pocket);
      pocket.input.dropZone = true;
      pocket.setData({
        name: "pocket" + i,
        obj: [],
        correctCount: 0
      });
    }

    //generate stick object
    let strQuestion = question.toString();
    let data = strQuestion.split("");
    let numberOfSpawnedStick = 0;

    for (var i = 0; i < data.length; i++) {
      numberOfSpawnedStick += Number(data[i]);
    }

    let thousandObj = [];
    let initialPosX = 50;
    let initialPosY = 100;
    let maxColumn = 10;
    let currentColCount = 0;
    let incPos = 50;
    for (var i = 0; i < numberOfSpawnedStick; i++) {
      if (currentColCount >= maxColumn) {
        currentColCount = 0;
        initialPosX = 50;
        initialPosY += incPos;
      }
      var thousandObjChild = this.add
        .sprite(initialPosX, initialPosY, "logo")
        .setInteractive().setData({name: "stick" + i});
      initialPosX += incPos;
      currentColCount++;
      thousandObj.push(thousandObjChild);
      this.input.setDraggable(thousandObjChild);
      this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });
    }

    // this.input.setDraggable(banner);
    // this.input.setDraggable(banner2);
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragenter", function (pointer, gameObject, dropZone) {
      dropZone.setTint(0x00ff00);
    });
    this.input.on("dragleave", function (pointer, gameObject, dropZone) {
      dropZone.clearTint();
      dropZone.data.values.obj.pop()
console.log(dropZone.data.values.obj)
      //reorder object
     // let indexGridPos = dropZone.getData("obj").length - 1;
      for(var i = 0; i < dropZone.data.values.obj.length; i++){
        dropZone.data.values.obj[i].x = dropZone.x + pocketGridPos[i].x;
        dropZone.data.values.obj[i].y = dropZone.y + pocketGridPos[i].y;
      }
    });

    this.input.on("drop", function (pointer, gameObject, dropZone) {
      dropZone.data.values.obj.push(gameObject)
      let indexGridPos = dropZone.getData("obj").length - 1;
      gameObject.x = dropZone.x + pocketGridPos[indexGridPos].x;
      gameObject.y = dropZone.y + pocketGridPos[indexGridPos].y;
      dropZone.clearTint();
    });

    // this.add

    // var particles = this.add.particles('red');

    // var emitter = particles.createEmitter({
    //     speed: 100,
    //     scale: { start: 1, end: 0 },
    //     blendMode: 'ADD'
    // });

    // var logo = this.physics.add.image(400, 100, 'logo');

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);
  }
}

const generateRandom = (min, max) => {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
};

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: MyGame,
  backgroundColor: "#4488aa",
};

const game = new Phaser.Game(config);
