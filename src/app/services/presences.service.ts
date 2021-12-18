import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PresencesService {

  serverUrl='https://api.sunhouse.co.id/lms/index.php/';
  public photoBaseUrl='https://api.sunhouse.co.id/lms/photos/';
  httpOption:any;
  constructor(
    public http:HttpClient
  ) 
  {
    
  }

  token:any;
  getToken()
  {
    var tokens=localStorage.getItem('lmsToken');
    this.token={email:'',jwt:''};
    if(tokens!=null)
    {
      this.token=JSON.parse(tokens);      
    }
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+this.token.jwt
      })
    };
  }
  generateOption(bearer)
  {
    this.httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer '+bearer
      })
    };
  }

  async getPresences(uid) {
    this.getToken();
    let data = await this.http.get(this.serverUrl+'presencesData/listPresence/'+uid, this.httpOption).toPromise();
    return data;
  }

  async getDetailPresencesData(uid) {
    this.getToken();
    let data = await this.http.get(this.serverUrl+'presencesData/'+uid, this.httpOption).toPromise();
    return data;
  }

  put(url,data)
  {
    this.getToken();
    return this.http.put(this.serverUrl+url,data,  this.httpOption);
  }
}
