import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions";
import { Icon } from "antd";
import Image from "./Image";
import _ from "lodash";
import Document from "./Document";
import Popup from "reactjs-popup";
import $ from 'jquery';

import "./InnerBox.css";

class InnerBox extends React.Component {
  state = { content: "", edit: false, showOptions: false };
  static backUp = "";
  constructor() {
    super();
    this.checkIfKeyIsEnter = this.checkIfKeyIsEnter.bind(this);
  }

  convertTime(givenTime) {
    //2018-07-02T09:45:09.844Z

    let time = givenTime ? givenTime : new Date();
    let hours = givenTime
      ? parseInt(time.substring(11, 13), 10)
      : parseInt(time.getHours(), 10);
    let minutes = givenTime ? time.substring(14, 16) : time.getMinutes();
    return (
      (hours % 12 === 0 ? 12 : hours % 12) +
      ":" +
      minutes +
      " " +
      (hours >= 12 ? "PM" : "AM")
    );
  }

  componentDidUpdate() {
    this.nameInput ? this.nameInput.focus() : null;
    if(this.state.edit){
      $("#msg_input").prop("disabled", true);
    }
    else{
      $("#msg_input").prop("disabled", false);
    }
  }

  moveCaretAtEnd(e) {
    let temp_value = e.target.value;
    e.target.value = "";
    e.target.value = temp_value;
  }

  checkIfKeyIsEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.sendToServer();
    }
    if (e.keyCode === 27) {
      //escape key
      this.setState({ edit: false, content: InnerBox.backUp });
    }
  }
  componentWillMount() {
    this.setState({ content: this.props.message });
  }
  componentWillReceiveProps(newProps) {
    this.setState({ content: newProps.message });
  }
  handleEdit = () => {
    InnerBox.backUp = this.state.content.slice();
    this.setState({ edit: true });
  }
  handleChange = event => {
    this.setState({ content: event.target.value });
  }

  shouldComponentUpdate() {
    return true;
  }

  renderMsgContent() {
    let count = 0;
    return _.map(this.state.content, word => {
      if (this.props.wordDesc[count] === 1) {
        count++;
        return (
          <a
            href={
              !word.startsWith("http://") && !word.startsWith("https://")
                ? "http://" + word
                : word
            }
            target="_blank"
            style={{ textDecoration: "underline" }}
          >
            {word}
          </a>
        );
      } else {
        count++;
        return " " + word + " ";
      }
      
    });
  }

  is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str.toLowerCase())) {
      return true;
    } else {
      return false;
    }
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

  sendToServer = () => {
    if(this.state.content.length > 0){
      let toSend = this.state.content;
      let words = toSend.split(/[\s,]+/);
      this.setState({ edit: false , content : words});
      let external_links = this.returnExternalLinks(words);
      this.props.edit_message(
        true,
        { content: this.state.content, external_links:external_links  ,id: this.props.id },
        this.props.pubnub,
        this.props.user.convId,
        this.props.app,
      );
    }
  };

  render() {
    if (this.state.edit) {
      return (
        <div className="form-group">
          <textarea
            className="form-control"
            type="text"
            id="textarea_edit"
            onFocus={this.moveCaretAtEnd}
            value={typeof this.state.content !== "string" ? this.state.content.join(" ") : this.state.content}
            onChange={this.handleChange}
            onKeyPress={this.checkIfKeyIsEnter}
            onKeyDown={this.checkIfKeyIsEnter}
            style={{resize:'none'}}
            ref={input => {
              this.nameInput = input;
            }} 
          />
          <a
            href="#!"
            id="edit_msg"
            onClick={() => {
              this.setState({
                edit: false,
                content: InnerBox.backUp,
                showOptions: false
              });
            }}
            style={{
              marginTop: "2%",
              display: "inline",
              marginRight: "6%"
            }}
            className="secondary-content"
          >
            <i className="material-icons">cancel</i>
          </a>
          <a
            href="#!"
            id="edit1_msg"
            onClick={this.sendToServer}
            style={{ marginTop: "2%", display: "inline" }}
            className="secondary-content"
          >
            <i className="material-icons">check</i>
          </a>
        </div>
      );
    }
    let border = this.props.sent
      ? "15px " +
        (!this.props.nock ? "0px " : "15px ") +
        (!this.props.lastMessageNock ? "15px " : "0px ") +
        "15px"
      : (!this.props.nock ? "0px " : "15px ") +
        "15px 15px " +
        (!this.props.lastMessageNock ? "15px" : "0px");
    if(!this.props.sent){
      return(
        <div
          style={{
            borderRadius: border,
            maxWidth: "90%",
            padding: "15px 15px 5px 15px",
            float: this.props.sent ? "right" : "left",
            marginTop: 2,
            marginBottom: 1,
          }}
          className={`card ${
            !this.props.sent ? "recieved-message" : this.props.offline ? "grey" : "sent-message"
          } darken-1`}
        >
        {this.props.file ? (
          this.props.fileType === "pdf" ? (
            <Document file={this.props.file} />
          ) : (
            <Image file={this.props.file} border={border} />
          )
        ) : (
          undefined
        )}
        <div
          style={{
            borderRadius: "15px",
            padding: "0px",
            position: "relative"
          }}
          className={`card-content ${
            !this.props.sent ? "black" : "black"
          }-text`}
        >
          <span className="message-content" style={{color: this.props.sent ? "black" : "white" }}>{this.renderMsgContent()}</span>
          <span
            style={{
              fontSize: "70%",
              marginLeft: 16,
              marginTop: 17,
              float: "right",
              color: this.props.sent ? "#444444" : "#444444"
            }}
          >
            {this.convertTime(this.props.time)}
          </span>
        </div>
      </div>
      );
    }
    return (
      <Popup
        on= {this.props.fileType ? "" : "hover" }
        position="left top"
        contentStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: "auto",
          width: "auto",
        }}
        trigger={
          <div
            style={{
              borderRadius: border,
              maxWidth: "90%",
              padding: "15px 15px 5px 15px",
              float: this.props.sent ? "right" : "left",
              marginTop: 2,
              marginBottom: 1,
            }}
            className={`card ${
              !this.props.sent ? "recieved-message" : this.props.offline ? "white" : "sent-message"
            } darken-1`}
          >
            {this.props.file ? (
              this.props.fileType === "pdf" ? (
                <Document file={this.props.file} />
              ) : (
                <Image file={this.props.file} border={border} />
              )
            ) : (
              undefined
            )}
            <div
              style={{
                borderRadius: "15px",
                padding: "0px",
                position: "relative"
              }}
              className={`card-content ${
                !this.props.sent ? "black" : "black"
              }-text`}
            >
              <span className="message-content" style={{color: this.props.offline ? "#444444" :"white"}}>{this.renderMsgContent()}</span>
              <span
                style={{
                  fontSize: "70%",
                  marginLeft: 16,
                  marginTop: 17,
                  float: "right",
                  color: this.props.sent ? "#444444" : "#444444"
                }}
              >
                {this.convertTime(this.props.time)}
              </span>
            </div>
          </div>
        }
      >
          <div
            unselectable="on"
          >
            <Icon
              type="edit"
              href="#"
              onClick={this.handleEdit}
              style={{
                display: "block",
                color: "#444444",
                fontSize: 18,
                pointer: "cursor",
              }}
            />
          </div>
      </Popup>
    );
  }
}

function mapStateToProps(state) {
  return {
    pubnub: state.pubnub,
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  actions
)(InnerBox);
