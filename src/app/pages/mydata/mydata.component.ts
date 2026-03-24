import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-mydata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mydata.component.html',
  styleUrl: './mydata.component.css',
})
export class MydataComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);
  user: User | null = null;

  ngOnInit(): void {
    // La logique de récupération de l'utilisateur via la session a été retirée.
  }
}
