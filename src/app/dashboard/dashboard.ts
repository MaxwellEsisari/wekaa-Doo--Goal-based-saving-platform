import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import confetti from 'canvas-confetti';

interface Goal {
  id: number;
  title: string;
  emoji: string;
  saved: number;
  target: number;
  color: string;
}

interface Activity {
  text: string;
  time: Date;
  amount: number;
}

interface Badge {
  title: string;
  earned: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [NgForOf, NgIf, NgStyle, DatePipe],
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  userFirstName = 'Loading...'; // placeholder until backend fills in
  goals: Goal[] = [];
  activities: Activity[] = [];
  badges: Badge[] = [];
  monthlySavings: number[] = [];

  ngOnInit(): void {
    // === Placeholder Data (replace with backend later) ===
    this.userFirstName = 'John';
    this.goals = [
      { id: 1, title: 'Car Fund', emoji: '🚗', saved: 300, target: 1000, color: '#4f9ef7' },
      { id: 2, title: 'Vacation', emoji: '🏖️', saved: 500, target: 2000, color: '#57d28d' }
    ];
    this.activities = [
      { text: 'Added ksh 100 to Car Fund', time: new Date(), amount: 100 },
      { text: 'Added ksh 50 to Vacation', time: new Date(), amount: 50 }
    ];
    this.badges = [
      { title: 'First Savings', earned: true },
      { title: 'Halfway There', earned: false }
    ];
    this.monthlySavings = [200, 300, 150, 400, 500];
  }

  // === Utility Methods ===
  getMainGoal(): Goal {
    return this.goals[0] || { id: 0, title: 'Loading...', emoji: '🎯', saved: 0, target: 1, color: '#ccc' };
  }

  getPercent(g: Goal): number {
    return Math.min(100, Math.round((g.saved / g.target) * 100));
  }

  circleDash(goal: Goal, radius: number): string {
    if (!goal) return '';
    const pct = this.getPercent(goal);
    const circumference = 2 * Math.PI * radius;
    const filled = (pct / 100) * circumference;
    const empty = circumference - filled;
    return `${filled} ${empty}`;
  }

  formatCurrency(val: number): string {
    return val.toLocaleString();
  }

  totalSavings(): number {
    return this.goals.reduce((acc, g) => acc + g.saved, 0);
  }

  thisMonthSavings(): number {
    return this.monthlySavings[this.monthlySavings.length - 1] || 0;
  }

  recommendationText(): string {
    return "Keep up your saving momentum!";
  }

  // === Chart helpers ===
  buildLinePath(width: number, height: number): string {
    if (this.monthlySavings.length === 0) return '';
    const max = Math.max(...this.monthlySavings) || 1;
    return this.monthlySavings
      .map((val, i) => {
        const x = (width / (this.monthlySavings.length - 1)) * i;
        const y = height - (val / max) * (height - 8);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
      })
      .join(' ');
  }

  getCircleX(index: number, width = 400): number {
    return (width / (this.monthlySavings.length - 1)) * index;
  }

  getCircleY(val: number, height = 120): number {
    const max = Math.max(...this.monthlySavings) || 1;
    return height - (val / max) * (height - 8);
  }

  // === Add Savings & Trigger Confetti ===
  addSavings(goalId: number, amount: number) {
    console.log(`Would POST /goals/${goalId}/savings {amount: ${amount}}`);
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.saved += amount;
      this.activities.unshift({
        text: `Added ksh${amount} to ${goal.title}`,
        time: new Date(),
        amount
      });

      // ✅ Check if goal reached target
      if (goal.saved >= goal.target) {
        this.launchConfetti();
      }
    }
  }

  // 🎉 Bursting confetti celebration
  private launchConfetti() {
    const duration = 2 * 1000; // 2 seconds
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  createGoal(title: string, target: number) {
    console.log(`Would POST /goals {title, target}`);
    const newGoal: Goal = {
      id: this.goals.length + 1,
      title,
      emoji: '🎯',
      saved: 0,
      target,
      color: '#f59e0b'
    };
    this.goals.push(newGoal);
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
