import { Component,computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { menuAlmaceneroComponent } from '../../shared/menu_almacenero_component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-almacenero',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    menuAlmaceneroComponent
],
  template: `
  <mat-toolbar class="" style="background: rgba(28, 145, 255, 1);">
    <button mat-icon-button (click)="collapsed.set(!collapsed())">
      <mat-icon style="color:white">menu</mat-icon>
    </button>
    <span class="example-spacer"></span>
    <button mat-icon-button (click)="isDarkMode.set(!isDarkMode())">
      <mat-icon style="color:white">
        {{isDarkMode()?'dark_mode':'light_mode'}}
      </mat-icon>
    </button>
    <button mat-icon-button (click)="logout()">
      <mat-icon style="color: white;">logout</mat-icon>
    </button>
  </mat-toolbar>

  <mat-sidenav-container>
    <mat-sidenav opened mode="side" [style.width]="sidenavWidth()">

      <app-menu [collapsed]="collapsed()"/>

    </mat-sidenav>

    <mat-sidenav-content class="content" [style.margin-left]="sidenavWidth()">
      <router-outlet/>
    </mat-sidenav-content>

  </mat-sidenav-container>

  
  `,
  styles: `
    mat-toolbar{
      position:relative;
      z-index:5;
      box-shadow:var(--mat-sys-level3) ;
    }
    .content{
      padding:24px;
      
    }
    mat-sidenav-container{
      height: calc(100vh - 68px);
    }
    mat-sidenav{
      border-radius:0
    }

    mat-sidenav,
    mat-sidenav-content{
      transition:all 500s ease-in-out;
    }

    .example-spacer {
       flex: 1 1 auto;
    }
  `
})
export class AlmaceneroComponent {
collapsed = signal(false);

  sidenavWidth = computed(()=>this.collapsed()?'68px':'310px');

  isDarkMode= signal(false);

  private _document=inject(DOCUMENT);
  constructor(private router: Router){
    effect(()=>{
      this._document.body.classList.toggle('dark',this.isDarkMode())
    })
  }

  logout(){
    this.router.navigate(['/login'])
  }
}
