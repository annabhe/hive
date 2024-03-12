import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { TitleScreen } from '../classes/title-screen';
import { CharacterSelect } from '../classes/character-select';
import { PetSelect } from '../classes/pet-select';
import { MainScene } from '../classes/main-scene';
import { InteriorScene } from '../classes/interior-scene';
import { TextBox } from '../classes/text-box';
import { DialogueBox } from '../classes/dialogue-box';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: 288,
      height: 192,
      parent: "gameContainer", // ID of the DOM element to add the canvas to
      pixelArt: true,
      zoom: 5,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [
        TitleScreen, 
        CharacterSelect, 
        PetSelect, 
        MainScene, 
        InteriorScene, 
        TextBox, 
        DialogueBox
      ]
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }
}