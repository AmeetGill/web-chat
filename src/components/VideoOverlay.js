import React from "react";

import "./VideoOverlay.css";

class VideoOverlay extends React.Component {
	state = { 
		muted: false, 
		videoOn: true, 
		preloader: true,
		devicesFetched : false,
		clicked: false,
		hover: false,
	}
	static audioOutputList = []

	changeAudioOutputDevice = (e) => {
		this.attachSinkId("audio-in",e.target.id);
	}


	attachSinkId(element, sinkId) {
	  	if (typeof element.sinkId !== 'undefined') {
		    element.setSinkId(sinkId)
		    .then(function() {
		    })
		}
	}


	toggelVideo = () => {
		let stream = document.getElementById("video-out").srcObject;
		if (stream) {
			var videoTracks = stream.getVideoTracks();
			if (videoTracks.length === 0) {
				return;
			}
			for (let i = 0; i < videoTracks.length; ++i) {
				videoTracks[i].enabled = !videoTracks[i].enabled;
			}
			this.setState({ videoOn: !this.state.videoOn });
		}
	}

	toggelAudio = () => {
		let stream = document.getElementById("video-out").srcObject;
		if (stream) {
			var audioTracks = stream.getAudioTracks();
			if (audioTracks.length === 0) {
				return;
			}

			for (let i = 0; i < audioTracks.length; ++i) {
				audioTracks[i].enabled = !audioTracks[i].enabled;
			}
			this.setState({ muted: !this.state.muted });
		}
	}

	expandIcons = () => {
		this.setState({ clicked: !this.state.clicked });
	}
	toggleHoverState = () => {
		this.setState({ hover: !this.state.hover })
	}

	render() {
		return (
			<div>
				<a
					href="#!"
					onClick={this.expandIcons}
					onMouseEnter={this.toggleHoverState}
					onMouseLeave={this.toggleHoverState}
					style={{ 
						position: "absolute",
						left: "65%", 
						height: this.state.hover || this.state.clicked ? "35px" : "30px",
						width: this.state.hover || this.state.clicked ? "35px" : "30px",
						bottom: this.state.hover || this.state.clicked ? "15.5px" : "18px", 
						borderRadius: "25px",
						border: "none",
						backgroundColor: this.state.hover ? "#80808078" : "rgba(128, 128, 128, 0.3)",
						zIndex: "2",
					}}
				>
					{ !this.state.clicked ? (
						<i
							class="material-icons video-icon"
							style={{ 
								color: "rgba(255, 255, 255, 0.45)", 
								fontSize: this.state.hover || this.state.clicked ? "35px" : "30px"
							}}
						>
							chevron_right
						</i>
					) : (
						<i
							class="material-icons video-icon"
							style={{ 
								color: "rgba(255, 255, 255, 0.45)", 
								fontSize: this.state.clicked ? "35px" : "30px" 
							}}
						>
							chevron_left
						</i>
					)}
				</a>
				{ this.state.clicked ? (
					<div>
						<a
							className="video-setting-icon mic-icon"
							href="#!"
							onClick={this.toggelAudio}
						>
							{!this.state.muted ? (
								<i
									class="material-icons"
								>
									mic
								</i>
							) : (
								<i
									class="material-icons"
									style={{ color: "red", fontSize: "25px" }}
								>
									mic_off
								</i>
							)}
						</a>

						<a
							className="video-setting-icon camera-icon"
							href="#!"
							onClick={this.toggelVideo}
						>
							{this.state.videoOn ? (
								<i class="material-icons">
									videocam
								</i>
							) : (
								<i class="material-icons">
									videocam_off
								</i>
							)}
						</a>
					</div>
				) : (
					undefined
				)}
				{/* <Popup
					    trigger={
								<a
									href="#!"
									style={{
										position: "absolute",
										bottom: "25px",
										left: "62%"
									}}
								>
									<i
										class="material-icons"
										style={{ color: "#ffffff4f", fontSize: "30px" }}
									>
										volume_up
									</i>
								</a>
								}
					    position="top center"
					    closeOnDocumentClick
					  >
					  <div className = "list-group">
					  	{VideoOverlay.audioOutputList.length > 0 ? VideoOverlay.audioOutputList : <a className = "list-group-item list-group-item-action" >No More Devices</a> }
					  </div>
				</Popup> */}
				
			</div>
		);
	}
}

export default VideoOverlay;
