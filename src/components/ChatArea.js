import React from "react";
import Header from "./chatAreaComponents/Header";
import Message from "./chatAreaComponents/Message";
import Input from "./chatAreaComponents/Input";
import $ from "jquery";
import { connect } from "react-redux";
import * as actions from "../actions";
import { notification, Button, Icon, Card, Spin } from "antd";
import Divider from "./chatAreaComponents/Divider";
import chatPreloader from "../index.svg";
import DateDivider from "./chatAreaComponents/messageComponents/DateDivider";

let prevUserBeforeVideoCall = "";

class ChatArea extends React.Component {
  static scroll = true;
  static height = 0;
  static dividerLength = "0";
  static dividerType = "Load Messages";
  static totalDateDivider = 0;
  state = { loadingMessages: false, width: "26%" };
  static set = new Set();
  static dividerHeightArr = [];
  static currentDivider = "";
  static currentDividerIndex = 0;

  scrollToBottom() {
    let elem = $("#messages");
    elem.animate({ scrollTop: elem[0].scrollHeight }, 10);
  }

  scrollToElement(elementId) {
    let elem = $("#messages");
    //if(ChatArea.dividerType !== "Load Messages"){
      //this.scrollToBottom()
      //return
   // }
    try {
      let new_msgs = this.checkIfUserHaveNewMessage(
            this.props.user.convId,
            this.props
          );
      elem.animate(
        {
          scrollTop:
            ChatArea.dividerType === "Load Messages"
              ? $(`#${elementId}`).offset().top - 500
              : window.isTabOpened ? $(`#${elementId}`).offset().top - 200 :  elem[0].scrollHeight - new_msgs*60 
        },
        10
      );
    } catch (error) {
      if (ChatArea.scroll)
        elem.animate({ scrollTop: elem[0].scrollHeight }, 10);
      else ChatArea.scroll = true;
    }
    if (
      ChatArea.dividerHeightArr.length === 1 &&
      elem[0].clientHeight !== elem[0].scrollHeight
    ) {
      $("#scrollDivider").html(ChatArea.dividerHeightArr[0].name);
      $("#scrollDivider").css({
        "font-size": "17px"
      }); // to avoid divider where there is no scroll bar
      $("#scrollDividerParent").css("width", "97%");
      ChatArea.currentDivider = ChatArea.dividerHeightArr[0].name;
      ChatArea.currentDividerIndex = 0;
    }
  }

  createDividerHeightArr() {
    ChatArea.dividerHeightArr = [];
    for (let i = ChatArea.totalDateDivider; i >= 0; i--) {
      let elem = $(`#div${i}`);
      ChatArea.dividerHeightArr.push({
        name: elem.attr("class"),
        height:
          elem[0].offsetTop -
          elem[0].offsetHeight -
          elem[0].scrollHeight -
          elem[0].clientHeight
      });
    }
  }

  checkIfUserHaveNewMessage(convId, newProps) {
    if (
      newProps.app["patientsObj"][convId] &&
      newProps.app["patientsObj"][convId].new_msg_count
    )
      return newProps.app["patientsObj"][convId].new_msg_count;
    else return 0;
  }

  scrollHeightFromBottom(toSet) {
    let height = 0;
    //for scrolling down
    $("#messages div").each(function() {
      height += parseInt($(this).height(), 10);
    });
    return height;
  }
  //
  componentDidMount() {
    let _this = this;

    $("#messages").on("scroll", function() {
      let scrollTop = document.getElementById("messages").scrollTop;
      if (scrollTop === 0) {
        ChatArea.scroll = false;
        if (!_this.props.enablePreloader) {
          _this.props
            .load_messages(
              _this.props.user.convId,
              _this.props.msgList.length + 20,
              _this.props.app
            )
            .then(() => {
              ChatArea.scroll = true;
            });
          _this.setState({ loadingMessages: true });
        }
      } else {
        //console.log(scrollTop,ChatArea.dividerHeightArr)
        if (ChatArea.dividerHeightArr.length > 0) {
          if (
            (ChatArea.dividerHeightArr[ChatArea.currentDividerIndex] &&
              scrollTop <=
                ChatArea.dividerHeightArr[ChatArea.currentDividerIndex].height +
                  40) ||
            (ChatArea.dividerHeightArr[ChatArea.currentDividerIndex - 1] &&
              scrollTop >=
                ChatArea.dividerHeightArr[ChatArea.currentDividerIndex - 1]
                  .height +
                  40)
          ) {
            for (let i = ChatArea.totalDateDivider; i >= 0; i--) {
              if (
                i === 0 &&
                ChatArea.totalDateDivider !== ChatArea.currentDividerIndex
              ) {
                $("#scrollDivider").html(ChatArea.dividerHeightArr[i].name);
                $("#scrollDivider").css({
                  "font-size": "17px"
                }); // to avoid divider where there is no scroll bar
                $("#scrollDividerParent").css("width", "97%");
                ChatArea.currentDivider = ChatArea.dividerHeightArr[i].name;
                ChatArea.currentDividerIndex = i;
                break;
              }
              if (
                i > 0 &&
                scrollTop >= ChatArea.dividerHeightArr[i].height + 40 &&
                scrollTop <= ChatArea.dividerHeightArr[i - 1].height + 40
              ) {
                $("#scrollDivider").html(ChatArea.dividerHeightArr[i].name);
                $("#scrollDivider").css({
                  "font-size": "17px"
                }); // to avoid divider where there is no scroll bar
                $("#scrollDividerParent").css("width", "97%");
                ChatArea.currentDivider = ChatArea.dividerHeightArr[i].name;
                ChatArea.currentDividerIndex = i;
                break;
              }
            }
          }
        }
      }
    });
    this.props.pubnub.addListener({
      presence: function(presenceEvent) {
        //console.log('presence event came in: ', presenceEvent)
      },
      message: function(m) {
        var msg = m.message; // The Payload
       console.log("csdfffffffffffffff", m);
        if (msg.type === "newMessage") {
          if (!msg.randomId || msg.randomId !== _this.props.app.randomId)
            if (!ChatArea.set.has(msg.obj.ID)) {
              // console.log("newMessage recieved", msg);
              _this.props.new_message(
                _this.props.pubnub,
                _this.props.app,
                false,
                msg,
                _this.props.user.convId
                  ? _this.props.user.convId
                  : prevUserBeforeVideoCall
              );
              ChatArea.set.add(msg.obj.ID);
            }
        } else if (msg.type === "call") {
          if (_this.props.app["patientsObj"][msg.obj.chat].blocked) {
            return;
          }
          if (
            msg.obj.id !== _this.props.app.loginid &&
            _this.props.mode !== "video"
          ) {
            document.getElementById("video-noti-sound").play();
            //_this.props.sendCallRecieved(
            //  _this.props.app,
            //  _this.props.pubnub,
            //  msg.obj.chat
            //);
            if(!window.isTabOpened){
              let notification = new Notification(msg.obj.name+ " is calling you");
            }
            this.tt1 = setTimeout(() => {
              notification.close("called");
            }, 25000);
            notification.info({
              placement: "topRight",
              bottom: 50,
              key: "called",
              duration: 0,
              onClose: () => {
                document.getElementById("video-noti-sound").pause();
                _this.props.rejectCall(
                  _this.props.pubnub,
                  msg.obj.chat,
                  _this.props.app
                );
              },
              description: (
                <Card bordered={false}> {msg.obj.name} Calling</Card>
              ),
              icon: (
                <Icon type="phone" style={{ fontSize: 46, color: "#08c" }} />
              ),
              btn: (
                <Button.Group>
                  <Button
                    type="primary"
                    onClick={() => {
                      _this.props.sendCallOk(
                        _this.props.pubnub,
                        msg.obj.chat,
                        _this.props.app,
                        msg.obj.id,
                        msg.obj.name+ " is calling you",
                        msg.obj.deviceId
                      );
                      document.getElementById("video-noti-sound").pause();
                      notification.close("called");
                      clearTimeout(_this.tt1);
                    }}
                  >
                    Accept
                  </Button>

                  <Button
                    type="danger"
                    onClick={() => {
                      _this.props.rejectCall(
                        _this.props.pubnub,
                        msg.obj.chat,
                        _this.props.app
                      );
                      document.getElementById("video-noti-sound").pause();
                      notification.close("called");
                      clearTimeout(_this.tt1);
                    }}
                  >
                    Reject
                  </Button>
                </Button.Group>
              )
            });
          } else {
            if (
              msg.obj.id !== _this.props.app.loginid &&
              _this.props.mode === "video"
            ) {
              let convIdCal = _this.props.user.convId
                ? _this.props.user.convId
                : prevUserBeforeVideoCall;
              if (parseInt(convIdCal) !== parseInt(msg.obj.chat)) {
                notification.info({
                  placement: "topRight",
                  bottom: 50,
                  key: "secondCall",
                  duration: 0,
                  description: msg.obj.name + " trying to call you"
                });
                _this.props.sendInVideoCall(
                    _this.props.app,
                    _this.props.pubnub,
                    msg.obj.chat,
                    _this.props.app.name
                  );
              }
            }
          }
        } else if (msg.type === "call-ok") {
          console.log("fgjjl0",msg.obj);
          if (_this.props.mode !== "video") {
            console.log("fgjjl0",msg.obj);
            if (msg.obj.id === _this.props.app.loginid) {
              if (_this.props.app.randomId !== msg.obj.deviceId) {
                notification.close("called");
                clearTimeout(_this.tt1);
                document.getElementById("video-noti-sound").pause();
                return;
              }
            } else {
              if (_this.props.app.randomId !== msg.obj.callerDeviceId) {
                return;
              }
            }
            prevUserBeforeVideoCall = msg.obj.chat;
            _this.props.load_messages(msg.obj.chat, 20, _this.props.app);
            //console.log("callerid check",msg,_this.props.app.loginid);
            if (
              parseInt(msg.obj.callerId) === parseInt(_this.props.app.loginid)
            )
              _this.props.change_user(
                {
                  img: _this.props.app["patientsObj"][msg.obj.chat].img,
                  name: _this.props.app["patientsObj"][msg.obj.chat].name,
                  convId1: msg.obj.id,
                  convId: msg.obj.chat,
                  meCalling: true,
                  muted: _this.props.app["patientsObj"][msg.obj.chat].muted,
                  blocked: _this.props.app["patientsObj"][msg.obj.chat].blocked,
                  loginId: msg.obj.id
                },
                _this.props.app
              );
            else
              _this.props.change_user(
                {
                  img: _this.props.app["patientsObj"][msg.obj.chat].img,
                  name: _this.props.app["patientsObj"][msg.obj.chat].name,
                  convId1: msg.obj.callerId,
                  convId: msg.obj.chat,
                  meCalling: false,
                  muted: _this.props.app["patientsObj"][msg.obj.chat].muted,
                  blocked: _this.props.app["patientsObj"][msg.obj.chat].blocked,
                  loginId: msg.obj.id
                },
                _this.props.app
              );
           // if (_this.props.app.loginid !== msg.obj.id)
             // _this.props.pubnub.subscribe({
             //   channels: [msg.obj.id, "vid" + msg.obj.id]
             // });
            //else
              //_this.props.pubnub.subscribe({
              //  channels: [msg.obj.callerId, "vid" + msg.obj.callerId]
              //});
            _this.props.switchToVideo();
          }
        } else if (msg.type === "call-stop") {
          if (msg.obj.convId && _this.props.mode === "video") {
            if (msg.obj.id !== _this.props.app.loginid){
             // _this.props.pubnub.unsubscribe({
              //  channels: 
              console.log('stoping call',window.movedDirectlyToVideo);
              if(window.movedDirectlyToVideo){

                window.location.reload(true);
              }
              else{
                _this.props.switchToChat();
              }
            }
          }
        } else if (msg.type === "edit-message") {
          _this.props.edit_message(
            false,
            msg,
            _this.props.pubnub,
            _this.props.user.convId,
            _this.props.app
          );
        } else if (msg.type === "cancel-call") {
          if (msg.obj.id !== _this.props.app.loginid) {
            notification.close("called");
            clearTimeout(_this.tt1);
            document.getElementById("video-noti-sound").pause();
            notification.warning({
              placement: "topRight",
              bottom: 50,
              duration: 5,
              title: " Not Able To Connect",
              description: msg.obj.name + " canceled the call"
            });
          }
        } else if (msg.type === "call-busy") {
          if (msg.obj.id !== _this.props.app.loginid) {
            notification.close("called");
            clearTimeout(_this.tt1);
            notification.warning({
              placement: "topRight",
              bottom: 50,
              duration: 5,
              title: " Not Able To Connect",
              description: msg.obj.name + " is currently in another call"
            });
          }
        }
      }
    });
   // console.log('starting call',_this.props.moveDirectlyToVideo);
    if(this.props.moveDirectlyToVideo){
      setTimeout(() => {
        this.props.sendCallOk(
          this.props.pubnub,
          this.props.callerConvId,
          this.props.app,
          this.props.callerLoginId,
          this.props.app.name,
          this.props.callerDeviceId
        );
      }, 7000);
    }

  }

  componentWillReceiveProps(newProps) {
    this.setState({ loadingMessages: false });
    if (
      this.state.loadingMessages &&
      this.props.user.convId === newProps.user.convId &&
      this.props.msgList.length !== newProps.msgList.length
    ) {
      ChatArea.dividerLength = "20";
      ChatArea.dividerType = "Loaded Messages";
    } else {
      if (
        this.state.loadingMessages &&
        this.props.user.convId === newProps.user.convId &&
        this.props.msgList.length === newProps.msgList.length
      ) {
        ChatArea.scroll = false;
      } else {
        if (!this.state.loadingMessages) {
          let new_msgs = this.checkIfUserHaveNewMessage(
            newProps.user.convId,
            newProps
          );
          if (new_msgs !== 0) {
            ChatArea.dividerLength = "" + new_msgs;
            ChatArea.dividerType = "New Messages";
          }
        }
      }
    }
  }

  componentWillUpdate() {
    if (
      document.getElementById("messages").scrollHeight <=
      document.getElementById("messages")
    )
      ChatArea.currentDivider = "";
  }

  componentDidUpdate(oldProps, oldState) {
    ChatArea.totalDateDivider = parseInt($("#total_divider").attr("class"));
    ChatArea.currentDividerIndex = 0;
    this.createDividerHeightArr();
    if (this.props.mode !== "video" && window.isTabOpened && this.props.user)
      this.props.make_new_msg_count_zero_in_obj(
        this.props.app,
        this.props.user.convId
      );
    if (!this.state.loadingMessages) {
      /*if (ChatArea.scroll) {
        let height = this.scrollHeightFromBottom(true);
        this.scrollToBottom(height);
      } else {
        //let newHeight = this.scrollHeightFromBottom(false);
        //let toScrollHeight = newHeight - ChatArea.height;
        //this.scrollToBottom(toScrollHeight);
        this.scrollToElement("divider");
        //ChatArea.height = newHeight;
      }
    } */
      this.scrollToElement("divider");
    }
  }

  renderMessages() {
    let slice1 = [];
    let slice2 = [];

    if (ChatArea.dividerLength === "0" || this.props.mode === "video") {
      return (
        <Message
          app={this.props.app}
          msgList={this.props.msgList.slice().reverse()}
          insertDivider={true}
        />
      );
    }

    if (this.props.msgList.length === 0) {
      return undefined;
    }
    let newArray = this.props.msgList.slice().reverse();

    if (ChatArea.dividerType === "Loaded Messages") {
      ChatArea.dividerLength = "0";
      return (
        <Message
          app={this.props.app}
          msgList={newArray}
          insertDivider={true}
          loadingDivider={true}
        />
      );
    }
    let noOfMsgs = parseInt(ChatArea.dividerLength, 10);
    ChatArea.dividerLength = "0";
    return (
      <Message
        app={this.props.app}
        msgList={newArray}
        insertDivider={true}
        newMessageDivider={true}
        noOfMsgs={noOfMsgs}
      />
    );
  }
  render() {
    let video = false;
    if (this.props.width === "4") {
      video = true;
    }

    return (
      <div
        style={{
          height: "100%",
          marginLeft: 20,
          backgroundColor: "#ffffff",
          width: this.props.video ? "23%" : "calc(100% - 532px)"
        }}
      >
        {this.props.mode !== "video" ? (
          <Header
            showIcons={!video}
            app={this.props.app}
            isMobile={this.props.isMobile}
            deviceFetchError={this.props.deviceFetchError}
          />
        ) : (
          <div>
            <h2
              style={{
                fontSize: "1.3em",
                fontFamily: "Montserratlight, sans-serif",
                marginTop: "8%"
              }}
            >
              Chat Records
            </h2>
          </div>
        )}
        {/* <button
            style={{
              padding: 0,
              border: "none",
              background: "none",
              position:"absolute",
              left:"92.5%",
              top:"78%",
              fontSize:33,
              zIndex:10
            }}
            onClick = {this.scrollToBottom}
          >
            <i className="fa fa-chevron-circle-down" />
          </button>

        */}
        {!this.state.loadingMessages &&
        !this.props.enablePreloader &&
        this.props.user.convId ? (
          <div
            id="scrollDividerParent"
            style={{
              width: "0%",
              marginLeft: "1.05%",
              height: 24,
              borderBottom: " 0px solid #888",
              backgroundColor: "white",
              textAlign: "center",
              position: "sticky",
              zIndex: 2
            }}
          >
            <span
              id="scrollDivider"
              style={{
                fontSize: "0px",
                padding: "0px 8px",
                color: "black",
                paddingTop: 12,
                fontWeight: 500
              }}
            />
          </div>
        ) : (
          undefined
        )}

        <div
          id="messages"
          style={{
            height: this.props.isMobile ? "79%" : "calc(100% - 165px)",
            overflowY: "scroll",
            overflowX: "hidden",
            width: "100%",
            position: "relative",
            paddingBottom: "10px"
          }}
        >
          {this.state.loadingMessages ? (
            <div
              style={{
                marginLeft: this.props.isMobile ? "45%" : "48%",
                marginTop: 23,
                position: "absolute",
                zIndex: 10,
                backgroundColor: "white",
                height: 55,
                width: 55,
                borderRadius: 28
              }}
            >
              <div
                class="preloader-wrapper small active"
                style={{ marginTop: 10, marginLeft: 10 }}
              >
                <div class="spinner-layer spinner-green-only">
                  <div class="circle-clipper left">
                    <div class="circle" />
                  </div>
                  <div class="gap-patch">
                    <div class="circle" />
                  </div>
                  <div class="circle-clipper right">
                    <div class="circle" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            undefined
          )}

          {this.props.enablePreloader ? (
            <img
              style={{
                marginLeft: this.props.isMobile ? "30%" : "40%",
                marginTop: this.props.isMobile ? "23%" : "13%"
              }}
              src={chatPreloader}
              alt="Loading"
            />
          ) : (
            this.renderMessages(this.props.enablePreloader)
          )}
          <div id="divider-aux" />
        </div>
        <Input
          app={this.props.app}
          isMobile={this.props.isMobile}
          video={this.props.video}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    msgList: state.msgs,
    pubnub: state.pubnub,
    mode: state.mode
  };
}

export default connect(
  mapStateToProps,
  actions
)(ChatArea);

