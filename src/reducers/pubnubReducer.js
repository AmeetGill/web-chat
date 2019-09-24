import { PUBNUB,PUBNUB_REFRESH } from "../actions/types";
import PubNub from "pubnub";

let loginId = localStorage.getItem('login_id');
let auth_token =  localStorage.getItem('auth_token');


export default function(
  state = new PubNub({
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    uuid: loginId,
    presenceTimeout: 100,
    heartbeatInterval: 0,
    authKey:auth_token,
   //logVerbosity: true,
  }),
  action
) {
  switch (action.type) {
    case PUBNUB:
      return action.payload;

    case PUBNUB_REFRESH:
      return action.payload;
   /* case BLOCK_USER:
      state.unsubscribe({
        channels: [action.payload,'vid'+action.payload]
    });
      return state;
    case UNBLOCK_USER:
      state.subscribe({
        channels: [action.payload,'vid'+action.payload]
    });
      return state; */
    default:
      return state;
  }
}
