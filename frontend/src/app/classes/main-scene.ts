import Phaser from 'phaser';
import { io } from 'socket.io-client';

export class MainScene extends Phaser.Scene {
  map: any;
  buildingsLayer: any
  aboveBuildingLayer: any
  treeLayer: any;

  selectedCharacter: string;
  player: any;
  playerMove: [number, number][];
  selectedPet: string;
  pet: any;
  sparkles: any;

  cursors: any;
  theme: any;

  socket: any;
  otherPlayers: any;

  constructor() {
    super({ key: 'MainScene' });
  }
  init(data: any) {
    this.selectedCharacter = data.selectedCharacter;
    this.selectedPet = data.selectedPet;
    this.socket = data.socket;

  }
  preload() {
    this.load.image("tilesFloor", './assets/TilesetFloor.png');
    this.load.image("tilesHouse", './assets/TilesetHouse.png');
    this.load.image("tilesNature", './assets/TilesetNature.png');
    this.load.image("tilesDetail", './assets/TilesetFloorDetail.png');
    this.load.tilemapTiledJSON('map', './assets/hiveMapDraft1.json');
    this.load.spritesheet("sparkles", './assets/SpriteSheetSpark.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('pet', ./assets/petSpriteSheets/${this.selectedPet}.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player', ./assets/characterSpriteSheets/SpriteSheet${this.selectedCharacter}.png, { frameWidth: 16, frameHeight: 16 });
    this.load.audio("mainTheme", ['./assets/sounds/MainTheme.ogg']);
    this.load.audio("praySound", ['./assets/sounds/Magic3.wav']);

    // load sprite for socket
    this.load.spritesheet('BlueNinja', ./assets/characterSpriteSheets/SpriteSheetBlueNinja.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('Cavegirl', ./assets/characterSpriteSheets/SpriteSheetCavegirl.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('DarkNinja', ./assets/characterSpriteSheets/SpriteSheetDarkNinja.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('EggGirl', ./assets/characterSpriteSheets/SpriteSheetEggGirl.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('Inspector', ./assets/characterSpriteSheets/SpriteSheetInspector.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('MaskedNinja', ./assets/characterSpriteSheets/SpriteSheetMaskedNinja.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('MaskFrog', ./assets/characterSpriteSheets/SpriteSheetMaskFrog.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('Master', ./assets/characterSpriteSheets/SpriteSheetMaster.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('Noble', ./assets/characterSpriteSheets/SpriteSheetNoble.png, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('Princess', ./assets/characterSpriteSheets/SpriteSheetPrincess.png, { frameWidth: 16, frameHeight: 16 });
  }

  // function that adds playersprites from sockets
  private addOtherPlayers(self: any, playerInfo: any) {
    // add sprite
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, ${playerInfo.avatar})
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
  }

  create() {
    // create the map
    let map = this.make.tilemap({ key: "map" });
    const tilesetFloor = map.addTilesetImage("TilesetFloor", "tilesFloor");
    const tilesetHouse = map.addTilesetImage("TilesetHouse", "tilesHouse");
    const tilesetNature = map.addTilesetImage("TilesetNature", "tilesNature");
    const tilesetDetail = map.addTilesetImage("TilesetFloorDetail", "tilesDetail");

    // create players
    let self = this;
    this.otherPlayers = this.physics.add.group();

    // socket
    this.socket = io('http://localhost:3000', {
      query: {
        avatar: this.selectedCharacter
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected!');
    });

    this.socket.on('currentPlayers', (players: any) => {
      Object.keys(players).forEach((id) => {
        if (players[id].playerId === self.socket.id) {
        } else {
          this.addOtherPlayers(self, players[id]);
        }
      })
    })
    this.socket.on('newPlayer', (playerInfo: any) => {
      this.addOtherPlayers(self, playerInfo);
    })

    // destroying players when they disconnect
    this.socket.on('destroy', (playerId: any) => {
      this.otherPlayers.getChildren().forEach((otherPlayer: any) => {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      })
    })

    // moving socket players and changing frames
    this.socket.on('playerMoved', (playerInfo: any) => {
      self.otherPlayers.getChildren().forEach((otherPlayer: any) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          if (otherPlayer.x > playerInfo.x) {
            otherPlayer.setFrame(2);
          }
          // moving right 
          else if (otherPlayer.x < playerInfo.x) {
            otherPlayer.setFrame(3);
          }
          // next has less y means moving up
          else if (otherPlayer.y > playerInfo.y) {
            otherPlayer.setFrame(1);
          }
          // moving down
          else {
            otherPlayer.setFrame(0);
          }
          otherPlayer.setPosition(playerInfo.x, playerInfo.y)
        }
      })
    })

    // creating layers
    // BelowLayer (ie playe walks over this)
    const groundLayer = map.createLayer("ground2", tilesetFloor, 0, 0);
    const flowerLayer = map.createLayer("flowers", [tilesetNature, tilesetDetail], 0, 0)

    // Same layer (ie collidable with user)
    this.buildingsLayer = map.createLayer("buildings", tilesetHouse, 0, 0);
    this.treeLayer = map.createLayer("trees", tilesetNature, 0, 0);
    // adding player and pet (sameLayer)
    this.playerMove = [[248, 472]];
    this.pet = this.physics.add.sprite(248, 496, 'pet', 1);
    this.pet.setScale(0.8)
    this.player = this.physics.add.sprite(248, 472, 'player');
    // Above Layer (ie player walks behind this)
    this.aboveBuildingLayer = map.createLayer("aboveBuilding", [tilesetHouse, tilesetNature], 0, 0);

    // making tiles in layers collidable
    this.buildingsLayer.setCollisionByProperty({ collides: true });
    this.treeLayer.setCollisionByProperty({ collides: true });

    // adding collider
    this.physics.add.collider(this.player, this.buildingsLayer);
    this.physics.add.collider(this.player, this.treeLayer);

    // adding sparkles animation (for good vibes later)
    this.sparkles = this.add.sprite(240, 96, 'sparkles')
    this.anims.create({
      key: 'sparkle',
      frames: this.anims.generateFrameNumbers('sparkles', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: 2
    });

    // adding music
    this.theme = this.sound.add('mainTheme', { loop: true, volume: 0.1 })
    this.theme.play();
    let praySound = this.sound.add('praySound', { loop: false, volume: 0.2 })

    // Adding tile location callbacks Parameters are : x, y, width, height, callback
    //Lecture Recording
    map.setTileLocationCallback(18, 25, 2, 1, () => {
      this.launchTextBox('MainScene', `PRAY     FOR     LECTURE    RECORDINGS?`, "");
    }, this, this.buildingsLayer);
    // Good Vibes
    map.setTileLocationCallback(14, 7, 2, 1, () => {
      let vibeCount = 0;
      this.events.on('resume', (scene: string, data: any) => {
        vibeCount++;
        if (data.buttonPressed == "yes" && vibeCount === 1) {
          praySound.play();
          this.sparkles.anims.play('sparkle', true);
          this.events.removeListener('resume');
        }
        vibeCount = 0;
      });
      this.launchTextBox('MainScene', `PRAY     FOR     GOOD     VIBES?`);
    }, this, this.buildingsLayer);
    // Parking Lot
    map.setTileLocationCallback(15, 11, 2, 1, () => {
      this.launchTextBox('MainScene', `ENTER     PARKING     LOT?`, "");
    }, this, this.buildingsLayer);
    // CODA Classroom
    map.setTileLocationCallback(15, 23, 1, 1, () => {
      this.player.y += 4;
      this.scene.pause('MainScene');
      this.scene.launch('InteriorScene', { selectedCharacter: this.selectedCharacter, building: 'codaClass' })
      // pause user input on Mainscene
      this.input.keyboard.removeAllKeys();
      this.events.on('resume', (scene: string, data: any) => {
        this.cursors = this.input.keyboard.createCursorKeys();
      });
      this.player.setFrame(0);
    }, this, this.buildingsLayer);
    // Office Hours
    map.setTileLocationCallback(10, 12, 1, 1, () => {
      this.player.y += 4;
      this.scene.pause('MainScene');
      this.scene.launch('InteriorScene', { selectedCharacter: this.selectedCharacter, building: 'officeHours' })
      this.input.keyboard.removeAllKeys();
      this.events.on('resume', (scene: string, data: any) => {
        this.cursors = this.input.keyboard.createCursorKeys();
      });
      this.player.setFrame(0);
    }, this, this.buildingsLayer);
    // Google Classroom
    map.setTileLocationCallback(18, 7, 1, 1, () => {
      this.launchTextBox('MainScene', `VIEW     GOOGLE     CLASSROOM?`, "");
    }, this, this.buildingsLayer);
    // CODA Syllabus
    map.setTileLocationCallback(10, 7, 1, 1, () => {
      this.launchTextBox('MainScene', `VIEW     SYLLABUS?`, "");
    }, this, this.buildingsLayer);
    // One Learn
    map.setTileLocationCallback(6, 19, 1, 1, () => {
      this.launchTextBox('MainScene', `VIEW     LEARN?`, "");
      this.player.y += 4;
      this.scene.pause('MainScene');
    }, this, this.buildingsLayer);
    // WorkDay
    map.setTileLocationCallback(3, 19, 1, 1, () => {
      this.launchTextBox('MainScene', `VIEW     WORKDAY?`, "");
    }, this, this.buildingsLayer);
    // Pulse
    map.setTileLocationCallback(4, 24, 1, 1, () => {
      this.launchTextBox('MainScene', `VIEW     ?`, "");
    }, this, this.buildingsLayer);


    // cameras
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // allowing user input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Walking animation
    // Uses frames from spritesheet array at 10 frames/second; repeat: -1 to loop
    this.anims.create({
      key: 'leftWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 6, 10, 14] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'rightWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [3, 7, 11, 15] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'downWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 4, 8, 12] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'upWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 5, 9, 13] }),
      frameRate: 10,
      repeat: -1
    });

    // don't go outside of map
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
  };

  // Textbox that is launched after colliding
  launchTextBox(originScene: string, text: string, redirectLink?: string) {
    this.scene.launch('TextBox', { originScene: originScene, text: text, redirectLink: redirectLink });
    // Push player away from hitbox depending on which direction it approached
    // moving left
    let lastMove = this.playerMove.length - 1
    if (this.playerMove[lastMove - 1][0] > this.playerMove[lastMove][0]) {
      this.player.x += 4;
      // moving right
    } else if (this.playerMove[lastMove-1][0] > this.playerMove[lastMove][0]) {
      this.player.x -= 4
    } else if (this.playerMove[lastMove-1][1] < this.playerMove[lastMove][1]) {
      this.player.y -= 4;
    } else if (this.playerMove[lastMove-1][1] > this.playerMove[lastMove][1]){
      this.player.y += 4;
    }
    this.scene.pause('MainScene');
  }

  update() {
    // console.log("touch", this.player.body.touching);
    const speed = 80;
    this.player.body.setVelocity(0);

    // send to socket
    this.socket.emit('playerMovement', {
      x: this.player.x,
      y: this.player.y
    })

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play('leftWalk', true);
      this.updatePlayerMove(this.player.x, this.player.y);
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play('rightWalk', true);
      this.updatePlayerMove(this.player.x, this.player.y);
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed)
      this.player.anims.play('downWalk', true);
      this.updatePlayerMove(this.player.x, this.player.y);
    }
    else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.anims.play('upWalk', true);
      this.updatePlayerMove(this.player.x, this.player.y);
    }
    else {
      this.player.anims.stop();
    }

    //Pet moves in history; +2 in y to center pet bc it is scaled down
    this.pet.x = this.playerMove[0][0];
    this.pet.y = this.playerMove[0][1] + 2;

    //move left is -x; move up is -y
    // [0][0] is x; [0][1] is y
    if (this.playerMove.length > 1) {
      // next position ([1][0]) has less x than current position ([0][0]) meaning moving left
      if (this.playerMove[0][0] > this.playerMove[1][0]) {
        this.pet.setFrame(2);
      }
      // moving right 
      else if (this.playerMove[0][0] < this.playerMove[1][0]) {
        this.pet.setFrame(3);
      }
      // next has less y means moving up
      else if (this.playerMove[0][1] > this.playerMove[1][1]) {
        this.pet.setFrame(1);
      }
      // moving down
      else {
        this.pet.setFrame(0);
      }
    }

    // normalizing and scaling speeds so not faster along diagonal
    this.player.body.velocity.normalize().scale(speed);
  }

  // Storing player history
  updatePlayerMove(x: number, y: number) {
    this.playerMove.push([x, y]);
    while (this.playerMove.length > 10) {
      this.playerMove.shift();
    }

  }

}