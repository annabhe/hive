import Phaser from 'phaser';

export class TextBox extends Phaser.Scene {
    text: string;
    redirectLink: string;
    originScene: string;
    constructor() {
      super({ key: 'TextBox' });
    }
    init(data:any){
      this.text = data.text;
      this.redirectLink = data.redirectLink;
      this.originScene = data.originScene;
    }
    preload() {
      this.load.image('textBox', './assets/textBox/DialogueBoxSimple.png');
      this.load.image('noButton', './assets/textBox/NoButton.png');
      this.load.image('yesButton', './assets/textBox/YesButton.png');
      this.load.audio("reject", ['./assets/sounds/Reject.wav']);
    }
    create() {
      // Adding textbox
      let textBox = this.add.image(130, 100, 'textBox');
      textBox.setScale(0.75, 1.2);
  
      // Yes Button
      let yesButton = this.add.image(80, 115, 'yesButton').setScale(1.2);
      yesButton.setInteractive();
      yesButton.on('pointerup', () => {
        // Redirects to page; Closes dialogue box and resumes scene
        this.scene.resume(this.originScene, {buttonPressed: "yes"});
        if (this.redirectLink) {
          window.open(this.redirectLink);
        }
        this.scene.stop('TextBox');
      })
  
      // No Button
      let noButton = this.add.image(170, 115, 'noButton').setScale(1.2);
      noButton.setInteractive();
      noButton.on('pointerup', () => {
        // closes box and resumes scene
        let rejectSound = this.sound.add('reject', {loop: false})
        rejectSound.play();
        this.scene.resume(this.originScene, {buttonPressed: "no"});
        this.scene.stop('TextBox');
      })
  
      // Text to appear in box clearly
      var textConfig={fontSize:'10px', color:'#000000',fontFamily: 'NinjaAdventure'};
      this.add.text(25, 75, this.text, textConfig).setResolution(15);
  
    }
    update() {}
  }