import React from "react";
import * as actions from "../../actions";
import { connect } from "react-redux";
import DeviceSelector from "../DeviceSelector";
import User from "../chatsComponents/User";
import { notification, Icon, Button, Card, Tooltip } from "antd";
import Popup from "reactjs-popup";
import "./Header.css";

class Header extends React.Component {
	state = {
		showDeviceSelector: false,
		removedDeviceError: false,
		refresh: false
	};
	hideDeviceSelector = () => {
		this.setState({ showDeviceSelector: false });
	};

	removeDeviceError = () => {
		this.setState({
			removedDeviceError: true
		});
	};

	deviceSelected = () => {
		return (
			localStorage.getItem("audioinput") &&
			localStorage.getItem("videoinput")
		);
	};

	toRefresh = () => {
		this.setState({ refresh: !this.state.refresh });
	};
	render() {
		return (
			<div
				style={{
					height: this.props.isMobile ? 50 : "50px",
					backgroundColor: this.props.isMobile ? "#54B1D2" : ""
				}}
				className="chat-area-header"
			>
				<span style={{ fontSize: 20 }}>{this.props.user.name}</span>
				{this.props.showIcons ? (
					<Tooltip
						placement="leftBottom"
						title={
							this.props.deviceFetchError &&
							!this.state.removedDeviceError
								? "Not able to Access devices"
								: this.deviceSelected
									? "Change Audio and Video Devices"
									: "Select Audio and Video Devices"
						}
					>
						<a
							onClick={() => {
								this.setState({ showDeviceSelector: true });
							}}
							style={{
								border: "none",
								backgroundColor: "white",
								fontSize: 23,
								float: "right",
								display: "inline",
								marginRight: "5%"
							}}
						>
							{this.props.deviceFetchError &&
							!this.state.removedDeviceError ? (
								<i
									style={{ fontSize: 18 }}
									className="fa fa-exclamation-triangle warning-icon"
								/>
							) : (
								<i class="fas fa-cog" />
							)}
						</a>
					</Tooltip>
				) : (
					undefined
				)}
				{this.state.showDeviceSelector ? (
					<DeviceSelector
						onClose={this.hideDeviceSelector}
						removeDeviceError={this.removeDeviceError}
						refresh={this.state.refresh}
						toRefresh={this.toRefresh}
					/>
				) : (
					undefined
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(
	mapStateToProps,
	actions
)(Header);
