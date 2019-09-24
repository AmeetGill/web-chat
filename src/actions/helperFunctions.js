import _ from "lodash";
import moment from "moment";
export const processLoadedMessages = (msgList, app) => {
  return _.map(msgList, msg => {
    let sent = app.loginid === msg.creator_id ? true : false;
    let localTime = moment(msg.CreatedAt)
      .local()
      .format("YYYY-MM-DDTHH:mm:ss");
    let set = new Set(msg.external_links.split(","));
    let words = msg.content.split(/[\s,]+/);
    let type = "";
    if (msg.file) {
      let splitedArr = msg.file.split(".");
      type = splitedArr[splitedArr.length - 1];
    }
    let wordDesc = _.map(words, word => {
      if (set.has(word)) {
        return 1;
      } else {
        return 0;
      }
    });
    return {
      content: words,
      wordDesc: wordDesc,
      id: msg.ID,
      sent: sent,
      updatedAt: localTime,
      CreatorId: msg.creator_id,
      ConversationId: msg.conversation_id,
      date: localTime.substring(0, 10),
      file: msg.file,
      type: type
    };
  });
};

export const processSingleMessage = (msg, app, raw_file) => {
  let sent = app.loginid === msg.creator_id ? true : false;
  let localTime = moment(msg.CreatedAt)
    .local()
    .format("YYYY-MM-DDTHH:mm:ss");
  let set = new Set();
  if (msg.external_links) {
    set = new Set(msg.external_links.split(","));
  }
  let words = msg.content.split(/[\s,]+/);
  let type = "";
  if (msg.file) {
    let splitedArr = msg.file.split(".");
    type = splitedArr[splitedArr.length - 1];
  }
  let wordDesc = _.map(words, word => {
    if (set.has(word)) {
      return 1;
    } else {
      return 0;
    }
  });
  return {
    content: words,
    wordDesc: wordDesc,
    id: msg.ID,
    sent: sent,
    updatedAt: localTime,
    CreatorId: msg.creator_id,
    ConversationId: msg.conversation_id,
    date: localTime.substring(0, 10),
    file: raw_file && type !== "pdf" ? raw_file : msg.file,
    type: type
  };
};

export const processSingleOfflineMessage = (
  msg,
  convId,
  app,
  fileLink,
  external_links,
  raw_file,
  offlineMsgId
) => {
  let localTime = moment(new Date())
    .local()
    .format("YYYY-MM-DDTHH:mm:ss");
  let set = new Set(external_links.split(","));
  let words = msg.split(/[\s,]+/);
  let type = "";
  if (fileLink) {
    let splitedArr = fileLink.split(".");
    type = splitedArr[splitedArr.length - 1];
  }

  let wordDesc = _.map(words, word => {
    if (set.has(word)) {
      return 1;
    } else {
      return 0;
    }
  });

  return {
    content: words,
    wordDesc: wordDesc,
    id: Math.random() + "".substring(5),
    sent: true,
    updatedAt: localTime,
    CreatorId: app.loginid,
    ConversationId: convId,
    date: localTime.substring(0, 10),
    file: raw_file && type !== "pdf" ? raw_file : fileLink,
    type: type,
    file_link: fileLink,
    external_links: external_links,
    offline: true,
    offlineMsgId: offlineMsgId
  };
};

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const sortByMessage = list => {
  list.sort(function(a, b) {
    let mes1 =
      a.LastMessageContent.UpdatedAt.substring(0, 4) +
      a.LastMessageContent.UpdatedAt.substring(5, 7) +
      a.LastMessageContent.UpdatedAt.substring(8, 10) +
      a.LastMessageContent.UpdatedAt.substring(11, 13) +
      a.LastMessageContent.UpdatedAt.substring(14, 16) +
      a.LastMessageContent.UpdatedAt.substring(17, 19);

    let mesb =
      b.LastMessageContent.UpdatedAt.substring(0, 4) +
      b.LastMessageContent.UpdatedAt.substring(5, 7) +
      b.LastMessageContent.UpdatedAt.substring(8, 10) +
      b.LastMessageContent.UpdatedAt.substring(11, 13) +
      b.LastMessageContent.UpdatedAt.substring(14, 16) +
      b.LastMessageContent.UpdatedAt.substring(17, 19);

    return mesb - mes1;
  });
  return list;
};

export const createUserObjectWithId = (app, pList) => {
  let newObj = {}
  let newObj1 = {}
  let newMsgConvs = null;
  if(localStorage.getItem('newMsgConvs')){
    newMsgConvs = JSON.parse(localStorage.getItem('newMsgConvs'));
  }

  _.forEach(pList, chat => {
    let enterdIf = false;
    if(newMsgConvs){
      if(newMsgConvs[chat.ID]){
        chat.new_msg_count = newMsgConvs[chat.ID];
        enterdIf = true;
      }
    }
    newObj[chat.ID] = {
      name: chat.FirstName + " " + chat.LastName,
      convId: chat.ID,
      blocked: chat.Blocked,
      muted: chat.Muted,
      img: chat.ImageURL,
      loginId: chat.login_id,
      new_msg_count: enterdIf ? newMsgConvs[chat.ID] : 0,
      online: false,
      encryptionToken: chat.encryption_token ? chat.encryption_token : "ewf3feggete5565tg55yt7hhze"
    };
    newObj1[chat.UserID] = {
      convId: chat.ID
    }
  });
  //console.log(pList)
  app["patientsObj"] = newObj
  app["UserToConv"] = newObj1
  localStorage.setItem('newMessages',0);
  localStorage.setItem('newMsgConvs',null);
};
