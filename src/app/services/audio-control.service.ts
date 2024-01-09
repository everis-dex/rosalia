import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioControlService {
  backgroundSong = new Audio('../../../assets/audio/background.mp3');
  keyboardSound = new Audio('../../../assets/audio/teclado.mp3');
  popSound = new Audio('../../../assets/audio/pop.wav');

  constructor() {}

  playAll() {
    this.backgroundSong.volume = 0.02;
    this.keyboardSound.volume = 0.1;
    this.popSound.volume = 0.2;
  }

  playBackground(){
    this.backgroundSong.loop = true;
    this.backgroundSong.volume = 0.02;
    this.backgroundSong.play();
  }

  playKeyboard(){
    this.keyboardSound.loop = true;
    this.keyboardSound.volume = 0.1;
    this.keyboardSound.play();
  }

  pauseKeyboard(){
    this.keyboardSound.pause();
  }

  playPop(){
    this.popSound.volume = 0.2;
    this.popSound.play();
  }

  pauseAll() {
    this.backgroundSong.volume = 0;
    this.keyboardSound.volume = 0;
    this.popSound.volume = 0;
  }
}
