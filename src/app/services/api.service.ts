import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from './common.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  city:any = 'yogyakarta';
  constructor(
    public http:HttpClient,
    private common: CommonService,
    private datePipe: DatePipe
  ) 
  {
    
  }

  async getToday() {
    let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let data = await this.common.get('day.json?city='+ this.city +'&date='+ date +'&school=1');
    return data;
  }

  async getWeek() {
    let data = await this.common.get('this_week.json?city='+ this.city +'&school=1');
    return data;
  }

  async getMonth() {
    let data = await this.common.get('this_month.json?city='+ this.city +'&school=1');
    return data;
  }

}
