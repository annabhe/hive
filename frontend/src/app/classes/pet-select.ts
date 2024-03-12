import Phaser from 'phaser';
import { TokenStorageService } from '../_services/token-storage.service';

export class PetSelect extends Phaser.Scene{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private buttons: Phaser.GameObjects.Image[] = [];
    private selectedButtonIndex:number;
    private NUMSPRITES:number = 8;
    selectedCharacter: string;

    constructor() {
        super({ key: 'PetSelect' });
    }

    init(data: any) {
        this.selectedCharacter = data.selectedCharacter;
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        // Loading all Faceset images
        this.load.spritesheet('Cyclope', './assets/petSpriteSheets/Cyclope.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Flame', './assets/petSpriteSheets/Flame.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Mole', './assets/petSpriteSheets/Mole.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Mouse', './assets/petSpriteSheets/Mouse.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Octopus', './assets/petSpriteSheets/Octopus.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Slime', './assets/petSpriteSheets/Slime.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Snake', './assets/petSpriteSheets/Snake.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('Mushroom', './assets/petSpriteSheets/Mushroom.png', {frameWidth: 16, frameHeight: 16});
    }

    create() {
        // Adding all avaible pets
        let cyclopeSprite = this.add.sprite(this.game.renderer.width * 0.2, this.game.renderer.height * 0.3, 'Cyclope', 0).setScale(2).setInteractive();
        let flameSprite = this.add.sprite(this.game.renderer.width * 0.4, this.game.renderer.height * 0.3, 'Flame', 0).setScale(2).setInteractive();
        let moleSprite = this.add.sprite(this.game.renderer.width * 0.6, this.game.renderer.height * 0.3, 'Mole', 0).setScale(2).setInteractive();
        let mouseSprite = this.add.sprite(this.game.renderer.width * 0.8, this.game.renderer.height * 0.3, 'Mouse', 0).setScale(2).setInteractive();
        let octopusSprite = this.add.sprite(this.game.renderer.width * 0.2, this.game.renderer.height * 0.6, 'Octopus', 0).setScale(2).setInteractive();
        let slimeSprite = this.add.sprite(this.game.renderer.width * 0.4, this.game.renderer.height * 0.6, 'Slime', 0).setScale(2).setInteractive();
        let snakeSprite = this.add.sprite(this.game.renderer.width * 0.6, this.game.renderer.height * 0.6, 'Snake', 0).setScale(2).setInteractive();
        let mushroomSprite = this.add.sprite(this.game.renderer.width * 0.8, this.game.renderer.height * 0.6, 'Mushroom', 0).setScale(2).setInteractive();
    
        // Adding text onscreen
        var textConfig = { fontSize: '20px', color: '#ffffff', fontFamily: 'Courier New' };
        this.add.text(this.game.renderer.width * 0.08, this.game.renderer.height * 0.05, "Choose your Spirit Companion", textConfig).setResolution(1).setFontSize(15);
        this.add.text(this.game.renderer.width * 0.05, this.game.renderer.height * 0.8, "Press Space to Confirm", textConfig).setResolution(5);

        // Adding buttons to array
        this.buttons.push(cyclopeSprite);
        this.buttons.push(flameSprite);
        this.buttons.push(moleSprite);
        this.buttons.push(mouseSprite);
        this.buttons.push(octopusSprite);
        this.buttons.push(slimeSprite);
        this.buttons.push(snakeSprite);
        this.buttons.push(mushroomSprite);
        // set all buttons to be grey tinted
        for (var but of this.buttons) {
            but.setTint(0x5c5c5c);
        }
        this.getSelectedIndex();
    }

    getSelectedIndex() {

      const token: TokenStorageService = new TokenStorageService;
      const user = token.getUser().username;
  
      fetch(`http://localhost:3000/pet/${user}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((petMsg) => {
          if (petMsg.success) {
            console.log('petindex', petMsg.pet.petIndex)
            this.selectedButtonIndex = petMsg.pet.petIndex;
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
        if (index >= this.buttons.length) { index %= this.NUMSPRITES }
        else if (index < 0) { index = (index + this.NUMSPRITES) % this.NUMSPRITES }
    
        this.selectButton(index);
    }

    confirmSelection() {
        const button = this.buttons[this.selectedButtonIndex];
        const token: TokenStorageService = new TokenStorageService;
        const user = token.getUser().username;

        const json = JSON.stringify({
          username: user,
          petName: button.texture.key,
          petIndex: this.selectedButtonIndex
        })

        fetch('http://localhost:3000/pet', {
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
                console.log("pet saved")
                this.scene.start('MainScene', { selectedPet: button.texture.key, selectedCharacter: this.selectedCharacter});

                if (window.location.pathname == '/user') {
                  window.location.href = '/game';
                }
                
              } else {
                console.log("pet not saved")
              }
            })
            .catch((err) => {
              console.error("err", err)
            })

    }

    // choosing which pet using arrow keys
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
          this.selectNextButton(-(this.NUMSPRITES / 2));
        } else if (downPressed) {
          this.selectNextButton(this.NUMSPRITES / 2);
        } else if (spacePressed) {
          this.confirmSelection();
        }
    }
}