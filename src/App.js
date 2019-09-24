import React, { Component } from "react";
import ChatApp from "./components/ChatApp";
import VideoApp from "./components/VideoApp";
import { connect } from "react-redux";
import * as actions from "./actions";
import browser from "./helperFunctions/checkBrowser";
import DeviceSelector from "./components/DeviceSelector";
import NavBar from "./components/NavBar";
import _ from "lodash";
import { message } from "antd";
import $ from "jquery";

class App extends Component {
  state = { networkError: false, showDeviceSelector:true };
  static moveDirectlyToVideo = false;
  static callerConvId = null;
  static callerLoginId = null;
  static callerDeviceId = null;
  static deviceFetchError = false;
  initialize() {
    return {
      usertoken: localStorage.getItem("user_token"),
      userid: localStorage.getItem("user_id"),
      loginid: parseInt(localStorage.getItem("login_id"), 10),
      img: localStorage.getItem("user_picture"),
      last: 100,
      name: localStorage.getItem("user_fullName"),
      patients: [],
      notSentMsgs: {},
      patientsObj: {},
      userType: localStorage.getItem("user_type"),
      randomId: (Math.random() * 100000000000 + "").substring(0, 7)
    };

  }
  componentWillUnmount() {
    let _this = this;
    clearInterval(this.onlineTimer);
    this.onlineTimer = null;
    localStorage.setItem('chatOpened',false);
  }

  componentWillMount() {
    window.isTabOpened = true;
    this.app = this.initialize();
    console.log(this.app);
    if (window.location.hash.indexOf("#convid=") >= 0) {
      window.movedDirectlyToVideo = true;
      App.moveDirectlyToVideo = true;
      let ind = window.location.hash.indexOf("&id=");
      let indev = window.location.hash.indexOf("&deviceid=");
      App.callerConvId = window.location.hash.substring(8, ind);
      App.callerLoginId = window.location.hash.substring(ind + 4,indev);
      App.callerDeviceId = window.location.hash.substring(indev + 10);
      //console.log(window.location.hash.substring(2,ind),window.location.hash.substring(ind+2));
      window.location.hash = "";
    }
        
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
      let notification = new Notification("Hi there!", {
        body: "Welcome Back"
      });
      setTimeout(notification.close.bind(notification), 3000);
    } 
  }

  componentDidMount() {
    App.moveDirectlyToVideo = false;
    window.addEventListener("online", this.removeNetworkError);
    window.addEventListener("offline", this.showNetworkError);

    $(window).focus(function() {
      window.isTabOpened = true;
    });

    $(window).blur(function() {
      window.isTabOpened = false;
    });
  }

  hideDeviceSelector = () => {
    this.setState({ showDeviceSelector: false });
  };

  handleDeviceError = () => {
    console.log("err handeled");
    App.deviceFetchError = true;
  };

  removeNetworkError() {
    if (this.message) {
      message.destroy(this.message);
      this.message = null;
      $("#modalbg2").fadeOut();
    }
  }

  showNetworkError() {
    if (!this.message) {
      $("#modalbg2").fadeIn();
      this.message = message.error("Network Error", 0);
    }
  }

  render() {
    if (this.props.mode === "video" || App.moveDirectlyToVideo ) {
      return (
        <div>
          <NavBar app={this.app} />
          <VideoApp
            app={this.app}
            callerConvId={App.callerConvId}
            callerLoginId={App.callerLoginId}
            callerDeviceId={App.callerDeviceId}
            moveDirectlyToVideo={App.moveDirectlyToVideo}
          />
        </div>
      );
    } else {
      return (
        <div style={{ height: "100%" }}>
          <NavBar app={this.app} />
          <ChatApp
            app={this.app}
            user={this.props.user}
            deviceFetchError={App.deviceFetchError}
          />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    mode: state.mode,
    pubnub: state.pubnub,
    user: state.user,
    err: state.err
  };
}

export default connect(
  mapStateToProps,
  actions
)(App);
