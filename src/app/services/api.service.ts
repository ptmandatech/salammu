import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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
  me()
  {
    this.getToken();
    return this.http.get(this.serverUrl+'users/me', this.httpOption);
  }  
  get(url)
  {
    this.getToken();
    return this.http.get(this.serverUrl+url, this.httpOption);
  }
  getWithBearer(url,bearer)
  {
    this.generateOption(bearer);
    return this.http.get(this.serverUrl+url, this.httpOption);
  }
  post(url,data)
  {
    this.getToken();
    return this.http.post(this.serverUrl+url,data,  this.httpOption);
  }
  postWithBearer(url,data,bearer)
  {
    this.generateOption(bearer);
    return this.http.post(this.serverUrl+url,data, this.httpOption);
  }
  put(url,data)
  {
    this.getToken();
    return this.http.put(this.serverUrl+url,data,  this.httpOption);
  }
  putWithBearer(url,data,bearer)
  {
    this.generateOption(bearer);
    return this.http.put(this.serverUrl+url,data, this.httpOption);
  }
  delete(url)
  {
    this.getToken();
    return this.http.delete(this.serverUrl+url,  this.httpOption);
  }
  import(file)
  {
    //this.getToken();
    return this.http.post(this.serverUrl+'import',file);
  }

  upload(url,data)
  {
    this.getToken();
    this.httpOption = {
      headers: new HttpHeaders({       
        'Authorization': 'Bearer '+this.token.jwt
      })
    };
    return this.http.post(this.serverUrl+url,data,  this.httpOption);
  }

  uploadImage(url,data) {
    this.getToken();
    this.httpOption = {
      headers: new HttpHeaders({       
        'Authorization': 'Bearer '+this.token.jwt
      })
    };

    return this.http.post(this.serverUrl+url,data,  this.httpOption);
  }

  uploadDoc(url,data) {
    this.getToken();
    this.httpOption = {
      headers: new HttpHeaders({       
        'Authorization': 'Bearer '+this.token.jwt
      })
    };

    return this.http.post(this.serverUrl+url,data,  this.httpOption);
  }

  user()
  {
    var tokens=localStorage.getItem('lmsToken');
    this.token={email:'',jwt:'',username:'',tahunPelajaran:'',semester:''};
    if(tokens!=null)
    {
      this.token=JSON.parse(tokens);      
    }  
    return this.token; 
  }


}
