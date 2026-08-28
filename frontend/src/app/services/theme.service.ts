import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private static readonly STORAGE_KEY = 'employee-hub-theme';

  private themeSubject = new BehaviorSubject<Theme>('light');

  constructor() {
    this.setTheme(this.readStoredTheme());
  }

  get theme$(): Observable<Theme> {
    return this.themeSubject.asObservable();
  }

  get theme(): Theme {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.theme === 'dark';
  }

  toggle(): void {
    this.setTheme(this.isDark ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');

    try {
      localStorage.setItem(ThemeService.STORAGE_KEY, theme);
    } catch {
      // Private browsing modes can block storage; the theme still applies for this session.
    }
  }

  private readStoredTheme(): Theme {
    try {
      const stored = localStorage.getItem(ThemeService.STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {
      // Fall through to the system preference.
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
