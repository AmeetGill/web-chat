import React, { Component } from "react";
import ChatArea from "./ChatArea";
import Chats from "./Chats";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import Login from "./Login";
import { Modal,Button } from "antd";

// <ChatArea app={this.props.app} user={this.props.user} width="9" />

class ChatApp extends Component {
  state = {
    enablePreloader: false,
    noChat: false
  };
  static prevScreenWidth = "";
  componentDidMount() {
    if (this.props.chats.length === 0) {
      this.props.get_patient_list(this.props.app, this.props.pubnub, true);
    }
  }

  componentWillMount() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  componentWillReceiveProps(newProps) {
    if (this.props.user.convId !== newProps.user.convId) {
      this.setState({ enablePreloader: true });
    } else {
      setTimeout(() => this.setState({ enablePreloader: false }), 1000); // giving some time for rendering mesages
    }
    if (newProps.err === "NO CHAT") {
      this.setState({ noChat: true });
    }
  }

  closeNav() {
    let elem = document.getElementById("chats-sider");
    if (elem.style.width > 0) {
      elem.style.width = "0%";
    }
  }

  render() {
    return (
      <div
        style={{
          height: "100%",
          overflow: "hidden",
          paddingLeft: "2%",
          paddingRight: "2%",
          position: "absolute",
          paddingTop:60
        }}
        className="container-fluid"
      >
        <Modal
          title="No Conversation Found"
          visible={this.props.err === "NO CHAT"}
          closable={false}
          footer={
            <Button
              key="back"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Return
            </Button>
          }
        >
          <p>
            To create a conversation search for a doctor and book the
            appointment
          </p>
        </Modal>
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            marginRight: "-2%",
            marginLeft: "-2%",
            marginTop: "15px"
          }}
          className="row"
        >
          <Chats app={this.props.app} noChat={this.state.noChat} />
          <ChatArea
            app={this.props.app}
            user={this.props.user}
            enablePreloader={this.state.enablePreloader}
            width="8"
            deviceFetchError = {this.props.deviceFetchError}
          />
          <Login err={this.props.err} login={this.props.login} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pubnub: state.pubnub,
    err: state.err,
    msgs: state.msgs,
    chats: state.chats
  };
}

export default connect(
  mapStateToProps,
  actions
)(ChatApp);
