import React from "react";
import * as actions from "../../actions/index";
import Icons from "./Icons";
import { connect } from "react-redux";
import { Badge } from "antd";
import { Row, Col } from "react-flexbox-grid";
import docAvatar from "../../images/doc.jpg";
import patientAvatar from "../../images/user.png";
import man from "../../coreIMAGES/man.svg";
import woman from "../../coreIMAGES/woman.svg";
import doctorFemale from "../../coreIMAGES/doctor_female.svg";
import doctorMale from "../../coreIMAGES/doctor_male.svg";
import "./Chat.css";
import moment from "moment";

class Chat extends React.Component {
  state = {
    bgColor: "#2d7799",
    clicked: false,
    new_msg_count: 0,
    online: false
  };

  makeUserOffline = () => {
    this.setState({ online: false });
    if (this.offlineTimer) {
      clearInterval(this.offlineTimer);
      this.offlineTimer = null;
    }
  };

  static makeZeroCountFor = "";

  componentDidMount() {
    let _this = this;
    var i = 1000;
    /*
    if(this.props.app.userType !== 1){
      this.offlineTimer = setInterval(() => {
        _this.props.pubnub.hereNow(
            {
                includeUUIDs: true,
            },
            function (status, response) {
               // console.log("dsf",response)
                if(response && response["channels"] && response["channels"][_this.props.loginId]){
                    if(!_this.state.online){
                      _this.setState({online:true})
                      _this.props.makeUserOnline(_this.props.app,_this.props.convId)
                    }
                }
                else{
                  if(_this.state.online){
                    _this.setState({online:false})
                    _this.props.makeUserOffline(_this.props.app,_this.props.convId)
                  }
                }
            }
        );
      },i);
    }
    i = 30000; */
    this.props.pubnub.addListener({
      presence: function(presenceEvent) {
        //console.log(presenceEvent)
        if (parseInt(presenceEvent.uuid) === parseInt(_this.props.loginId)) {
          if (presenceEvent.action === "join") {
            _this.setState({ online: true });
            _this.props.makeUserOnline(_this.props.app, _this.props.convId);
          } else {
            _this.setState({ online: false });
            _this.props.makeUserOffline(_this.props.app, _this.props.convId);
          }
        }
      }
    });

    _this.props.pubnub.hereNow(
      {
        includeUUIDs: true
      },
      function(status, response) {
        // console.log(response)
        if (
          response &&
          response["channels"] &&
          response["channels"][_this.props.loginId]
        ) {
          if (!_this.state.online) {
            _this.setState({ online: true });
            _this.props.makeUserOnline(_this.props.app, _this.props.convId);
          } else {
            if (_this.state.online) {
              _this.setState({ online: false });
              _this.props.makeUserOffline(_this.props.app, _this.props.convId);
            }
          }
        }
      }
    );

    //jhgioijoij
    //jjjhhjgjjhhhkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    if (this.props.convId === this.props.user.convId) {
      this.setState({
        bgColor: "#054a69",
        clicked: true,
        online: this.props.app["patientsObj"][this.props.convId]
          ? this.props.app["patientsObj"][this.props.convId].online
          : false
      });
    } else {
      if (this.props.new_msg_count > 0) {
        this.setState({
          new_msg_count: this.props.new_msg_count,
          online: this.props.app["patientsObj"][this.props.convId]
            ? this.props.app["patientsObj"][this.props.convId].online
            : false
        });
      } else {
        this.setState({
          new_msg_count: this.props.new_msg_count,
          online: this.props.app["patientsObj"][this.props.convId]
            ? this.props.app["patientsObj"][this.props.convId].online
            : false
        });
      }
    }
    console.log(this.props.activeChat);
    if (this.props.activeChat) {
      this.handleClick();
      window.location.hash = "";
    }
    else{
      if(!this.props.user.convId && this.props.index === 0){
         this.handleClick();
      }
    }
  }

  componentWillUnmount() {
    if (this.offlineTimer) {
      clearInterval(this.offlineTimer);
      this.offlineTimer = null;
    }
  }

  closeNav() {
    document.getElementById("chats-sider").style.width = "0%";
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.convId !== this.props.user.convId &&
      Chat.makeZeroCountFor !== ""
    ) {
      this.props.make_new_msg_count_zero(Chat.makeZeroCountFor, this.props.app);
      Chat.makeZeroCountFor = "";
    }
    if (nextProps.convId === nextProps.user.convId) {
      this.setState({ bgColor: "#054a69", clicked: true, new_msg_count: 0 });
      if (nextProps.new_msg_count > 0) {
        Chat.makeZeroCountFor = nextProps.user.convId;
      }
    } else {
      this.setState({ new_msg_count: nextProps.new_msg_count });
      this.setState({ bgColor: "#2d7799", clicked: false });
    }
  }

  handleClick = () => {
    if (this.props.isMobile) {
      this.closeNav();
    }

    this.props.change_user(
      {
        img: this.props.img,
        name: this.props.name,
        convId: this.props.convId,
        blocked: this.props.user.blocked,
        muted: this.props.muted,
        loginId: this.props.loginId
      },
      this.props.app
    );

    this.props.load_messages(
      this.props.convId,
      this.props.app["patient" + this.props.convId].length === 0
        ? 20
        : this.props.app["patient" + this.props.convId].length,
      this.props.app
    );
  };

  changeColor = () => {
    this.setState({ bgColor: "#054a69" });
  };
  undoColor = () => {
    if (!this.state.clicked) {
      this.setState({ bgColor: "#2d7799" });
    }
  };
  renderAvatar = () => {
    if (this.props.img) {
      return (
        <img
          src={this.props.img}
          className="circle"
          style={{
            width: 147,
            borderRadius: "100%",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.16)",
            float: "right"
          }}
        />
      );
    } else if (this.props.userType == 1) {
      if (this.props.gender === "Male") {
        return (
          <div className="doc-avatar" style={{ float: "right" }}>
            <img
              src={doctorMale}
              style={{
                width: 147,
                borderRadius: "100%",
                boxShadow: "0px 0px 2px rgba(0,0,0,0.16)",
                backgroundColor: "white"
              }}
            />
          </div>
        );
      } else {
        return (
          <div className="doc-avatar" style={{ float: "right" }}>
            <img
              src={doctorFemale}
              style={{
                width: 147,
                borderRadius: "100%",
                boxShadow: "0px 0px 2px rgba(0,0,0,0.16)",
                backgroundColor: "white"
              }}
            />
          </div>
        );
      }
    } else {
      if (this.props.gender === "Male") {
        return (
          <div className="patient-avatar" style={{ float: "right" }}>
            <img
              src={man}
              style={{
                width: 147,
                borderRadius: "100%",
                boxShadow: "0px 0px 2px rgba(0,0,0,0.16)",
                backgroundColor: "white"
              }}
            />
          </div>
        );
      } else {
        return (
          <div className="patient-avatar" style={{ float: "right" }}>
            <img
              src={woman}
              style={{
                width: 147,
                borderRadius: "100%",
                boxShadow: "0px 0px 2px rgba(0,0,0,0.16)",
                backgroundColor: "white"
              }}
            />
          </div>
        );
      }
    }
  };
  render() {
    return (
      <a
        onMouseOver={this.changeColor}
        onMouseOut={this.undoColor}
        onClick={this.handleClick}
        className={
          this.state.clicked ? "chat-container clicked" : "chat-container"
        }
        style={{
          height: 198,
          maxHeight: 200,
          display: "block",
          width: 465,
          backgroundColor: this.state.bgColor,
          boxShadow: this.state.clicked
            ? "0px 0px 20px rgba(0,0,0,0.16)"
            : "0px 0px 8px rgba(0,0,0,0.16)",
          padding: "15px"
        }}
      >
        {this.renderAvatar()}
        <ul className="user-details">
          <li
            className="username"
            style={{
              fontSize: this.props.style.height * 0.1,
              marginLeft: this.props.style.height * 0.0001,
              marginTop: this.props.style.height * 0.01
            }}
          >
            {this.props.userType === 1 ? "Dr. " : undefined}
            {this.props.name && this.props.name.length > 2
              ? this.props.name
              : "no name"}
            {parseInt(this.props.userType) !== 1 ? (
              <span
                className="username"
                style={{
                  fontSize: this.props.style.height * 0.08,
                  marginLeft: this.props.style.height * 0.05,
                  marginTop: this.props.style.height * 0.01,
                  color: "white"
                }}
              >
                {moment().diff(this.props.dob, "years", false) + " y/o"}
              </span>
            ) : (
              undefined
            )}
          </li>
          {parseInt(this.props.userType) !== 1 && this.props.insurance ? (
            <li
              className="last-message"
              style={{
                fontSize: this.props.style.height * 0.08,
                marginLeft: this.props.style.height * 0.0001,
                marginTop: this.props.style.height * 0.01
              }}
            >
              {this.props.insurance.name ? (this.props.insurance.name.length < 26 ? this.props.insurance.name : this.props.insurance.name.substring(0,26)+"....") : undefined}
            </li>
          ) : (
            undefined
          )}
          {this.props.specialty ? (
            <li
              className="last-message"
              style={{
                fontSize: this.props.style.height * 0.08,
                marginLeft: this.props.style.height * 0.0001,
                marginTop: this.props.style.height * 0.01
              }}
            >
              {this.props.specialty}
            </li>
          ) : (
            undefined
          )}
          <li
            className="last-message"
            style={{
              fontSize: this.props.style.height * 0.08,
              marginLeft: this.props.style.height * 0.0001,
              marginTop: this.props.style.height * 0.04
            }}
          >
            {" "}
            {this.props.lastMessage
              ? this.props.lastMessage.length > 15
                ? this.props.lastMessage.substring(0, 15).trim() + "....."
                : this.props.lastMessage
              : undefined}
            {this.state.new_msg_count > 0 && !this.props.muted ? (
              <span
                style={{
                  marginLeft: 10,
                  marginTop: "12%",
                  fontSize: this.props.style.height * 0.1
                }}
              >
                <Badge count={this.state.new_msg_count} />
              </span>
            ) : (
              undefined
            )}
          </li>
        </ul>

        {parseInt(this.props.app.userType) !== 1 ? (
          <ul style={{ position: "absolute", top: 15, left: 425 }}>
            <li
              className="online-indicator"
              style={{
                color:
                  this.state.online &&
                  !this.props.muted &&
                  !this.props.userBlocked
                    ? "#BEDF07"
                    : "gray",
                float: "left"
              }}
            >
              <i className="material-icons" style={{ fontSize: "19px" }}>
                fiber_manual_record
              </i>
            </li>
          </ul>
        ) : (
          undefined
        )}
       
        <div>
          {this.state.clicked ? (
            <Icons
              app={this.props.app}
              isMobile={this.props.isMobile}
              style={this.props.style}
              blocked={this.props.blocked}
              muted={this.props.muted}
            />
          ) : (
            undefined
          )}
        </div>
      </a>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    pubnub: state.pubnub
  };
}

export default connect(
  mapStateToProps,
  actions
)(Chat);
