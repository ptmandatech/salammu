import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {  
  constructor() {

  } 
  isLandscape()
  {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let isLandscape = w > h ? true : false;
    return isLandscape;
  }
}
