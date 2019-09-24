import React from "react";
import RecievedMessage from "./messageComponents/RecievedMessage";
import SentMessage from "./messageComponents/SentMessage";
import _ from "lodash";
import DateDivider from "./messageComponents/DateDivider";
import Divider from "./Divider";

function renderContent(
  msgList,
  app,
  insertMsgDivider,
  loadingDivider,
  newMessageDivider,
  noOfMsgs
) {
  let insertDivider = true;
  let newMsgList = [];
  let i = 0;
  let prevDate = "";
  let prevTime = "";
  let insertSpace = false;
  let insertNock = true;
  let prevSent = false;
  let lastMessageNock = false;
  let count = 0;
  if (msgList.length !== 0) prevDate = msgList[0].date;

  _.forEach(msgList, m => {
    if (m.date !== prevDate) {
      insertDivider = true;
    } else {
      if (m.updatedAt.substring(11, 16) !== prevTime || m.sent != prevSent) {
        insertSpace = true;
      } else {
        if (m.sent === prevSent) {
          insertNock = false;
        }
      }
    }
    if (insertDivider) {
      newMsgList.push(
        <DateDivider date={m.date} key={m.date} id={"div" + i++} />
      );
      insertDivider = false;
    }
    if (insertSpace) {
      newMsgList.push(
        <div
          key={Math.random() + "".substring(0, 5)}
          style={{ marginTop: 15, marginBottom: 15 }}
        />
      );
      insertSpace = false;
    }
    if (loadingDivider && count === 20) {
      newMsgList.push(<Divider type="Loaded Messages" />);
    }

    if (newMessageDivider && count === noOfMsgs) {
      newMsgList.push(<Divider type="New Messages" />);
    }

    if (count < msgList.length - 1)
      if (
        m.updatedAt.substring(11, 16) !==
          msgList[count + 1].updatedAt.substring(11, 16) ||
        m.sent !== msgList[count + 1].sent
      ) {
        lastMessageNock = false;
      }

    if (count === msgList.length - 1) {
      lastMessageNock = false;
    }

    if (m.sent) {
      newMsgList.push(
        <SentMessage
          message={m.content}
          wordDesc={m.wordDesc}
          sender={m.CreatorId}
          key={m.id}
          id={m.id}
          app={app}
          time={m.updatedAt}
          nock={insertNock}
          file={m.file}
          fileType={m.type}
          lastMessageNock={lastMessageNock}
          offline={m.offline}
        />
      );
    } else {
      newMsgList.push(
        <RecievedMessage
          message={m.content}
          wordDesc={m.wordDesc}
          sender={m.CreatorId}
          key={m.id}
          id={m.id}
          app={app}
          time={m.updatedAt}
          nock={insertNock}
          file={m.file}
          fileType={m.type}
          lastMessageNock={lastMessageNock}
          offline={m.offline}
        />
      );
    }
    prevDate = m.date;
    prevTime = m.updatedAt.substring(11, 16);
    count++;
    insertNock = true;
    prevSent = m.sent;
    lastMessageNock = true;
  });

  if (msgList.length > 0) {
    newMsgList.push(
      <div id="total_divider" key="total_divider" className={i - 1} />
    );
  }

  return newMsgList;
}

class Message extends React.Component {
  render() {
    return (
      <div style={{ width: "97%", marginLeft: "1.5%"}}>
        {renderContent(
          this.props.msgList,
          this.props.app,
          this.props.insertDivider,
          this.props.loadingDivider,
          this.props.newMessageDivider,
          this.props.msgList.length - this.props.noOfMsgs
        )}
      </div>
    );
  }
}

export default Message;
