import {
  PATIENT_LIST_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CHAT_BLOCKED,
  NETWORK_ERROR,
  NO_CHAT
} from "../actions/types";

export default function(state, action) {
  switch (action.type) {
    case PATIENT_LIST_ERROR:
      if(action.payload.notVerified){
        return "EMAIL_NOT_VERIFIED"
      }
      else{
        return "CHATS_LOAD_ERROR";
      }
    case LOGIN_FAILURE:
      return "LOGIN_FAILURE";

    case LOGIN_SUCCESS:
      return "LOGIN_SUCCESS";
    case CHAT_BLOCKED:
      return "USER_BLOCKED";

    case NETWORK_ERROR:
      return "NETWORK_ERROR";

    case NO_CHAT:
      return "NO CHAT";

    default:
      return null;
  }
}
