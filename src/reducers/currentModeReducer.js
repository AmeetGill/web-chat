import { CHANGE_TO_VIDEO,CHANGE_TO_CHAT} from '../actions/types';


export default function(state = "chat" ,action){
  switch (action.type){
    case CHANGE_TO_VIDEO:
      return "video";
    case CHANGE_TO_CHAT:
      return "chat";
    default :
      return state;
  }
}
