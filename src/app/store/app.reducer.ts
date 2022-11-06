import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { ChatReducer } from "./reducers/chat/chat.reducer";

export const AppReducers: ActionReducerMap<AppState> = {
	chat: ChatReducer,
}