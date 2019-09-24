import axios from "axios";
import {
  INITIALIZE,
  LOAD_MESSAGES,
  CHANGE_TO_CHAT,
  CHANGE_TO_VIDEO,
  MAKE_NEW_MSG_COUNT_ZERO,
  GET_PATIENT_LIST,
  NEW_MESSAGE,
  EDIT_MESSAGE,
  CHANGE_USER,
  UPDATE_LAST_MESSAGE,
  PATIENT_LIST_ERROR,
  SEARCH_PATIENTS,
  LOAD_BACK_ALL_CHATS,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  BLOCK_USER,
  UNBLOCK_USER,
  MUTE_USER,
  UNMUTE_USER,
  CHAT_BLOCKED,
  NETWORK_ERROR,
  ADD_OFFLINE_MSG,
  NO_CHAT
} from "./types";
import * as helperFunctions from "./helperFunctions";
import CryptoJS from "crypto-js";
//import worker from './worker.js';
//import WebWorker from './WebWorker';

//let cryptWorker = new WebWorker(worker);

let offlineMsgId = 1;
let offlineMsgList = [];
let urlAPI = "";


export const initialize = () => dispatch => {
  let app = {
    usertoken: localStorage.getItem("user_token"),
    userid: localStorage.getItem("user_id"),
    loginid: parseInt(localStorage.getItem("login_id"), 10),
    img:"",
    last: 100
  };
  dispatch({ type: INITIALIZE, payload: app });
};

export const change_user = (user, app) => dispatch => {
  // console.log("in index.j change user", user);
  dispatch({ type: CHANGE_USER, payload: user, resource: app["patients"] });
};


export const check_last_message = (id,app) => {
  var res =  axios.get(
        urlAPI,
        {
          headers: {
            authorization: app.usertoken
          }
        }
      );

  return res.data;
}

export const load_messages = (
  id,
  num,
  app,
  keyword = "",
  beforeNewMessage = false
) => async dispatch => {
  let enteredInIf = false;
  //console.log(id, num, app["patient" + id]);
  if (num > app["patient" + id].length || app["patient" + id].length === 0) {
    try {
      var res = await axios.get(
        `https://${urlAPI}/v1/chat/all-message/${id}/${
          app["patient" + id].length
        }/${num}`,
        {
          headers: {
            authorization: app.usertoken
          }
        }
      );
    } catch (error) {
      if (error.message === "Network Error") {
        dispatch({ type: NETWORK_ERROR });
      } else {
        if (error.response.data.error === "Token expired") {
          dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
        }
      }
    }
    if (res.data.length > 0) {
      //console.log("got response from loaded msggs",res.data)
      if (app["patient" + id].length === 0) {
        app["patient" + id] = helperFunctions.processLoadedMessages(
          res.data,
          app
        );
        //console.log("after processing " , app["patient"+id])
      } else {
        app["patient" + id] = app["patient" + id].concat(
          helperFunctions.processLoadedMessages(res.data, app)
        );
      }
    }
    enteredInIf = true;
  }
  if (!beforeNewMessage) {
    if (enteredInIf)
      dispatch({ type: LOAD_MESSAGES, payload: app["patient" + id] });
    else {
      setTimeout(
        () =>
          dispatch({
            type: LOAD_MESSAGES,
            payload: app["patient" + id]
          }),
        500
      );
    }
  }
};

export const get_patient_list = (
  app,
  pubnub,
  toSubscribeChannels = false
) => async dispatch => {
  if (app.length !== 0) {
    axios
      .get(`https://${urlAPI}/v1/chat/all-conversations/0/200`, {
        headers: {
          authorization: app.usertoken
        }
      })
      .then(res => {
        if (res.data.length !== 0) {
          app["patients"] = helperFunctions.sortByMessage(res.data);
          if (toSubscribeChannels) subscribe(app["patients"], pubnub, app);
          helperFunctions.createUserObjectWithId(app, app["patients"]);
          // if(window.location.hash.length < 1)
          // window.location.hash = "id" + app["patients"][0].ID
          dispatch({ type: GET_PATIENT_LIST, payload: app["patients"] });
        } else {
          // console.log("npo chat dispatching error");
          dispatch({ type: NO_CHAT });
        }
      })
      .catch(error => {
        //console.log("sdfsddfdsf",error.response.data)
        if (
          error.response.data.error ===
          "Your account is not yet verified. Please check your email for your verification link"
        ) {
          dispatch({
            type: PATIENT_LIST_ERROR,
            payload: { status: "403", notVerified: true }
          });
        } else {
          dispatch({
            type: PATIENT_LIST_ERROR,
            payload: { status: "403", notVerified: false }
          });
        }
      });
  }
};

function subscribe(pList, pubnub, app) {
 // console.log("called function");
  let convList = [app.loginid, "vid" + app.loginid];
  let count = 0;
  pList.forEach(r => {
    app["patient" + r.ID] = [];
    //if (!r.Blocked) {
    //convChannels.push(r.ID);
    //}
    if (app.userType !== 1 && count < 47) {
      convList.push(r.login_id + "-pnpres");
      count++;
    }
  });

  //convChannels.forEach(e => {
  //convChannels.push(`vid${e}`);
  //});
 // console.log("subscribing");

 /*


    pubnub = new PubNub({
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    uuid: loginId,
    presenceTimeout: 100,
    heartbeatInterval: 0,
    authKey:auth_token,
   //logVerbosity: true,
    })  

    dispatch({type:"PUBNUB_REFRESH",payload:pubnub})

 */
  setTimeout(() => {

    pubnub.subscribe({
      channels: [app.loginid, "vid" + app.loginid]
    });
  }, 2000);

  setInterval(() => pubnub.reconnect(), 140000);
}

export const unsubscribe = (pList, pubnub, app) => async dispatch => {
  pubnub.unsubscribeAll();
};

export const new_message_handler = (
  send_me_next,
  error,
  pubnub,
  app,
  toSend,
  msg,
  convId,
  fileLink,
  externLinks,
  raw_file
) => dispatch => {
  if (offlineMsgList.length === 0) {
    let offlineMsg = helperFunctions.processSingleOfflineMessage(
      msg,
      convId,
      app,
      fileLink,
      externLinks,
      raw_file,
      offlineMsgId
    );
    dispatch({ type: ADD_OFFLINE_MSG, payload: offlineMsg });
    app["patient" + convId].unshift(offlineMsg);
    offlineMsgList.push({
      msg: msg,
      convId: convId,
      fileLink: fileLink,
      externLinks: externLinks,
      raw_file: raw_file,
      offlineMsgId: offlineMsgId
    });
    let currentOfflineMsgId = offlineMsgId++;
    return dispatch(
      new_message(
        pubnub,
        app,
        true,
        msg,
        convId,
        fileLink,
        externLinks,
        raw_file,
        currentOfflineMsgId
      )
    );
  } else {
    if (send_me_next) {
      offlineMsgList.shift();
      if (offlineMsgList.length > 0) {
        let nextMsgToSend = offlineMsgList[0];
        return dispatch(
          new_message(
            pubnub,
            app,
            true,
            nextMsgToSend.msg,
            nextMsgToSend.convId,
            nextMsgToSend.fileLink,
            nextMsgToSend.externLinks,
            nextMsgToSend.raw_file,
            nextMsgToSend.offlineMsgId
          )
        );
      }
    } else {
      if (error) {
        let nextMsgToSend = offlineMsgList[0];
        setTimeout(() => {
          return dispatch(
            new_message(
              pubnub,
              app,
              true,
              nextMsgToSend.msg,
              nextMsgToSend.convId,
              nextMsgToSend.fileLink,
              nextMsgToSend.externLinks,
              nextMsgToSend.raw_file,
              nextMsgToSend.offlineMsgId
            )
          );
        }, 3000);
      } else {
        let offlineMsg = helperFunctions.processSingleOfflineMessage(
          msg,
          convId,
          app,
          fileLink,
          externLinks,
          raw_file,
          offlineMsgId
        );
        app["patient" + convId].unshift(offlineMsg);
        offlineMsgList.push({
          toSend: toSend,
          msg: msg,
          convId: convId,
          fileLink: fileLink,
          externLinks: externLinks,
          raw_file: raw_file,
          offlineMsgId: offlineMsgId
        });
        dispatch({ type: ADD_OFFLINE_MSG, payload: offlineMsg });
        offlineMsgId++;
      }
    }
  }
};

export const new_message = (
  pubnub,
  app,
  toSend,
  msg,
  convId,
  fileLink,
  externLinks,
  raw_file,
  currentOfflineMsgId
) => dispatch => {
  if (toSend) {
    //app["notSentMsgs"].(app["patient"+convId] + "1") = offlineMsg

    axios({
      method: "post",
      url: `https://${urlAPI}/v1/chat/send-message/${convId}`,
      data: JSON.stringify({
        content: msg,
        file: fileLink,
        external_links: externLinks
      }),
      headers: {
        authorization: app.usertoken
      }
    })
      .then(response => {
        //app['patient'+ convId] = app['patient'+ convId].unshift(helperFunctions.processLoadedMessages(response.data,app));
        //console.log("request made ", response);
       

        for (let i = 0; i < app["patient" + convId].length; i++) {
          let currentMsg = app["patient" + convId][i];
          if (!currentMsg.offline) {
            if (app["patient" + convId][i].sent === false) {
              continue;
            }
            break;
          } else {
            if (currentMsg.offlineMsgId === currentOfflineMsgId) {
              //  console.log("found message ",currentOfflineMsgId)
              app["patient" + convId][i] = helperFunctions.processSingleMessage(
                response.data,
                app,
                raw_file
              );
            }
          }
        }

        pubnub.publish(
          {
            message: {
              type: "newMessage",
              obj: response.data,
              randomId: app.randomId,
              loginId: app.loginid,
              convId: convId,
              name: app.name
            },
            channel: app["patientsObj"][convId].loginId,
            sendByPost: false, // true to send via post
            storeInHistory: false, //override default storage options
            meta: {
              cool: "meta"
            } // publish extra meta with the request
          },
          function(status, response) {
            // handle status, response
         //   console.log(status);
          }
        );
        pubnub.publish(
          {
            message: {
              type: "newMessage",
              obj: response.data,
              randomId: app.randomId,
              loginId: app.loginid,
              convId: convId,
              name: app.name
            },
            channel: app.loginid,
            sendByPost: false, // true to send via post
            storeInHistory: false, //override default storage options
            meta: {
              cool: "meta"
            } // publish extra meta with the request
          },
          function(status, response) {
            // handle status, response
          //  console.log(status);
          }
        );

        dispatch({
          type: MAKE_NEW_MSG_COUNT_ZERO,
          payload: convId,
          resource: app["patients"],
          resourceObj: app["patientsObj"]
        });
        dispatch({
          type: LOAD_MESSAGES,
          payload: app["patient" + convId]
        });
        dispatch({
          type: UPDATE_LAST_MESSAGE,
          payload: {
            content: msg,
            id: response.data.conversation_id,
            msgId: response.data.ID
          },
          resource: app["patients"],
          moveToTop: true
        });
        return dispatch(new_message_handler(true, false, pubnub, app));
      })
      .catch(error => {
     //   console.log("request is made but error", error);
        if (error.response.data.Error === "Chat is blocked") {
          dispatch({ type: CHAT_BLOCKED });
          return dispatch(new_message_handler(true, false, pubnub, app));
        } else {
          if (error.response.data.error === "Token expired") {
            dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
          } else {
            if (error.request) {
              return dispatch(new_message_handler(false, true, pubnub, app));
            }
          }
        }
      });
  } else {
   
      
      if (app["patient" + msg.obj.conversation_id].length === 0) {
        //load_messages(msg.obj.conversation_id, 15, app, "", true);
        if (app.loginid !== msg.obj.creator_id) {
          dispatch({
            type: NEW_MESSAGE,
            payload: helperFunctions.processSingleMessage(msg.obj, app),
            resource: app["patients"],
            resourceObj: app["patientsObj"]
          });
        }
      } else {
        app["patient" + msg.obj.conversation_id].unshift(
          helperFunctions.processSingleMessage(msg.obj, app)
        );

        // this if block is added to deal with same message inserting twice don't now why

        if (app["patient" + msg.obj.conversation_id].length > 2) {
          if (
            app["patient" + msg.obj.conversation_id][0].id ===
            app["patient" + msg.obj.conversation_id][1].id
          ) {
            app["patient" + msg.obj.conversation_id].shift();
          }
        }
        // console.log("new message", parseInt(msg.obj.conversation_id) === parseInt(convId));
        if (parseInt(msg.obj.conversation_id,10) === parseInt(convId,10)) {
          if (!window.isTabOpened && app.loginid !== msg.obj.creator_id) {
            //  console.log("sending notification")
            dispatch({
              type: NEW_MESSAGE,
              payload: helperFunctions.processSingleMessage(msg.obj, app),
              resource: app["patients"],
              resourceObj: app["patientsObj"]
            });
          } else {
            app["patientsObj"][convId].new_msg_count = 0;
            dispatch({
              type: MAKE_NEW_MSG_COUNT_ZERO,
              payload: msg.obj.conversation_id,
              resource: app["patients"],
              resourceObj: app["patientsObj"]
            });
          }
          dispatch({
            type: LOAD_MESSAGES,
            payload: app["patient" + convId]
          });
          dispatch({
            type: UPDATE_LAST_MESSAGE,
            payload: {
              content: msg.obj.content,
              id: msg.obj.conversation_id,
              msgId: msg.id
            },
            resource: app["patients"],
            moveToTop: true
          });
        } else {
          if (app.loginid !== msg.obj.creator_id) {
            dispatch({
              type: NEW_MESSAGE,
              payload: helperFunctions.processSingleMessage(msg.obj, app),
              resource: app["patients"],
              resourceObj: app["patientsObj"]
            });
          }
        }
      }
  }
};

export const edit_message = (toSend, msg, pubnub, convId, app) => dispatch => {
  if (toSend) {
    axios({
      method: "post",
      url: `https://${urlAPI}/v1/chat/edit-message/${convId}/${msg.id}`,
      data: JSON.stringify(msg),
      headers: {
        authorization: app.usertoken
      }
    })
      .then(response => {
        // console.log("edited message got from server",response.data)
        let editedMsg = helperFunctions.processSingleMessage(
          response.data,
          app
        );
        dispatch({
          type: EDIT_MESSAGE,
          payload: {
            msg: editedMsg,
            id: msg.id,
            sent: false
          },
          resource: app["patient" + convId]
        });
        dispatch({
          type: UPDATE_LAST_MESSAGE,
          payload: {
            content: response.data.content,
            id: convId,
            msgId: response.data.ID
          },
          resource: app["patients"]
        });

        pubnub.publish(
          {
            message: {
              type: "edit-message",
              obj: {
                msg: response.data,
                id: msg.id,
                convId: convId,
                loginId: app.loginid
              }
            },
            channel: app["patientsObj"][convId].loginId,
            sendByPost: false,
            storeInHistory: false,
            meta: {
              cool: "meta"
            }
          },
          function(status, response) {}
        );
      })
      .catch(error => {
        if (error.response.data.error === "Token expired") {
          dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
        }
      });
  } else {
    let editedMsg = helperFunctions.processSingleMessage(msg.obj.msg, app);

    dispatch({
      type: UPDATE_LAST_MESSAGE,
      payload: {
        content: msg.obj.msg.content,
        id: msg.obj.convId,
        msgId: msg.obj.msg.ID
      },
      resource: app["patients"]
    });
    dispatch({
      type: EDIT_MESSAGE,
      payload: {
        msg: editedMsg,
        id: msg.obj.msg.ID
      },
      resource: app["patient" + convId]
    });
  }
};

export const login = (email, pass) => dispatch => {
  axios({
    method: "post",
    url: "https://${urlAPI}/v1/login",
    data: JSON.stringify({ email: email, password: pass })
  })
    .then(res => {
      let response = res.data;
      localStorage.setItem("login_id", response.ID);
      localStorage.setItem("user_token", response.token);
      localStorage.setItem("user_type", response.userType);
      localStorage.setItem(
        "user_fullName",
        response.userType === 1
          ? helperFunctions.capitalizeFirstLetter(
              response.doctor_profile.firstName
            ) +
            " " +
            helperFunctions.capitalizeFirstLetter(
              response.doctor_profile.lastName
            )
          : helperFunctions.capitalizeFirstLetter(
              response.patient_profile.firstName
            ) +
            " " +
            helperFunctions.capitalizeFirstLetter(
              response.patient_profile.lastName
            )
      );
      localStorage.setItem(
        "user_picture",

        response.userType === 1
          ? response.doctor_profile.picture
          : response.patient_profile.image_url
      );
      localStorage.setItem("user_profile_id", response.user_profileid);
      localStorage.setItem("auth_token", response.pub_nub_auth_token);
      dispatch({ type: LOGIN_SUCCESS });
    })
    .catch(error => {
      dispatch({ type: LOGIN_FAILURE });
    });
};

export const make_new_msg_count_zero = (conversation_id, app) => dispatch => {
  dispatch({
    type: MAKE_NEW_MSG_COUNT_ZERO,
    payload: conversation_id,
    resource: app["patients"],
    resourceObj: app["patientsObj"]
  });
};

export const sendCallOk = (
  pubnub,
  convId,
  app,
  callerId,
  name,
  callerDeviceId
) => dispatch => {
  //  console.log(callerId,app);
  
  pubnub.publish(
    {
      message: {
        type: "call-ok",
        obj: {
          id: app.loginid,
          chat: convId,
          convId: convId,
          callerName: name,
          callerId: parseInt(callerId),
          deviceId: app.randomId,
          callerDeviceId: callerDeviceId
        }
      },
      channel: `vid${app.loginid}`,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
        cool: "meta"
      } // publish extra meta with the request
    },
    function(status, response) {
        console.log("pubnub",status)
    }
  );
  setTimeout(() =>{

    pubnub.publish(
      {
        message: {
          type: "call-ok",
          obj: {
            id: app.loginid,
            chat: convId,
            convId: convId,
            callerName: name,
            callerId: parseInt(callerId),
            deviceId: app.randomId,
            callerDeviceId: callerDeviceId
          }
        },
        channel: `vid${callerId}`,
        sendByPost: false, // true to send via post
        storeInHistory: false, //override default storage options
        meta: {
          cool: "meta"
        } // publish extra meta with the request
      },
      function(status, response) {
        console.log(status,"fdgyt")
      }
    );
  },500);  
};

export const sendStopCall = (pubnub, convId, app, convId1) => dispatch => {
  pubnub.publish(
    {
      message: {
        type: "call-stop",
        obj: {
          id: app.loginid,
          deviceId: app.randomId,
          convId: convId1
        }
      },
      channel: `vid${convId}`,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
        cool: "meta"
      } // publish extra meta with the request
    },
    function(status, response) {
      // handle status, response
    }
  );
  pubnub.publish(
    {
      message: {
        type: "call-stop",
        obj: {
          id: convId,
          deviceId: app.randomId,
          convId: convId1
        }
      },
      channel: `vid${app.loginid}`,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
        cool: "meta"
      } // publish extra meta with the request
    },
    function(status, response) {
      // handle status, response
    }
  );
  //pubnub.unsubscribe({
  //  channels: [convId1, "vid" + convId1]
  //});
};

export const rejectCall = (pubnub, convId, app) => dispatch => {
  pubnub.publish(
    {
      message: {
        type: "call-reject",
        obj: {
          id: app.loginid,
          convId: convId,
          deviceId: app.randomId,
          name: app.name
        }
      },
      channel: `vid${app["patientsObj"][convId].loginId}`,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
        cool: "meta"
      } // publish extra meta with the request
    },
    function(status, response) {
      // handle status, response
    }
  );
};

export const call = (pubnub, app, convId, name) => dispatch => {
  axios({
    method: "post",
    url: `https://${urlAPI}/v1/chat/video_chat/start_call`,
    data: JSON.stringify({
      is_repeat: false,
      conversation_id: parseInt(convId,10),
      device_id:app.randomId
    }),
    headers: {
      authorization: app.usertoken
    }
  });
  pubnub.publish(
    {
      message: {
        type: "call",
        obj: {
          id: app.loginid,
          chat: convId,
          convId: convId,
          name: name,
          deviceId: app.randomId
        }
      },
      channel: `vid${app["patientsObj"][convId].loginId}`,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
        cool: "meta"
      } // publish extra meta with the request
    },
    function(status, response) {
      // handle status, response
    }
  );
};

export const switchToVideo = () => dispatch => {
  dispatch({ type: CHANGE_TO_VIDEO });
};

export const switchToChat = () => dispatch => {
  dispatch({ type: CHANGE_TO_CHAT });
};

export const searchPatient = (app, keyword) => dispatch => {
  dispatch({
    type: SEARCH_PATIENTS,
    payload: keyword,
    resource: app["patients"]
  });
};

export const loadBackAllChats = app => dispatch => {
  dispatch({ type: LOAD_BACK_ALL_CHATS, payload: app["patients"] });
};

export const makeUserOnline = (app, convId) => dispatch => {
  app["patientsObj"][convId].online = true;
};

export const makeUserOffline = (app, convId) => dispatch => {
  app["patientsObj"][convId].online = false;
};

export const sendCallRecieved = (app, pubnub, convId) => dispatch => {
  // console.log(convId);
  pubnub.publish(
    {
      message: {
        type: "call-recieved",
        obj: {
          id: app.loginid,
          conv: convId
        }
      },
      channel: app["patientsObj"][parseInt(convId,10)].loginId,
      sendByPost: false,
      storeInHistory: false,
      meta: {
        cool: "meta"
      }
    },
    function(status, response) {}
  );
};

export const cancelCall = (app, pubnub, convId, name) => dispatch => {
  pubnub.publish(
    {
      message: {
        type: "cancel-call",
        obj: {
          id: app.loginid,
          conv: convId,
          deviceId: app.randomId,
          name: name
        }
      },
      channel: app["patientsObj"][convId].loginId,
      sendByPost: false,
      storeInHistory: false,
      meta: {
        cool: "meta"
      }
    },
    function(status, response) {}
  );
};

export const blockUser = (convId, app, pubnub) => dispatch => {
  axios({
    method: "post",
    url: "https://${urlAPI}/v1/chat/block_conversation/" + convId,
    data: JSON.stringify({
      block: true
    }),
    headers: {
      authorization: app.usertoken
    }
  })
    .then(res => {
      dispatch({
        type: BLOCK_USER,
        payload: convId,
        resource: app["patients"],
        resourceObj: app["patientsObj"]
      });
    })
    .catch(error => {
      if (error.response.data.error === "Token expired") {
        dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
      }
    });
};

export const unblockUser = (convId, app, pubnub) => dispatch => {
  axios({
    method: "post",
    url: "https://${urlAPI}/v1/chat/block_conversation/" + convId,
    data: JSON.stringify({
      block: false
    }),
    headers: {
      authorization: app.usertoken
    }
  })
    .then(res => {
      dispatch({
        type: UNBLOCK_USER,
        payload: convId,
        resource: app["patients"],
        resourceObj: app["patientsObj"]
      });
    })
    .catch(error => {
      if (error.response.data.error === "Token expired") {
        dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
      }
    });
};

export const muteUser = (convId, app) => dispatch => {
  axios({
    method: "post",
    url: "https://${urlAPI}/v1/chat/mute_conversation/" + convId,
    data: JSON.stringify({
      mute: true
    }),
    headers: {
      authorization: app.usertoken
    }
  })
    .then(res => {
      dispatch({
        type: MUTE_USER,
        payload: convId,
        resource: app["patients"],
        resourceObj: app["patientsObj"]
      });
    })
    .catch(error => {
      if (error.response.data.error === "Token expired") {
        dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
      }
    });
};

export const unmuteUser = (convId, app) => dispatch => {
  axios({
    method: "post",
    url: "https://${urlAPI}/v1/chat/mute_conversation/" + convId,
    data: JSON.stringify({
      mute: false
    }),
    headers: {
      authorization: app.usertoken
    }
  })
    .then(res => {
      dispatch({
        type: UNMUTE_USER,
        payload: convId,
        resource: app["patients"],
        resourceObj: app["patientsObj"]
      });
    })
    .catch(error => {
      if (error.response.data.error === "Token expired") {
        dispatch({ type: PATIENT_LIST_ERROR, payload: "403" });
      }
    });
};

export const sendInVideoCall = (app, pubnub, convId, name) => {
  pubnub.publish(
    {
      message: {
        type: "call-busy",
        obj: {
          id: app.loginid,
          conv: convId,
          deviceId: app.randomId,
          name: name
        }
      },
      channel: app["patientsObj"][convId].loginId,
      sendByPost: false,
      storeInHistory: false,
      meta: {
        cool: "meta"
      }
    },
    function(status, response) {}
  );
};

export const uploadFile = (
  file,
  name,
  app,
  messageId,
  text,
  pubnub,
  convId,
  external_links,
  callback,
  count
) => dispatch => {
  axios({
    method: "post",
    url: "https://${urlAPI}/v1/upload_file?name=" + name,
    data: file.split(",")[1],
    headers: {
      authorization: app.usertoken,
      "content-type": "application/json"
    },
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.floor(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      callback(percentCompleted, count);
    }
  })
    .then(res => {
      //console.log("creating new message");
      return dispatch(
        new_message_handler(
          null,
          null,
          pubnub,
          app,
          true,
          text ? text : name,
          convId,
          res.data.file,
          external_links,
          file
        )
      );
    })
    .catch(error => {
      console.log(error, "during uploading");
      callback(count, -1);
    });
};

export const make_new_msg_count_zero_in_obj = (app, convId) => dispatch => {
  app["patientsObj"][convId].new_msg_count = 0;
};

export const make_shifted_property_false = chats => dispatch => {
  chats[0].shiftedToTop = false;
};

function getWebWorkerResponse(messageType, messagePayload, messageId, convId) {
  return new Promise((resolve, reject) => {
    if (messagePayload[0]) {
      /*console.log('getWebWorkerResponse',messagePayload)
      cryptWorker.postMessage(
        [messageType, messageId].concat(messagePayload)
      );

      const handler = function(e) {
        if (e.data[0] === messageId) {
          e.currentTarget.removeEventListener(e.type, handler);
          resolve(e.data[1]);
        }
      };
      cryptWorker.addEventListener("message", handler); */
      if (messageType === "encrypt")
        resolve(
          CryptoJS.AES.encrypt(messagePayload[0], messagePayload[1]).toString()
        );
      else
        resolve(
          CryptoJS.AES.decrypt(messagePayload[0], messagePayload[1]).toString(
            CryptoJS.enc.Utf8
          )
        );
    } else {
      resolve(convId);
    }
  });
}
