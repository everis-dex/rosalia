import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudioControlService } from './services/audio-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isFullScreen = false;
  expandText = 'PANTALLA COMPLETA';
  iconWindowSrc= '../assets/images/contract.svg';
  iconAudioSrc = '../assets/images/volume_off.svg';
  selectedLanguage: string = 'ES';
  languages: string[] = ['ES', 'GL'];
  expanded: boolean = false;
  audioOn = false;

  constructor(private translate: TranslateService, private audioControl: AudioControlService) {
    this.translate.use('es');
  }

  toggleOptions() {
    this.expanded = !this.expanded;
  }

  getOtherLanguage(): string {
    return this.selectedLanguage === 'ES' ? 'GL' : 'ES';
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    this.expanded = false;
    this.translate.use(language.toLowerCase())
  }

  expandApp() {
    const element = document.documentElement as any;

    if (!this.isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
      this.iconWindowSrc = '../assets/images/expand.svg'
      this.expandText = 'PANTALLA NORMAL';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.iconWindowSrc = '../assets/images/contract.svg'
        this.expandText = 'PANTALLA COMPLETA';
      }
    }
  }

  switchAudio() {
    if(this.audioOn) {
      this.audioControl.playAll();
      this.iconAudioSrc = '../assets/images/volume_off.svg';
      this.audioOn = false;
    } else {
      this.audioControl.pauseAll();
      this.iconAudioSrc = '../assets/images/volume_on.svg';
      this.audioOn = true;
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullScreenChange(event: Event) {
    this.isFullScreen = !!document.fullscreenElement;
  }

}
