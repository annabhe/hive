import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { CharacterSelect } from '../../classes/character-select';
import { PetSelect } from '../../classes/pet-select';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: 288,
      height: 192,
      parent: "edit-menu", // ID of the DOM element to add the canvas to
      pixelArt: true,
      zoom: 5,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [CharacterSelect, PetSelect]
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
    if (!localStorage.getItem('firstReload') || localStorage.getItem('firstReload') == 'true') {
      localStorage.setItem('firstReload', 'false');
      window.location.reload();
    } else {
      localStorage.setItem('firstReload', 'true');
    }
  }

}