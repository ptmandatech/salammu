import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  serverUrl='https://api.pray.zone/v2/times/';
  constructor(
    public http:HttpClient
  ) 
  {
    
  }
 
  data:any;
  async get(url)
  {
    this.data = undefined;
    this.data = await this.http.get(this.serverUrl+url).toPromise();
    return this.data.results;
  }
  
  post(url,data)
  {
    return this.http.post(this.serverUrl+url,data);
  }
  
  put(url,data)
  {
    return this.http.put(this.serverUrl+url,data);
  }
  
  delete(url)
  {
    return this.http.delete(this.serverUrl+url);
  }

}
