import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  animationStarted: EventEmitter<{ action: string }> = new EventEmitter<{ action: string }>();
  animationStopped: EventEmitter<void> = new EventEmitter<void>();

  startAnimation(action: string): void {
    this.animationStarted.emit({ action });
  }

  stopAnimation(): void {
    this.animationStopped.emit();
  }
}
