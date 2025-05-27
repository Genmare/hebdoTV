import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DayTimeService {
  private currentSection$ = new BehaviorSubject<string>('matin');

  getCurrentSection() {
    return this.currentSection$.asObservable();
  }

  setCurrentSection(section: string) {
    if (this.currentSection$.value !== section) {
      this.currentSection$.next(section);
    }
  }
}
