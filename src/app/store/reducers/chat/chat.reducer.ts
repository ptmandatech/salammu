import { Action, createReducer, on } from '@ngrx/store';
import * as chatActions from '../../actions/chat/chat.actions';

export const chatFeatureKey = 'chat';

export interface ChatState {
  message?: {
    data: any,
    status: string,
    error: any,
  },
  messages?: {
    data: any,
    status: string,
    error: any,
  }
}

export const initialState: ChatState = {
  message: {
    data: {},
    status: 'idle',
    error: undefined
  },
  messages: {
    data: [],
    status: 'idle',
    error: undefined
  }
};

export const reducer = createReducer(
  initialState,

  on(chatActions.sendMessage, (state, payload) => {
    return {
      ...state,
      message: {
        ...state.message,
        data: payload.data,
        status: 'loading',
      },

      // append new message to messages list
      messages: {
        ...state.messages,
        data: [
          ...state.messages.data,
          payload.data
        ]
      }
    }
  }),
  on(chatActions.sendMessageSuccess, (state, payload) => {
    return {
      ...state,
      message: {
        ...state.message,
        data: payload.data,
        status: 'idle',
      }
    }
  }),
  on(chatActions.sendMessageFailure, (state, payload) => {
    return {
      ...state,
      message: {
        ...state.message,
        data: {},
        status: 'idle',
        error: payload.error
      }
    }
  }),

  on(chatActions.loadMessages, (state, payload) => {
    return {
      ...state,
      messages: {
        ...state.messages,
        status: 'loading',
      }
    }
  }),
  on(chatActions.loadMessagesSuccess, (state, payload) => {
    return {
      ...state,
      messages: {
        ...state.messages,
        data: payload.data,
        status: 'idle',
      }
    }
  }),
  on(chatActions.loadMessagesFailure, (state, payload) => {
    return {
      ...state,
      messages: {
        ...state.messages,
        data: [],
        error: payload.error,
        status: 'idle',
      }
    }
  })
);

export function ChatReducer(state: ChatState | undefined, action: Action) {
  return reducer(state, action)
}