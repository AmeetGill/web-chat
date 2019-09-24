import {
	CHANGE_USER,
	BLOCK_USER,
	UNBLOCK_USER,
	MUTE_USER,
	UNMUTE_USER,
	NEW_MESSAGE
} from "../actions/types";


export default function(state = { name: "", img: "", convId: "", blocked:false,muted:false }, action) {
//	console.log("in user educer",action)
	switch (action.type) {
		case CHANGE_USER:
			return {...action.payload};
		case BLOCK_USER:
			if(parseInt(state.convId,10) === parseInt(action.payload,10)){
				state.blocked = true;
				action.resourceObj[action.payload].blocked = true;
				return {...state};
			}
			else{
				return state;
			}
		case UNBLOCK_USER:
			if(parseInt(state.convId,10) === parseInt(action.payload,10)){
				state.blocked = false;
				action.resourceObj[action.payload].blocked = false;
				return {...state};
			}
			else{
				return state;
			}
		case MUTE_USER:
			if(parseInt(state.convId,10) === parseInt(action.payload,10)){
				state.muted = true;
				action.resourceObj[action.payload].muted = true;
				return {...state};
			}
			else{
				return state;
			}
		case UNMUTE_USER:
			if(parseInt(state.convId,10) === parseInt(action.payload,10)){
				state.muted = false;
				action.resourceObj[action.payload].muted = false;
				return {...state};
			}
			else{
				return state;
			}
		case NEW_MESSAGE:
				let sendNoti = true;
				for(let i = 0; i < action.resource.length; i++){
					if(action.resource[i].ID === action.payload.ConversationId){
						if(action.resource[i].Muted){
							sendNoti = false;
						}
						break;
					}
				}
				//if(sendNoti){
				//	let name = action.resourceObj[action.payload.ConversationId].name
				//	let notification = new Notification("New Message from "+name,{body:action.payload.content.join(" ")});
				//	document.getElementById('noti-sound').play()
				//}

			return state;
		default:
			return state;
	}
}
