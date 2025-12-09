import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ContinentSelection {
  name: string | null;
  key: string | null;
  color: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ContinentSelectionService {
  private selectionSource = new BehaviorSubject<ContinentSelection>({ name: null, key: null, color: null });
  currentSelection$ = this.selectionSource.asObservable();

  changeSelection(selection: ContinentSelection) {
    this.selectionSource.next(selection);
  }
}