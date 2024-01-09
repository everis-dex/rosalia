import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RosaliaChatService } from 'src/app/services/rosalia-chat.service';
import { BackgroundService } from 'src/app/services/background.service';
import { TranslateService } from '@ngx-translate/core';
import { AudioControlService } from 'src/app/services/audio-control.service';

interface Message {
  content: string;
  outgoing: boolean;
}

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageList') chatContainer!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  isLegalAccepted = false;
  showContainer = false;
  isChecked = false;
  isWriting = false;
  isRosaliaWriting = false;
  goBottom = false;
  showModal = false;
  showWelcomeModal = false;
  selectedOption: string | null = null;
  selectedLanguage: string = 'ES';

  constructor(
    private rosaliaChatService: RosaliaChatService,
    private backgroundService: BackgroundService,
    private translate: TranslateService,
    private audioControl: AudioControlService
  ) {
    this.translate.use('es');
  }

  ngOnInit(): void {
    if (window.innerWidth < 767) {
      setTimeout(() => {
        this.showContainer = true;
      }, 2500);
    } else {
      this.showContainer = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.chatContainer?.nativeElement && this.goBottom) {
      this.scrollToBottom();
      this.goBottom = false;
    }
  }

  scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  getLang(): string {
    return this.translate.currentLang;
  }

  async sendMessage(): Promise<void> {
    this.onUserStopWriting();
    const message = this.newMessage;
    if (this.newMessage.trim() !== '') {
      const outgoingMessage: Message = {
        content: this.newMessage,
        outgoing: true,
      };
      this.audioControl.playPop();
      this.messages.push(outgoingMessage);
      this.goBottom = true;
      this.newMessage = '';
      this.backgroundService.startAnimation('teclado');
      this.isRosaliaWriting = true;
      setTimeout(() => {
        this.audioControl.playKeyboard();
      }, 500);
      const response = await this.rosaliaChatService.getResponse(message);
      const incomingMessage: Message = {
        content: response,
        outgoing: false,
      };
      this.messages.push(incomingMessage);
      this.goBottom = true;
      this.audioControl.pauseKeyboard();
      this.backgroundService.startAnimation('teclado-ventana');
      this.isRosaliaWriting = false;
    }
  }

  async acceptLegal(): Promise<void> {
    this.audioControl.playBackground();
    this.isLegalAccepted = true;
    this.closeWelcomeModal();
    let message = '';
    if (this.getLang() === 'es') {
      message = 'Hola, soy Rosal.IA de Castro. ¿De qué quieres hablar?';
    } else {
      message = 'Ola, son Rosal.IA de Castro. De qué queres falar?';
    }
    const incomingMessage: Message = {
      content: message,
      outgoing: false,
    };
    this.messages.push(incomingMessage);
  }

  onUserWriting(): void {
    if (!this.isWriting) {
      this.backgroundService.startAnimation('frente');
      this.isWriting = true;
    }
  }

  onUserStopWriting(): void {
    this.backgroundService.startAnimation('ventana');
    this.isWriting = false;
  }

  openModal(option: string, event: MouseEvent): void {
    event.stopPropagation(); // Evita que el evento se propague al área exterior del modal.
    this.showModal = true;
    this.selectedOption = option;
  }

  openWelcomeModal(event: MouseEvent): void {
    event.stopPropagation();
    this.showWelcomeModal = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const modalContent = document.querySelector('.modal-content');
    if (
      modalContent &&
      !modalContent.contains(event.target as Node) &&
      this.showModal
    ) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedOption = null;
  }

  closeWelcomeModal(): void {
    this.showWelcomeModal = false;
  }
}
