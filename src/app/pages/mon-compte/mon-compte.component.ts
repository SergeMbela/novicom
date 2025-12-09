import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.css'],

})
export class MonCompteComponent {
  activeTab: 'register' | 'login' = 'register';

  setActiveTab(tab: 'register' | 'login') {
    this.activeTab = tab;
  }
}
