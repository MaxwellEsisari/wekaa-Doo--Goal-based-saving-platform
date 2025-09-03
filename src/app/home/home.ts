import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ FaIconComponent, NgFor, NgClass ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  faPiggyBank = faPiggyBank;

  steps: string[] = [
    ' Sign up for an account',
    ' Set a goal',
    ' Plan for contribution',
    ' Save & Achieve'
  ];

  currentStep = 0;
  private intervalId?: number;

  firstSectionOpacity = 1;
  secondSectionBg = 'transparent';

  ngOnInit(): void {
    this.startLoop();
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  private startLoop(intervalMs = 5000) {
    this.stopLoop();
    this.intervalId = window.setInterval(() => {
      this.currentStep = (this.currentStep + 1) % this.steps.length;
    }, intervalMs);
  }

  private stopLoop() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const firstSection = document.getElementById('top');
    const secondSection = document.getElementById('get-started');

    if (!firstSection || !secondSection) return;

    const scrollPosition = window.scrollY;
    const firstSectionHeight = firstSection.offsetHeight;
    const scrollRatio = scrollPosition / firstSectionHeight;

    if (scrollRatio >= 0.8) {
      this.firstSectionOpacity = 0;
      this.secondSectionBg = 'black';
    } else {
      this.firstSectionOpacity = 1;
      this.secondSectionBg = 'transparent';
    }
  }
}
