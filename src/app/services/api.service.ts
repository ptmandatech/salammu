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
  
  async get(url) {
    let dt = await this.common.get(url);
    return dt;
  }

  async post(url, data) {
    let dt = await this.common.post(url, data);
    return dt;
  }

  async put(url, data) {
    let dt = await this.common.put(url, data);
    return dt;
  }

  async delete(url) {
    let dt = await this.common.delete(url);
    return dt;
  }

  async me()
  { 
    let dt = await this.common.get('users/me');
    return dt;
  } 

  chatSeller(ownerData, detailProduct) {
    var url = 'https://api.whatsapp.com/send?phone=' + ownerData.phone +'&text=Halo%20admin%20salammu,%20saya%20tertarik%20dengan%20produk%20'+ detailProduct.name +'.'
    window.open(url, 'blank')
  }

  async getToday() {
    let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let data = await this.common.getTimes('timingsByCity?city='+ this.city + '&country=Indonesia' + '&method=1');
    return data;
  }

  async getThisWeek() {
    let data = await this.common.getWeekTimes('this_week.json?city='+ this.city +'&school=1');
    return data;
  }

  async getThisMonth(month, year) {
    let data = await this.common.getTimes('calendarByCity?city='+ this.city + '&country=Indonesia' + '&method=1' + '&month='+month+'&year='+year);
    return data;
  }

  async getWeek(start,end) {
    let data = await this.common.getWeekTimes('dates.json?city='+ this.city + '&start=' + start + '&end=' + end +'&school=1');
    return data;
  }

  async getMonth(month) {
    let data = await this.common.getTimes('month.json?city='+ this.city + '&month=' + month +'&school=1');
    return data;
  }

}
