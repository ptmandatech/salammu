import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanLoad {
  constructor(
    public api: ApiService,
    private router: Router
  ) { }
 
  loggedIn:boolean;
  async canLoad(): Promise<boolean> {
    this.api.me().then(user =>{ 
      if(user) { 
        this.loggedIn = true; 
        return true;
      } else { 
        this.loggedIn = false; 
        this.router.navigate(['/login']);
        return false;
      }
    });
    if (this.loggedIn) {
      return true;
    } else {
      return false;
    }
  }
}
