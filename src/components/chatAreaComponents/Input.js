import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import $ from "jquery";
import { Button, Row, Col, message, Progress } from "antd";
import Popup from "reactjs-popup";
import FilePreview from "./FilePreview";
import _ from "lodash";
import "./Input.css";

let characterLeft = 2000;
let maxCharacter = 2000;

class Input extends React.Component {
  state = {
    msg: "",
    typing: false,
    meTyping: false,
    openBlockWarning: false,
    newMsgBlocked: false,
    files: [],
    filesInfo: [],
    showFilesPreview: false,
    uploadingFile: false,
    uploadProgress: 0
  };

  static progressList = [];
  static progrssSet = new Set();

  returnAvgProgress = () => {
    let progressPercent = 0;
    let enteredIf = false;
    let count = 0;
    _.forEach(Input.progressList, progress => {
      if (progress === -1) {
        message.error(
          "Fail to upload File " +
            this.state.filesInfo[count] +
            "\n Please Try again",
          5
        );
      } else {
        if (progress !== 100 && progress !== 0) {
          progressPercent += progress;
          count++;
          enteredIf = true;
        }
      }
    });
    if (!enteredIf) {
      //console.log("upload complete", Input.progressList);
      this.setState({ uploadingFile: false });
      Input.progressList = [];
      return 100;
    } else {
      return Math.floor(progressPercent / count);
    }
  };

  is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }
  constructor() {
    super();
    this.checkIfKeyIsEnter = this.checkIfKeyIsEnter.bind(this);
    this.timer = setInterval(() => {
      this.stopTyping();
    }, 1000);
  }
  stopTyping = () => {
    this.setState({
      meTyping: false
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    $("#msg_input").prop("disabled", true);
  }

  returnExternalLinks = words => {
    let external_links = "";
    _.forEach(words, word => {
      if (this.is_url(word)) {
        external_links += word + ",";
      }
    });
    return external_links.substring(0, external_links.length - 1);
  };

  checkIfAllZero = () => {
    for (let i = 0; i < Input.progressList.length; i++) {
      if (
        Input.progressList[i] !== 0 ||
        isNaN(Input.progressList[i]) ||
        Input.progressList[i] !== 100
      ) {
        return false;
      }
    }

    Input.progressList = [];
    return true;
  };

  updateUploadProgress = (progress, count) => {
    Input.progressList[count] = progress;
    this.setState({
      uploadProgress: this.returnAvgProgress()
    });
  };

  sendMessage = event => {
    if (event) event.preventDefault();

    if (this.props.user.blocked) {
      this.setState({ openBlockWarning: true });
    } else {
      let toSend = this.state.msg;
      let words = toSend.split(/[\s,]+/);
      let external_links = this.returnExternalLinks(words);
      if (toSend.length > 0) {
        characterLeft = maxCharacter;
        $("textarea").val("");
        this.props.new_message_handler(
          null,
          null,
          this.props.pubnub,
          this.props.app,
          true,
          toSend,
          this.props.user.convId,
          null,
          external_links
        );
      }
    }
  };

  handleCancel = () => {
    this.setState({ openBlockWarning: false });
  };

  fileUpload = e => {
    let files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].size <= 5000000) {
        if (
          e.target.files[i].type === "image/png" ||
          e.target.files[i].type === "image/jpeg" ||
          e.target.files[i].type === "application/pdf"
        ) {
          let reader = new FileReader();
          reader.onload = function(event) {
            files.push(event.target.result);
          };
          reader.readAsDataURL(e.target.files[i]);
        } else {
          files.push(12);
        }
      } else {
        files.push(null);
      }
    }
    this.setState({
      showFilesPreview: true,
      files: files,
      filesInfo: e.target.files
    });
  };

  handleUnblock = () => {
    this.setState({ openBlockWarning: false });
    this.props.unblockUser(
      this.props.user.convId,
      this.props.app,
      this.props.pubnub
    );
  };

  handleFilePreviewClose = (comment, closed) => {
    this.setState({ showFilesPreview: false });
    if (!closed) {
      Input.progressList = [];
      for (let i = 0; i < this.state.files.length; i++) {
        Input.progressList.push(0);
      }
      let external_links = "";
      if (comment) {
        external_links = this.returnExternalLinks(comment.split(/[\s,]+/));
      }
      let count = 0;
      _.map(this.state.files, file => {
        if (typeof file === "string") {
          //console.log(file, "sending file");
          this.setState({ uploadingFile: true });
          this.props.uploadFile(
            file,
            this.state.filesInfo[count].name,
            this.props.app,
            "",
            count === 0 ? comment : "",
            this.props.pubnub,
            this.props.user.convId,
            external_links,
            this.updateUploadProgress,
            count
          );
        }
        count++;
      });
    }
  };

  handleChange = event => {
    clearInterval(this.timer);
    let len = event.target.value.length;
    let strMsg = event.target.value;
    if (maxCharacter - len < 0) {
      strMsg = strMsg.substring(0, maxCharacter);
    }
    characterLeft = maxCharacter - strMsg.length;
    this.setState({ msg: strMsg, meTyping: true });
    this.timer = setInterval(() => {
      this.stopTyping();
    }, 1500);
  };
  componentWillReceiveProps(newProps) {
    $("#msg_input").prop("disabled", false);
    if (newProps.err === "USER_BLOCKED") {
      message.error("You Are Blocked by the User", 3);
    }
  }
  componentWillUpdate(newProps, newStates) {
    if (newStates.meTyping === true && this.state.meTyping === false) {
      this.props.pubnub.publish(
        {
          message: {
            type: "user-typing",
            obj: {
              id: this.props.app.userid,
              loginid: this.props.app.loginid
            }
          },
          channel: this.props.user.convId,
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
    }
    //
    if (newStates.meTyping === false && this.state.meTyping === true) {
      this.props.pubnub.publish(
        {
          message: {
            type: "user-stoped-typing",
            obj: {
              id: this.props.app.userid,
              loginid: this.props.app.loginid
            }
          },
          channel: this.props.user.convId,
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
    }
  }

  checkIfKeyIsEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.sendMessage();
    }
  }

  componentDidMount() {
    $("#msg_input").prop("disabled", true);
    if (this.props.user.convId !== "") {
      // when mode changes to video
      $("#msg_input").prop("disabled", false);
    }
    let _this = this;
    this.props.pubnub.addListener({
      message: function(m) {
        var msg = m.message; // The Payload
        if (
          msg.type === "user-typing" &&
          m.channel === _this.props.user.convId &&
          msg.obj.loginid !== _this.props.app.loginid
        ) {
          _this.setState({ typing: true });
        } else if (
          msg.type === "user-stoped-typing" ||
          msg.type === "newMessage"
        ) {
          _this.setState({ typing: false });
        }
      }
    });
  }

  render() {
    return (
      <div
        className="form-field"
        style={{
          width: this.props.video ? "23%" : "calc(95% - 530px)",
          marginLeft: this.props.video ? "-1.5%" : "2%",
          marginTop: "25%"
        }}
      >
        <Popup
          open={this.state.openBlockWarning}
          contentStyle={{ width: 340, height: 187 }}
          closeOnDocumentClick={false}
        >
          <div>
            <div
              style={{
                marginLeft: "10%",
                marginRight: "10%",
                marginTop: "10%"
              }}
            >
              <p>
                You have blocked this user <br />
                To send a message unblock the user
              </p>
            </div>

            <Row>
              <Col span={7} />
            </Row>
            <Row>
              <Button
                style={{
                  marginLeft: "22%",
                  backgroundColor: "#54B1D2",
                  color: "white"
                }}
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                style={{
                  marginLeft: "5%",
                  width: "25%",
                  backgroundColor: "#54B1D2",
                  color: "white"
                }}
                onClick={this.handleUnblock}
              >
                {" "}
                Unbock{" "}
              </Button>
            </Row>
          </div>
        </Popup>
        <section>
          <textarea
            // className="form-control"
            id="msg_input"
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder="Type new message here...."
            onKeyPress={this.checkIfKeyIsEnter}
            style={{ overflowY: "scroll", resize: "none" }}
            maxlength="2000"
          />
          {this.props.user.convId !== "" ? (
            !this.state.uploadingFile || isNaN(this.state.uploadProgress) ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ cursor: "pointer", marginBottom: 0 }}>
                  <i
                    style={{
                      fontSize: 16,
                      marginRight: 15
                    }}
                    className="fas fa-paperclip"
                  />
                  <input
                    type="file"
                    onChange={this.fileUpload}
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg,image/jpg,application/pdf"
                    multiple="multiple"
                  />{" "}
                </label>
              </div>
            ) : (
              <Progress
                type="circle"
                percent={this.state.uploadProgress}
                width={this.props.isMobile ? 20 : 43}
                style={{
                  marginLeft: this.props.isMobile ? 2 : 25,
                  top: "5%",
                  left: "86%",
                  position: "absolute"
                }}
              />
            )
          ) : (
            undefined
          )}
        </section>
        <FilePreview
          showFilesPreview={this.state.showFilesPreview}
          files={this.state.files}
          onClose={this.handleFilePreviewClose}
          filesInfo={this.state.filesInfo}
        />
        <span
          id="character-counter"
          style={{ display: "block", float: "right" }}
        >
          {" "}
          {characterLeft}{" "}
        </span>
        <div style={{ marginLeft: "12%" }}>
          {this.props.user.convId !== ""
            ? this.state.typing
              ? this.props.user.name + " is typing "
              : undefined
            : undefined}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pubnub: state.pubnub,
    user: state.user,
    err: state.err
  };
}

export default connect(
  mapStateToProps,
  actions
)(Input);
