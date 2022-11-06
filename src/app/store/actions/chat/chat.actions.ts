import { createAction, props } from '@ngrx/store';

export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ data: any }>()
);

export const sendMessageSuccess = createAction(
  '[Chat] Send Message Success',
  props<{ data: any }>()
);

export const sendMessageFailure = createAction(
  '[Chat] Send Message Failure',
  props<{ error: any }>()
);


export const loadMessages = createAction(
  '[Chat] Load Messages',
  props<{ roomId: number }>()
);

export const loadMessagesSuccess = createAction(
  '[Chat] Load Messages Success',
  props<{ data: any }>()
);

export const loadMessagesFailure = createAction(
  '[Chat] Load Messages Failure',
  props<{ error: any }>()
);