import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';

export const selectChatFeature = createFeatureSelector<AppState>('chat');

export const selectMessages = createSelector(
	selectChatFeature,
	(state: any) => {
		console.log(state)
		return state.messages;
  	}
);