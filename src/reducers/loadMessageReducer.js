import { LOAD_MESSAGES, EDIT_MESSAGE, ADD_OFFLINE_MSG } from "../actions/types";

export default function(state = [], action) {
  switch (action.type) {
    case LOAD_MESSAGES:
      return action.payload.slice();
    case ADD_OFFLINE_MSG:
      state.unshift(action.payload);
      return state.slice();
    case EDIT_MESSAGE:
    if(action.resource){
      for(let i = 0; i < action.resource.length; i++){
        if(action.payload.id === action.resource[i].id){
          action.resource[i] = action.payload.msg
          break;
        }
      }
      return action.resource.slice();
    }
    default:
      return state;
  }
}
