import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

const SIDEBAR_PINNED_KEY = 'sidebar_pinned';
const DARK_MODE_KEY = 'dark_mode';

function readPreference(key: string, defaultValue: boolean): boolean {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? defaultValue : stored === 'true';
  } catch {
    return defaultValue;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly sidebarPinned = signal(readPreference(SIDEBAR_PINNED_KEY, false));
  protected readonly darkMode = signal(readPreference(DARK_MODE_KEY, true));
  protected readonly userFirstName = computed(
    () => this.auth.user()?.nombre.trim().split(/\s+/)[0] ?? 'Usuario',
  );

  protected toggleSidebarPinned(): void {
    const pinned = !this.sidebarPinned();
    this.sidebarPinned.set(pinned);
    this.savePreference(SIDEBAR_PINNED_KEY, pinned);
  }

  protected toggleDarkMode(): void {
    const darkMode = !this.darkMode();
    this.darkMode.set(darkMode);
    this.savePreference(DARK_MODE_KEY, darkMode);
  }

  private savePreference(key: string, value: boolean): void {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // La preferencia se mantiene en memoria si el almacenamiento no está disponible.
    }
  }
}
