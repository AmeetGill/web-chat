import React from "react";
import chatPreloader from "../../AGNB.gif";
import Header from "./Header";
import Input from "./Input";

class MessagePreloader extends React.Component {
	render() {
		return (
			<div
				style={{ height: "100%", backgroundColor: "#E4F0F0" }}
				className={`col-md-${this.props.width ? this.props.width : 9}`}
			>
				<Header showIcons={true} app={this.props.app} />
				<div
					id="messages"
					style={{ height: "70%", overflowY: "scroll", width: "99%" }}
				>
					<img style={{ marginLeft: "27%" }} alt = "Loading Messages" src={chatPreloader} />
				</div>
				<Input app={this.props.app} />
			</div>
		);
	}
}

export default MessagePreloader;
