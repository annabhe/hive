import Phaser from 'phaser';
import { TokenStorageService } from '../_services/token-storage.service';

export class TitleScreen extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    blueNinja: any;
    caveGirl: any;
    darkNinja: any;
    eggGirl: any;
    inspector: any;
    maskedNinja: any;
    maskFrog: any;
    master: any;
    noble: any;
    princess: any;
    theme: any;

    // for socket
    socket: any

    constructor() {
      super({key: 'TitleScene'});
    }
    init () {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    preload() {
      // loading spritesheets for animation
      this.load.spritesheet('blueNinja',`./assets/characterSpriteSheets/SpriteSheetBlueNinja.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('caveGirl',`./assets/characterSpriteSheets/SpriteSheetCavegirl.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('darkNinja',`./assets/characterSpriteSheets/SpriteSheetDarkNinja.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('eggGirl',`./assets/characterSpriteSheets/SpriteSheetEggGirl.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('inspector',`./assets/characterSpriteSheets/SpriteSheetInspector.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('maskedNinja',`./assets/characterSpriteSheets/SpriteSheetMaskedNinja.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('maskFrog',`./assets/characterSpriteSheets/SpriteSheetMaskFrog.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('master',`./assets/characterSpriteSheets/SpriteSheetMaster.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('noble',`./assets/characterSpriteSheets/SpriteSheetNoble.png`, {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('princess',`./assets/characterSpriteSheets/SpriteSheetPrincess.png`, {frameWidth: 16, frameHeight: 16});

      // loading tilesets
      this.load.image("tilesFloor", './assets/TilesetFloor.png');
      this.load.image("tilesHouse", './assets/TilesetHouse.png');
      this.load.image("tilesDetail", './assets/TilesetFloorDetail.png');
      this.load.image("tilesFont", './assets/font24x30.png')
      this.load.tilemapTiledJSON('titleMap', './assets/titleScreen.json');

      // Loading Music
      this.load.audio("titleTheme", ['./assets/sounds/TitleTheme.ogg']);
    }
    create () {

      // creating map
      let titleMap = this.make.tilemap({key: "titleMap"});
      const tilesetFloor = titleMap.addTilesetImage("TilesetFloor", "tilesFloor");
      const tilesetHouse = titleMap.addTilesetImage("TilesetHouse", "tilesHouse");
      const tilesetDetail = titleMap.addTilesetImage("TilesetFloorDetail", "tilesDetail");
      const font = titleMap.addTilesetImage("font24x30", "tilesFont");
  
      // creating layers
      titleMap.createLayer("background", tilesetFloor, 0, 0);
      titleMap.createLayer("statues", [tilesetHouse, tilesetDetail], 0, 0);
      titleMap.createLayer("Lettering", font, 0, 0);
  
      // font at bottom
      var textConfig={fontSize:'20px',color:'#ffffff',fontFamily: 'Courier New'};
      this.add.text(this.game.renderer.width * 0.08 , this.game.renderer.height * 0.85, "Press Space to start", textConfig).setResolution(5);
  
      // adding players
      this.blueNinja = this.physics.add.sprite(72, 104, 'blueNinja', 0);
      this.anims.create(this.titleAnim('blueNinja'));

      this.caveGirl = this.physics.add.sprite(104, 104, 'caveGirl', 0);
      this.anims.create(this.titleAnim('caveGirl'));

      this.darkNinja = this.physics.add.sprite(136, 104, 'darkNinja', 0);
      this.anims.create(this.titleAnim('darkNinja'));

      this.eggGirl = this.physics.add.sprite(168, 104, 'eggGirl', 0);
      this.anims.create(this.titleAnim('eggGirl'));

      this.inspector = this.physics.add.sprite(200, 104, 'inspector', 0);
      this.anims.create(this.titleAnim('inspector'));

      this.maskedNinja = this.physics.add.sprite(88, 120, 'maskedNinja', 0);
      this.anims.create(this.titleAnim('maskedNinja'));

      this.maskFrog = this.physics.add.sprite(120, 120, 'maskFrog', 0);
      this.anims.create(this.titleAnim('maskFrog'));

      this.master = this.physics.add.sprite(152, 120, 'master', 0);
      this.anims.create(this.titleAnim('master'));

      this.noble = this.physics.add.sprite(184, 120, 'noble', 0);
      this.anims.create(this.titleAnim('noble'));

      this.princess = this.physics.add.sprite(216, 120, 'princess', 0);
      this.anims.create(this.titleAnim('princess'));

      // Timer to trigger animation 
      this.time.addEvent({
        callback: this.animate,
        callbackScope: this,
        delay: 500, // in ms; 1000 = 1s
        loop: true
      })

      // adding music
      this.theme = this.sound.add('titleTheme', {loop: true, volume: 0.1})
      this.theme.play();
    }

    // Playing animations for each character
    animate() {
      this.blueNinja.anims.play('blueNinja', true)
      this.caveGirl.anims.play('caveGirl', true)
      this.darkNinja.anims.play('darkNinja', true)
      this.eggGirl.anims.play('eggGirl', true)
      this.inspector.anims.play('inspector', true)
      this.maskedNinja.anims.play('maskedNinja', true)
      this.maskFrog.anims.play('maskFrog', true)
      this.master.anims.play('master', true)
      this.noble.anims.play('noble', true)
      this.princess.anims.play('princess', true)
    }
  
    // creating the animation
    titleAnim(player: string) {
      return {
        key: player,
        frames: this.anims.generateFrameNumbers(player, {frames: [16, 0, 20, 0, 25, 0, 26, 0, 27, 0]}),
        frameRate: 1,
        repeat: -1
      }
    }

  update() {
    // change to character selection if pressed
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
    if (spacePressed) {

      // check if is new user
      const token: TokenStorageService = new TokenStorageService;
      const user = token.getUser().username;

      // Check if user has existing avatar
      fetch(`http://localhost:3000/avatar/${user}`)
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          throw res;
        })
        .then((message) => {
          // Stop music once leave main scene
          this.theme.stop();
          if (message.success) {
            // Check if pets exist
            fetch(`http://localhost:3000/pet/${user}`)
              .then((res) => {
                if (res.ok) {
                  return res.json()
                }
                throw res;
              })
              .then((petMsg) => {
                if (petMsg.success) {
                  this.scene.start('MainScene', {selectedCharacter: message.avatar.name, selectedPet: petMsg.pet.name});
                } else {
                  this.scene.start('CharacterSelectScene');
                }
              })
          } else {
            // Character does not exist
            this.scene.start('CharacterSelectScene');
          }
        })
    }
  }
}