import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ChatService } from '../../../services/chat.service';

import * as chatActions from '../../actions/chat/chat.actions';
import { AppState } from '../../app.state';


@Injectable()
export class ChatEffects {

  constructor(
    private actions$: Actions,
    private chatService: ChatService,
    private store: Store<AppState>,
  ) {}

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.sendMessage),
      mergeMap((payload) => {
        return this.chatService.sendMessage(payload.data).pipe(
          map((response) => {
            return chatActions.sendMessageSuccess({
              data: response
            })
          })
        )
      }),
      catchError((error, caught$) => {
        this.store.dispatch(chatActions.sendMessageFailure({ error: error }))
        return caught$
      })
    )
  )

  sendMessageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.sendMessageSuccess),
      map((data) => {
        console.log(data)
      })
    ), { dispatch: false}
  )

  sendMessageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.sendMessageFailure),
      map((data) => {
        console.log(data)
      })
    ), { dispatch: false}
  )

  loadMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.loadMessages),
      mergeMap((payload) => {
        return this.chatService.loadMessages(payload.roomId).pipe(
          map((response) => {
            return chatActions.loadMessagesSuccess({
              data: response
            })
          })
        )
      }),
      catchError((error, caught$) => {
        this.store.dispatch(chatActions.loadMessagesFailure({ error: error }))
        return caught$
      })
    )
  )

  loadMessagesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.loadMessagesSuccess),
      map((data) => {
        console.log(data)
      })
    ), { dispatch: false}
  )

  loadMessagesFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.loadMessagesFailure),
      map((data) => {
        console.log(data)
      })
    ), { dispatch: false}
  )

}
