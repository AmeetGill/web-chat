import React from "react";
import * as actions from "../../actions";
import { connect } from "react-redux";
import DeviceSelector from "../DeviceSelector";
import User from "../chatsComponents/User";
import { notification, Icon, Button, Card, Tooltip, Modal } from "antd";

import "./Icons.css";

class Icons extends React.Component{
  blockUnblockUser = () => {
		if(!this.props.user.blocked){
			this.props.blockUser(this.props.user.convId,this.props.app,this.props.pubnub);
		}
		else{
			this.props.unblockUser(this.props.user.convId,this.props.app,this.props.pubnub);
		}
	}

	muteUnmuteUser = () => {
		if(!this.props.user.muted){
			this.props.muteUser(this.props.user.convId,this.props.app);
		}
		else{
			this.props.unmuteUser(this.props.user.convId,this.props.app);
		}
  }

  
  componentDidMount() {
		let _this = this;
		this.props.pubnub.addListener({
			message: function(m) {
				var msg = m.message;

				if (msg.type === "call-ok") {
					if (msg.obj.id !== _this.props.app.loginid) {
						notification.close("calling");
						clearTimeout(_this.tt);
					}
				} else if (msg.type === "call-reject") {
					if (msg.obj.id !== _this.props.app.loginid) {
						notification.close("calling");
						clearTimeout(_this.tt);
						notification.error({
							placement: "topRight",
							bottom: 50,
							key: "busy",
							duration: 5,
							description:
								msg.obj.name + " is currently busy"
						});
					}
				} 
			}
		});
	}
  
  renderContent(showIcons) {
		if (this.props.clicked) {
			return (
				<div style={{ 
					gridColumnStart: "2",
					}}>
					{/* {menuIconJsx} */}
					{localStorage.getItem("user_type") === "1" ? (
						<a
							href="#!"
							onClick={this.callSomeOne}
							style={{
								color: this.props.isMobile ? "white" : "#ababab"
							}}
							className="secondary-content"
						>
							<i
								style={{
									fontSize: this.props.isMobile
										? "15px"
										: "20px"
								}}
								className="material-icons"
							>
								video_call
							</i>
						</a>
					) : (
						undefined
					)}
					<Tooltip
						title = {this.props.user.blocked ? "Unblock" : "Block"}
					>
						<a
							href="#!"
							style={{
								color: this.props.isMobile ? "white" : "#ababab"
							}}
							className="secondary-content"
							onClick = {this.props.toggleBlock()}
						>
							<i
								style={{
									fontSize: this.props.isMobile ? "13px" : "16px"
								}}
								className={
									this.props.user.blocked
										? "fas fa-user-slash"
										: "fas fa-user"
								}
							/>
						</a>
					</Tooltip>
					<Tooltip
						title = {this.props.user.muted ? "Unmute" : "Mute"}
					>
						<button
							style={{
								color: "rgb(195, 103, 70)",
					            borderRadius: 20,
					            paddingRight: 22,
					            fontSize: 13,
					            fontFamily: "Montserratlight"
							}}
							className="secondary-content"
							onClick = {this.muteUnmuteUser}
						>
							dfsjdfk
						</button>
					</Tooltip>
				</div>
			);
		}
  }

  returnMyName = () => {
		return this.props.app.name;
	}
  
  notAbleToConnect = () => {
		notification.close("calling");
		notification.warning({
			placement: "topRight",
			bottom: 50,
			key: "notConnected",
			duration: 5,
			title: " Not Able To Connect",
			description: " Not able to connect to " + this.props.user.name
		});
		clearInterval(this.timer);
		this.timer = null;
	}

	callSomeOne = () => {
		this.props.call(
			this.props.pubnub,
			this.props.app,
			this.props.user.convId,
			this.returnMyName()
		);
		this.tt = setTimeout(() => {
			notification.destroy('calling');
			this.notAbleToConnect();
		},50000)
		notification.info({
			placement: "topRight",
			bottom: 50,
			key: "calling",
			duration: 0,
			description: (
				<Card bordered={false}>Calling {this.props.user.name}</Card>
			),
			icon: <Icon type="phone" style={{ fontSize: 46, color: "#08c" }} />,
			btn: (
				<Button
					type="danger"
					onClick={() => {
						this.props.cancelCall(
							this.props.app,
							this.props.pubnub,
							this.props.user.convId,
							this.props.app.name
						);
						notification.close("calling");
						clearTimeout(this.tt);
					}}
				>
					Cancel
				</Button>
			),
			onClose: () => {
				this.props.cancelCall(
					this.props.app,
					this.props.pubnub,
					this.props.user.convId,
					this.props.app.name
				);
				clearTimeout(this.tt);
			}
		});

		
	};

	checkCall = () => {
		let _this = this;
	  Modal.confirm({
	    title: 'Are You Sure You Want To Call '+this.props.user.name,
	    onOk() {
	      _this.callSomeOne();
	    },
	    onCancel() {},
	    okText: "Yes"
	  });

	}

	noAnswer = () => {
		notification.warning({
			placement: "topRight",
			bottom: 50,
			key: "notConnected",
			duration: 5,
			title: " Not Able To Connect",
			description: "User is not answering your call"
		});
	};

  render(){
    return (
      <div className="chat-icons-container">
        {this.props.app.userType === "1" ? (
          <a
            href="#!"
            onClick={this.checkCall}
            style={{
             	backgroundColor: "#32a698",
	            borderRadius: "20px",
	            padding: "6px 13px",
	            color:"#fff",
	            fontSize:14,
	            marginRight:1,
	            marginLeft:1,
	            textDecoration:"none"
            }}
            className="secondary-content"
          >
            <i
              style = {{marginBottom:0,marginLeft:2,marginRight:2}}
              className="material-icons"
            >
              video_call
            </i>
            Call
          </a>
        ) : (
          undefined
        )}
          <a
            href="#!"
            style={{
             	backgroundColor: !this.props.user.blocked ? "#c36746" : "#32a698",
	            borderRadius: "20px",
	            padding: "7px 13px",
	            color:"#fff",
	            fontSize:14,
	            marginRight:1,
	            marginLeft:1,
	            textDecoration:"none"
            }}
            className="secondary-content"
            onClick = {this.blockUnblockUser}
          >
            <i
            	style = {{marginBottom:4,marginLeft:2,marginRight:2}}
              className={
                this.props.user.blocked
                  ? "fas fa-user-slash"
                  : "fas fa-user"
              }
            />
            {this.props.user.blocked ? "Unblock" : "Block"}
          </a>
         <a
         	href="#!"
			style={{
				backgroundColor: !this.props.user.muted ? "#c36746" : "#32a698",
	            borderRadius: "20px",
	            padding: "7px 13px",
	            color:"#fff",
	            fontSize:14,
	            marginRight:1,
	            marginLeft:1,
	            textDecoration:"none"
			}}
			className="secondary-content"
			onClick = {this.muteUnmuteUser}
		> 
			<i style = {{marginBottom:4,marginLeft:2,marginRight:2}} className={this.props.user.muted ? "fas fa-bell-slash" : "fas fa-bell"} />
			{this.props.user.muted ? "Unmute" : "Mute"}
          </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
		pubnub: state.pubnub,
		user: state.user,
	};
}

export default connect(
	mapStateToProps,
	actions
)(Icons);