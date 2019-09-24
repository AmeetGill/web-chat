import React, { Component } from "react";
import ChatArea from "./ChatArea";
import Video from "./Video";
import { connect } from "react-redux";
import * as actions from "../actions";

class VideoApp extends Component {
	componentWillMount() {
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		if (this.props.moveDirectlyToVideo) {
			this.props.get_patient_list(
				this.props.app,
				this.props.pubnub,
				true
			)
		}
	}

	render() {
		/*if (this.w < 768 ) {
			return (
				<div 
					style={{ 
						height: "100%",
						position: "absolute",
						paddingTop: "63px"  
					}} 
					className="container-fluid"
				>
					<div
						style={{ height: "100%", paddingTop: "1%" }}
						className="row"
					>
						<div
							id="chat-area-sider"
							style={{
								height: "100%",
								width: "0%",
								position: "fixed",
								zIndex: 1,
								top: 0,
								left: 0,
								overflowX: "hidden",
								transition: "0.5s"
							}}
							className="col-xs-12"
						>
							<ChatArea app={this.props.app} width="4" isMobile = {true} />
						</div>
						<Video app={this.props.app} width="7" isMobile = {true} />
					</div>
				</div>
			);
		} */

		return (
			<div
				style={{
					height: "100%",
					position: "absolute"
				}}
				className="container-fluid"
			>
				<div
					style={{
						height: "100%",
						paddingTop: "1%",
						marginBottom: 0
					}}
					className="row"
				>
					<ChatArea
						app={this.props.app}
						width="4"
						video={true}
						moveDirectlyToVideo={this.props.moveDirectlyToVideo}
						callerConvId = {this.props.callerConvId}
						callerLoginId = {this.props.callerLoginId}
						callerDeviceId = {this.props.callerDeviceId}
					/>
					<Video app={this.props.app} width="8" moveDirectlyToVideo={this.props.moveDirectlyToVideo} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		pubnub: state.pubnub
	};
}

export default connect(
	mapStateToProps,
	actions
)(VideoApp);
