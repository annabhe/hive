import Phaser from 'phaser';

export class DialogueBox extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  text: string;
  character: string;

  constructor() {
    super({ key: 'DialogueBox' });
  }
  init(data:any){
    this.text = data.text;
    this.character = data.character
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  preload() {
    this.load.image('dialogueBox', './assets/textBox/DialogBoxFaceset.png');
    this.load.image('faceSetBernie', './assets/characterFaceset/FacesetBernie.png');
    this.load.image('faceSetWill', './assets/characterFaceset/FacesetWill.png');
    this.load.image('faceSetLori', './assets/characterFaceset/FacesetLori.png');
    this.load.image('faceSetBrent', './assets/characterFaceset/FacesetBrent.png');
  }

  create() {
    // Adding the box
    let dialogueBox = this.add.image(140, 155, 'dialogueBox');
    dialogueBox.setScale(0.8);
    this.add.image(40, 160, `faceSet${this.character}`).setScale(0.8);

    // Text to appear in box clearly
    var dialogueConfig={fontSize:'11px', color:'#000000',fontFamily: 'NinjaAdventure'};
    this.add.text(67, 145, this.text, dialogueConfig).setResolution(15);
    // Character name text
    var characterNameConfig={fontSize:'9px', color:'#000000',fontFamily: 'NinjaAdventure'};
    this.add.text(33, 130, this.character, characterNameConfig).setResolution(15);
  }

  update() {
    // change to character selection if pressed
    const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
    if (spacePressed) {
      this.scene.stop('DialogueBox')
    }
  }
}