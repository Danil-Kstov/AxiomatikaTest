import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule, RouterLinkActive, NgIf, TranslatePipe],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lang = '';
  isDarkMode = false;
  constructor(private translate: TranslateService) {
    this.loadSettings();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadSettings(){
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }

    const savedLang = localStorage.getItem('lang') || 'en';
    this.lang = savedLang;
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }

  switchLanguage(lang: string) {
    this.lang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
