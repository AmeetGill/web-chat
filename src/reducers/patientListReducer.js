import {
  GET_PATIENT_LIST,
  NEW_MESSAGE,
  MAKE_NEW_MSG_COUNT_ZERO,
  UPDATE_LAST_MESSAGE,
  SEARCH_PATIENTS,
  LOAD_BACK_ALL_CHATS,
  BLOCK_USER,
  UNBLOCK_USER,
  MUTE_USER,
  UNMUTE_USER
} from "../actions/types";
import _ from "lodash";

export default function(state = [], action) {
  switch (action.type) {
    case GET_PATIENT_LIST:
      return _.map(action.payload, patient => {
        patient.online = false;
        patient.new_msg_count = patient.new_msg_count ? patient.new_msg_count : 0;
        return patient;
      });

    case UPDATE_LAST_MESSAGE:
      if (action.moveToTop) {
        let temp = null;
        let indexToDelete = -1;
        for (let i = 0; i < action.resource.length; i++) {
          action.resource[i].shiftedToTop = false;
          if (action.resource[i].ID === action.payload.id) {
            action.resource[i].LastMessageContent.content =
              action.payload.content;
            action.resource[i].LastMessageContent.ID = action.payload.msgId
            action.resource[i].shiftedToTop = true;
            temp = action.resource[i];
            indexToDelete = i;
            break;
          }
        }
        //pList.unshift(temp);
        action.resource.splice(indexToDelete, 1);
        action.resource.unshift(temp);
        return action.resource.slice();
      }
      //console.log(action.payload.msgId ,action.resource);
      for (let i = 0; i < action.resource.length; i++) {
        action.resource[i].shiftedToTop = false;
        if (parseInt(action.resource[i].ID,10) === parseInt(action.payload.id,10)) {
          //console.log("cleared first round",action.payload.msgId , action.resource[i].LastMessageContent.ID)
          if(Number(action.payload.msgId) === Number(action.resource[i].LastMessageContent.ID)){
          action.resource[i].LastMessageContent.content =
            action.payload.content;
          }
          break;
        }
      }
      return action.resource.slice();

    case NEW_MESSAGE:
      let temp = null;
      let indexToDelete = -1;
      for (let i = 0; i < action.resource.length; i++) {
        if (parseInt(action.resource[i].ID,10) === parseInt(action.payload.ConversationId,10)) {
          if(!action.resourceObj[action.payload.ConversationId].muted)
            action.resource[i].new_msg_count += 1;
          action.resource[i].LastMessageContent.content =
            action.payload.content;
          temp = action.resource[i];
          indexToDelete = i;
          break;
        }
      }
      //pList.unshift(temp);
      action.resource.splice(indexToDelete, 1);
      action.resource.unshift(temp);
      if(!action.resourceObj[action.payload.ConversationId].muted)
        action.resourceObj[action.payload.ConversationId].new_msg_count += 1;
      return action.resource.slice();

    case MAKE_NEW_MSG_COUNT_ZERO:
      for (let i = 0; i < action.resource.length; i++) {
        if (parseInt(action.resource[i].ID,10) === parseInt(action.payload,10)) {
          action.resource[i].new_msg_count = 0;
          break;
        }
      }

      //action.resourceObj[action.payload].new_msg_count = 0;
      return action.resource.slice();

    case SEARCH_PATIENTS:
      let filteredList = _.filter(action.resource, chat => {
        if (
          (chat.FirstName + " " + chat.LastName)
            .toLowerCase()
            .includes(action.payload.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
      return filteredList;

    case LOAD_BACK_ALL_CHATS:
      return action.payload;

    /*case MAKE_PATIENT_ONLINE:
      for (let i = 0; i < action.resource.length; i++) {
        if (action.resource[i].ID === action.payload) {
          action.resource[i].online = true;
          break;
        }
      }

      return action.resource;

    case MAKE_PATIENT_OFFLINE:
      for (let i = 0; i < action.resource.length; i++) {
        if (action.resource[i].ID === action.payload) {
          action.resource[i].online = false;
          break;
        }
      }

      return action.resource; */

    case BLOCK_USER:
      for (let i = 0; i < action.resource.length; i++) {
        if (parseInt(action.resource[i].ID,10) ===parseInt(action.payload,10)) {
          action.resource[i].Blocked = true;
          break;
        }
      }
      action.resourceObj[action.payload].blocked = true;
      return action.resource.slice();

    case UNBLOCK_USER:
      for (let i = 0; i < action.resource.length; i++) {
        if (parseInt(action.resource[i].ID,10) ===parseInt(action.payload,10)) {
          action.resource[i].Blocked = false;
          break;
        }
      }
      action.resourceObj[action.payload].blocked = false;
      return action.resource.slice();

    case MUTE_USER:
      for (let i = 0; i < action.resource.length; i++) {
        if (parseInt(action.resource[i].ID,10) ===parseInt(action.payload,10)) {
          action.resource[i].Muted = true;
          break;
        }
      }
      action.resourceObj[action.payload].muted = true;
      return action.resource.slice();

    case UNMUTE_USER:
      for (let i = 0; i < action.resource.length; i++) {
        if (parseInt(action.resource[i].ID,10) ===parseInt(action.payload,10)) {
          action.resource[i].Muted = false;
          break;
        }
      }
      action.resourceObj[action.payload].muted = false;
      return action.resource.slice();
    default:
      return state;
  }
}
