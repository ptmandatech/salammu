import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private common: CommonService,
    private httpClient: HttpClient
  ) { }

  public sendMessage(payload: any = {}): Observable<any> {
    // const endpoint = 'http://localhost/salammu/index.php/chattings/chats';
    return this.httpClient.post(this.common.serverUrl+'chattings/chats', payload);
  }

  public loadMessages(roomId: number): Observable<any> {
    // const endpoint = `http://localhost/salammu/index.php/chattings/getChats/${roomId}`;
    return this.httpClient.get(this.common.serverUrl+'chattings/getChats/'+roomId);
  }
  
}
