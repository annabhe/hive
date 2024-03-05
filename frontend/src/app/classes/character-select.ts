import Phaser from 'phaser';
import { TokenStorageService } from '../_services/token-storage.service';

export class CharacterSelect extends Phaser.Scene {

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private buttons: Phaser.GameObjects.Image[] = [];
  private selectedButtonIndex: number;


  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  init() {

    this.cursors = this.input.keyboard.createCursorKeys();
    
  }
  preload() {
    // Loading all Faceset images
    this.load.image('BlueNinjaf', './assets/characterFaceset/FacesetBlueNinja.png');
    this.load.image('Inspectorf', './assets/characterFaceset/FacesetInspector.png');
    this.load.image('Cavegirlf', './assets/characterFaceset/FacesetCavegirl.png');
    this.load.image('DarkNinjaf', './assets/characterFaceset/FacesetDarkNinja.png');
    this.load.image('EggGirlf', './assets/characterFaceset/FacesetEggGirl.png');
    this.load.image('Princessf', './assets/characterFaceset/FacesetPrincess.png');
    this.load.image('MaskedNinjaf', './assets/characterFaceset/FacesetMaskedNinja.png');
    this.load.image('MaskFrogf', './assets/characterFaceset/FacesetMaskFrog.png');
    this.load.image('Masterf', './assets/characterFaceset/FacesetMaster.png');
    this.load.image('Noblef', './assets/characterFaceset/FacesetNoble.png');
  }
  create() {
    // Adding images onscreen and adding interactive
    // Also this has a lot of hard coded numbers for placements uhHHHH lol?
    let blueNinjaFaceset = this.add.sprite(this.game.renderer.width * 0.1, this.game.renderer.height * 0.3, 'BlueNinjaf');
    let inspectorFaceset = this.add.image(this.game.renderer.width * 0.3, this.game.renderer.height * 0.3, 'Inspectorf').setInteractive();
    let caveGirlFaceset = this.add.image(this.game.renderer.width * 0.5, this.game.renderer.height * 0.3, 'Cavegirlf').setInteractive();
    let darkNinjaFaceset = this.add.image(this.game.renderer.width * 0.7, this.game.renderer.height * 0.3, 'DarkNinjaf').setInteractive();
    let eggGirlFaceset = this.add.image(this.game.renderer.width * 0.9, this.game.renderer.height * 0.3, 'EggGirlf').setInteractive();
    let princessFaceset = this.add.image(this.game.renderer.width * 0.1, this.game.renderer.height * 0.6, 'Princessf').setInteractive();
    let maskedNinjaFaceset = this.add.image(this.game.renderer.width * 0.3, this.game.renderer.height * 0.6, 'MaskedNinjaf').setInteractive();
    let maskFrogFaceset = this.add.image(this.game.renderer.width * 0.5, this.game.renderer.height * 0.6, 'MaskFrogf').setInteractive();
    let masterFaceset = this.add.image(this.game.renderer.width * 0.7, this.game.renderer.height * 0.6, 'Masterf').setInteractive();
    let nobleFaceset = this.add.image(this.game.renderer.width * 0.9, this.game.renderer.height * 0.6, 'Noblef').setInteractive();

    // Adding text onscreen
    var textConfig = { fontSize: '20px', color: '#ffffff', fontFamily: 'Courier New' };
    this.add.text(this.game.renderer.width * 0.15, this.game.renderer.height * 0.05, "Choose your Player", textConfig).setResolution(5);
    this.add.text(this.game.renderer.width * 0.05, this.game.renderer.height * 0.8, "Press Space to Confirm", textConfig).setResolution(5);

    // Adding buttons to array
    this.buttons.push(blueNinjaFaceset);
    this.buttons.push(inspectorFaceset);
    this.buttons.push(caveGirlFaceset);
    this.buttons.push(darkNinjaFaceset);
    this.buttons.push(eggGirlFaceset);
    this.buttons.push(princessFaceset);
    this.buttons.push(maskedNinjaFaceset);
    this.buttons.push(maskFrogFaceset);
    this.buttons.push(masterFaceset);
    this.buttons.push(nobleFaceset);
    // set all buttons to be grey tinted
    for (var but of this.buttons) {
      but.setTint(0x5c5c5c);
    }
    this.getSelectedIndex();
  }

  getSelectedIndex() {
    const token: TokenStorageService = new TokenStorageService;
    const user = token.getUser().username;

    fetch(`http://localhost:3000/avatar/${user}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((message) => {
        if (message.success) {
          console.log('avatarindex', message.avatar.index)
          this.selectedButtonIndex = message.avatar.index;
          this.selectButton(this.selectedButtonIndex)
          console.log('setindex', this.selectedButtonIndex)
          
        } else {
          this.selectedButtonIndex = 0;
          this.selectButton(this.selectedButtonIndex)
        }
      })

  }

  selectButton(index: number) {
    // current button grey tinted to unselect
    this.buttons[this.selectedButtonIndex].setTint(0x5c5c5c);

    // new button is untinted
    this.buttons[index].setTint(0xffffff);

    // store new selected index
    this.selectedButtonIndex = index
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;
    // wrap around logic
    if (index >= this.buttons.length) { index %= 10 }
    else if (index < 0) { index = (index + 10) % 10 }

    this.selectButton(index);
  }

  confirmSelection() {
    const button = this.buttons[this.selectedButtonIndex];

    //   save selected user in database
    const token: TokenStorageService = new TokenStorageService;
    const user = token.getUser().username;

    const json = JSON.stringify({
      username: user,
      avatarName: button.texture.key.slice(0,-1),
      avatarIndex: this.selectedButtonIndex
    })

    fetch('http://localhost:3000/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw res;
      })
      .then((message) => {
        if (message.success) {
          this.scene.start('PetSelect', { selectedCharacter: button.texture.key.slice(0,-1)});
        } else {
          console.log("Avatar not saved")
        }
      })
      .catch((err) => {
        console.error("err", err)
      })
  }

  update() {
    const rightPressed = Phaser.Input.Keyboard.JustDown(this.cursors.right!)
    const leftPressed = Phaser.Input.Keyboard.JustDown(this.cursors.left!)
    const upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
    const downPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)

    if (rightPressed) {
      this.selectNextButton(1);
    } else if (leftPressed) {
      this.selectNextButton(-1);
    } else if (upPressed) {
      this.selectNextButton(-5);
    } else if (downPressed) {
      this.selectNextButton(5);
    } else if (spacePressed) {
      this.confirmSelection();
    }
  }
}