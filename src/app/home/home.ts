import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  textColor: string = 'black';

  plans = Array.from({ length: 10 }, (_, i) => i + 1);

    @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef;

  // Scroll actions
  scrollLeft() {
    this.cardsContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.cardsContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  


  // Animated text content
  texts: string[] = [
    "Lorem ipsum dolor sit amet consectetur",
    "Lorem ipsum dolor sit amet",
    "Lorem ipsum sit .",
    "Lorem, ipsum ",
  ];

  // Steps with descriptions
  steps: { title: string; description: string }[] = [
    { title: "Sign up for an account", description: "Create your profile to get started." },
    { title: "Set a goal", description: "Choose your savings or financial goal." },
    { title: "Plan for contribution", description: "Decide how much and how often to contribute." },
    { title: "Save & Achieve", description: "Watch your goal grow and reach it!" }
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
    this.startAutoSlide();

  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.stopAutoSlide();

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

@HostListener('window:scroll', [])
onWindowScroll(): void {
  const firstSection = document.getElementById('top');
  if (!firstSection) return;

  const scrollPosition = window.scrollY;
  const firstSectionHeight = firstSection.offsetHeight;
  const scrollRatio = scrollPosition / firstSectionHeight;



  // Animated text lines
  const elements = document.querySelectorAll('.animated-text p');
  const lineHeight = window.innerHeight * 0.7;
  const activeIndex = Math.floor(scrollPosition / lineHeight);

  elements.forEach((el, i) => {
    el.classList.remove('active');
    if (i === activeIndex) {
      el.classList.add('active');
    }
  });
}

testimonials = [
  {
    image: 'holder.jpg',
    name: 'Jane Doe',
    quote: 'This app completely changed how I save money! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat atque dolorum placeat iste voluptatum dolore unde excepturi vero officiis laudantium.'
  },
  {
    image: 'holder.jpg',
    name: 'John Smith',
    quote: 'I love the simple interface and powerful features.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat atque dolorum placeat iste voluptatum dolore unde excepturi vero officiis laudantium.'
  },
  {
    image: 'holder.jpg',
    name: 'Alice Johnson',
    quote: 'Finally, an app that helps me stay on track with my goals! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat atque dolorum placeat iste voluptatum dolore unde excepturi vero officiis laudantium.'
  }
];

currentIndex = 0;
private testimonialInterval?: number;



private startAutoSlide(intervalMs = 8000): void {
  this.stopAutoSlide(); // prevent duplicates
  this.testimonialInterval = window.setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }, intervalMs);
}

private stopAutoSlide(): void {
  if (this.testimonialInterval !== undefined) {
    clearInterval(this.testimonialInterval);
    this.testimonialInterval = undefined;
  }
}
features = [
  {
    icon: "💡",
    title: "Smart Planning",
    description: "Plan your financial journey step by step with ease."
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description: "Monitor your savings and achievements in real time."
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description: "Your data and transactions are always safe with us."
  },
  {
    icon: "⚡",
    title: "Fast & Simple",
    description: "Easy to use and lightning fast to set up."
  }
 
  
];



}