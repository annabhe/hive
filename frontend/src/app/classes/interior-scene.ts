import { ThrowStmt } from '@angular/compiler';
import Phaser from 'phaser';

export class InteriorScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    bernie: any;
    lori: any;
    will: any;
    brent: any;
    building: string;
    selectedCharacter: string;
    player: any;
    playerMove: [number, number][];


    constructor() {
        super({key: 'InteriorScene'});
    }
    init (data: any) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.selectedCharacter = data.selectedCharacter;
        this.building = data.building;

    }
    preload() {
        this.load.spritesheet('bernie',`./assets/characterSpriteSheets/SpriteSheetBernie.png`, {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('lori',`./assets/characterSpriteSheets/SpriteSheetLori.png`, {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('will',`./assets/characterSpriteSheets/SpriteSheetWill.png`, {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('brent',`./assets/characterSpriteSheets/SpriteSheetBrent.png`, {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('player',`./assets/characterSpriteSheets/SpriteSheet${this.selectedCharacter}.png`, {frameWidth: 16, frameHeight: 16});
        this.load.image("tilesInterior", './assets/TilesetInterior.png');
        this.load.image("tilesInteriorFloor", './assets/TilesetInteriorFloor.png');
        this.load.image("tilesHouse", './assets/TilesetHouse.png');
        this.load.image("tilesElement", './assets/TilesetElement.png');
        this.load.image("tilesMarket", './assets/TilesetMarket.png');
        this.load.tilemapTiledJSON('interiorMap', './assets/interiorMap.json');
    }

    create() {
        // creating map
        let interiorMap = this.make.tilemap({key: "interiorMap"});
        const tilesetInterior = interiorMap.addTilesetImage("TilesetInterior", "tilesInterior");
        const tilesetInteriorFloor = interiorMap.addTilesetImage("TilesetInteriorFloor", "tilesInteriorFloor");
        const tilesetHouse = interiorMap.addTilesetImage("TilesetHouse", "tilesHouse");
        const tilesetElement = interiorMap.addTilesetImage("TilesetElement", "tilesElement");
        const tilesetMarket = interiorMap.addTilesetImage("TilesetMarket", "tilesMarket");

        // creating layers
        let wallLayer = interiorMap.createLayer("walls", tilesetInterior, 0, 0);
        interiorMap.createLayer("floor", tilesetInteriorFloor, 0, 0);
        let buildingLayer = interiorMap.createLayer(`${this.building}`, [tilesetHouse, tilesetElement, tilesetMarket], 0, 0);
        
        // adding sprites
        this.player = this.physics.add.sprite(104, 144, 'player', 1);
        this.playerMove = [[104, 244]];
        
        // adding colliders
        wallLayer.setCollisionByExclusion([-1]);
        buildingLayer.setCollisionByExclusion([-1])
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, buildingLayer);


        // Creating walking animations
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

        // Exit building
        interiorMap.setTileLocationCallback(6, 10, 2, 1, () => {
            this.scene.stop('InteriorScene');
            this.scene.stop('DialogueBox')
            this.scene.resume('MainScene', {buttonpressed: "no"});
        })

        // Office Hours building
        if (this.building === 'officeHours') {
            // Redirect to Zoom link
            interiorMap.setTileLocationCallback(10, 4, 2, 1, () => {
                this.scene.launch('TextBox', {originScene: 'InteriorScene', text: `PRAY     TO     JOIN     OFFICE     HOURS?`});
                this.scene.pause('InteriorScene');
                if (this.playerMove[0][1] < this.playerMove[1][1]) {
                    this.player.y -= 4; 
                } else if (this.playerMove[0][1] > this.playerMove[1][1]){
                    this.player.y += 4;
                }
            })
            // Bullying Bernie
            this.bernie = this.physics.add.sprite(104, 60, 'bernie', 24);   
            this.physics.add.collider(this.player, this.bernie, () => {
                this.scene.launch('DialogueBox', {character: 'Bernie', text: `COOL     COOL`})
            });
            this.physics.add.collider(this.bernie, wallLayer);
            this.bernie.body.collideWorldBounds = true; 
            this.bernie.body.bounce.set(0.5);

            // Brent Sprite
            this.brent = this.physics.add.sprite(216, 130, 'brent', 0); 
            this.brent.body.immovable = true;  
            this.physics.add.collider(this.player, this.brent, () => {
                this.brent.setFrame(1);
                this.scene.launch('DialogueBox', {character: 'Brent', text: `NEVER     STOP     PRACTICING!`})
            });

        // u/CODACLASS building
        } else if (this.building === 'codaClass') {
            // Redirect to Zoom link
            interiorMap.setTileLocationCallback(4, 6, 2, 1, () => {
                this.scene.launch('TextBox', {originScene: 'InteriorScene', text: `ENTER     U/C*DACLASS?`});
                this.scene.pause('InteriorScene');
                // moving left
                if (this.playerMove[0][0] > this.playerMove[1][0]) {
                    this.player.x += 4;
                // moving right
                } else if (this.playerMove[0][0] > this.playerMove[1][0]) {
                    this.player.x -= 4
                } else if (this.playerMove[0][1] < this.playerMove[1][1]) {
                    this.player.y -= 4; 
                } else {
                    this.player.y += 4;
                }
            });

            // Lori Sprite
            this.lori = this.physics.add.sprite(104, 40, 'lori', 0); 
            this.lori.body.immovable = true;  
            this.physics.add.collider(this.player, this.lori, () => {
                this.lori.setFrame(2);
                this.will.setFrame(0) 
                this.scene.launch('DialogueBox', {character: 'Lori', text: `AWW     YEAH~\nHOW     CAN     I     HELP?`})
            });

            // Will Sprite
            this.will = this.physics.add.sprite(136, 40, 'will', 0);
            this.will.body.immovable = true;  
            this.physics.add.collider(this.player, this.will, () => {
                this.will.setFrame(3) 
                this.lori.setFrame(0);
                this.scene.launch('DialogueBox', {character: 'Will', text: `HELLO     HELLO!\nWELCOME     TO     C*DA!`})
            });
        }
    }

    update() {
        const speed = 80;
        this.player.body.setVelocity(0);
  
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
        // normalizing and scaling speeds so not faster along diagonal
        this.player.body.velocity.normalize().scale(speed);
    }

    // Storing player history
    updatePlayerMove(x: number, y: number) {
        this.playerMove.push([x, y]);
        while (this.playerMove.length > 2) {
          this.playerMove.shift();
        }
      }
}