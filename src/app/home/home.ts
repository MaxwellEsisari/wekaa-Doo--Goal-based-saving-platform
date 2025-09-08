import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FaIconComponent, NgFor, NgClass],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  // Icons
  faPiggyBank = faPiggyBank;

  // Animated text content
  texts: string[] = [
    "Lorem ipsum dolor sit amet consectetur",
    "Lorem ipsum dolor sit amet",
    "Lorem ipsum sit .",
    "Lorem, ipsum ",
  ];

  // Steps carousel
  steps: string[] = [
    "Sign up for an account",
    "Set a goal",
    "Plan for contribution",
    "Save & Achieve"
  ];
  currentStep = 0;
  private intervalId?: number;

  // Scroll-based UI states
  firstSectionOpacity = 1;
  firstSectionHeight = '100vh';
  secondSectionBg = 'transparent';
  secondSectionMargin = '50px';

  ngOnInit(): void {
    this.startLoop();
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  /** Starts looping through steps every X ms */
  private startLoop(intervalMs = 5000): void {
    this.stopLoop(); // prevent duplicates
    this.intervalId = window.setInterval(() => {
      this.currentStep = (this.currentStep + 1) % this.steps.length;
    }, intervalMs);
  }

  /** Stops the loop */
  private stopLoop(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

/** Scroll effects for section transition + text depth */
@HostListener('window:scroll', [])
onWindowScroll(): void {
  const firstSection = document.getElementById('top');
  if (!firstSection) return;

  const scrollPosition = window.scrollY;
  const firstSectionHeight = firstSection.offsetHeight;
  const scrollRatio = scrollPosition / firstSectionHeight;

  // Transition first → second section
  if (scrollRatio >= 0.6) {
    this.firstSectionOpacity = 0;
    this.firstSectionHeight = '0px';
    this.secondSectionBg = 'white';
    this.secondSectionMargin = '0px';
  } else {
    this.firstSectionOpacity = 1;
    this.firstSectionHeight = '100vh';
    this.secondSectionBg = 'transparent';
    this.secondSectionMargin = '50px';
  }

  // 🔥 One line at a time, no interference
  const elements = document.querySelectorAll('.animated-text p');
  const lineHeight = window.innerHeight * 0.7; // each line takes ~70% screen height
  const activeIndex = Math.floor(scrollPosition / lineHeight);

  elements.forEach((el, i) => {
    el.classList.remove('active');
    if (i === activeIndex) {
      el.classList.add('active'); // ONLY this one pops forward
    }
  });
}

}
