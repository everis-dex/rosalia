import { Component, OnInit } from '@angular/core';
import { BackgroundService } from 'src/app/services/background.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  staticSrc = '../../../assets/animations/rosalia_ventana_1.gif';

  constructor(private backgroundService: BackgroundService) {
  }

  ngOnInit(): void {
    this.backgroundService.animationStarted.subscribe(({ action }) => {
      this.changeAnimation(action);
    });
  }

  pauseGif(src: string) {
    if(src.indexOf('ventana_1') !== -1 ) {
      setTimeout(() => {
        this.staticSrc = '../../../assets/animations/rosalia_ventana.png';
      }, 800)
    }
    if(src.indexOf('frente_1') !== -1 ) {
      setTimeout(() => {
        this.staticSrc = '';
        this.staticSrc = '../../../assets/animations/rosalia_frente.png';
      }, 500)
    }
  }


  changeAnimation(action: string): void {
    switch(action) {
      case 'ventana':
        this.staticSrc = '../../../assets/animations/rosalia_ventana_1.gif';
        break;
      case 'teclado':
        this.staticSrc = '../../../assets/animations/rosalia_teclado.gif';
        break;
      case 'frente':
        this.staticSrc = '../../../assets/animations/rosalia_frente_1.gif';
        break;
      case 'teclado-ventana':
      this.staticSrc = '../../../assets/animations/rosalia_frente_1.gif';
      setTimeout(() => {
        this.staticSrc = '../../../assets/animations/rosalia_ventana_1.gif';
      }, 3000)
      break;
      default:
        this.staticSrc = '../../../assets/animations/rosalia_ventana.gif';
        break;
    }
  }
}
