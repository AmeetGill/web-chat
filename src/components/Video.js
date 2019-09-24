import React from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
import * as actions from "../actions";
import axios from "axios";
import VideoOverlay from "./VideoOverlay";
import videoConnecting from "../video_connecting.svg";
import { message } from "antd";
import moment from 'moment';
import Browser from '../helperFunctions/checkBrowser'

//import "./Video.css";


class Video extends React.Component {
	state = {
		hover: false
	}
	static rtcConfig = {
		iceServers: [
			{ urls: "stun:23.21.150.121" },
			{ urls: "stun:stun.l.google.com:19302" },
			{ urls: "stun:stun1.l.google.com:19302" },
			{ urls: "stun:stun2.l.google.com:19302" },
			{ urls: "stun:stun3.l.google.com:19302" },
			{ urls: "stun:stun4.l.google.com:19302" },
			{ urls: "stun:23.21.150.121" },
			{ urls: "stun:stun01.sipphone.com" },
			{ urls: "stun:stun.ekiga.net" },
			{ urls: "stun:stun.fwdnet.net" },
			{ urls: "stun:stun.ideasip.com" },
			{ urls: "stun:stun.iptel.org" },
			{ urls: "stun:stun.rixtelecom.se" },
			{ urls: "stun:stun.schlund.de" },
			{ urls: "stun:stunserver.org" },
			{ urls: "stun:stun.softjoys.com" },
			{ urls: "stun:stun.voiparound.com" },
			{ urls: "stun:stun.voipbuster.com" },
			{ urls: "stun:stun.voipstunt.com" },
			{ urls: "stun:stun.voxgratia.org" },
			{ urls: "stun:stun.xten.com" },
			{ urls: "stun:s3.xirsys.com" },
			{
				username: process.env.REACT_APP_TURN_USER_NAME,
				urls: "turn:s3.xirsys.com:80?transport=udp",
				credential: process.env.REACT_APP_TURN_CREDENTIAL
			},
			{
				username: process.env.REACT_APP_TURN_USER_NAME,
				urls: "turn:s3.xirsys.com:3478?transport=udp",
				credential: process.env.REACT_APP_TURN_CREDENTIAL
			},
			{
				username: process.env.REACT_APP_TURN_USER_NAME,
				urls: "turn:s3.xirsys.com:80?transport=tcp",
				credential: process.env.REACT_APP_TURN_CREDENTIAL
			},
			{
				username: process.env.REACT_APP_TURN_USER_NAME,
				urls: "turn:s3.xirsys.com:3478?transport=tcp",
				credential: process.env.REACT_APP_TURN_CREDENTIAL
			},
			{
				username: process.env.REACT_APP_TURN_USER_NAME,
				urls: "turns:s3.xirsys.com:443?transport=tcp",
				credential: process.env.REACT_APP_TURN_CREDENTIAL
			},
			{
				username: process.env.REACT_APP_TURN_USER_NAME,
				urls: "turns:s3.xirsys.com:5349?transport=tcp",
				credential: process.env.REACT_APP_TURN_CREDENTIAL
			}
		]
	};

	async returnIceServers() {
		let encodedString =
			"Basic " +
			window.btoa("ameetgill:cb841384-6fb4-11e8-b139-5273ec5d9a85");
		let req = {
			url: "https://global.xirsys.net/_turn/MyFirstApp/",
			method: "PUT",
			headers: {
				Authorization: encodedString
			}
		};

		var iceServers = await axios.get(req);

		return iceServers.v.iceServers;
	}

	stopStreamedVideo = videoElem => {
		let stream = videoElem.srcObject;

		if (stream) {
			let tracks = stream.getTracks();
			tracks.forEach(function(track) {
				track.stop();
			});
		}

		videoElem.srcObject = null;
	};

	someOneCallingMe = (signal, msg) => {
		let _this = this;
		var selfView = document.getElementById("video-out");
		var remoteView = document.getElementById("video-in");
		var remoteAudio = document.getElementById("audio-in");

		let pc1 = new RTCPeerConnection(Video.rtcConfig);
		this.globalPc1 = pc1;
		/*if(browser == 1)
			pc1.ontrack = function(evt) {
				console.log("got remote stream", evt);
				remoteView.srcObject = evt.streams[0];
			}; */

		//if(browser == 5)

		pc1.onaddstream = function(evt) {
			remoteView.srcObject = evt.stream;
			remoteView.onloadedmetadata = function(e) {
				remoteView.play();
				remoteView.muted = true;
				try {
					_this.removeElement("video-connecting");
				} catch (error) {}
			};
			remoteAudio.srcObject = evt.stream;
			remoteAudio.play();
		};

		pc1.oniceconnectionstatechange = function(event) {
			if(pc1.iceConnectionState === "failed"){
				message.error("Call failed! Please check your internet connection");
				_this.message = null;
				_this.endCall()
			}
			if(pc1.iceConnectionState === "completed"){
				if(_this.message)
					message.destroy(_this.message);
			}
			if (pc1.iceConnectionState === "disconnected") {
				message.error("Connection interrupted", 2).then(() => {
					_this.message = message.loading(
						"Checking if user is online",
						0
					);
				});
				_this.props.pubnub.publish(
					{
						message: {
							type: "areYouOnlineInVideo",
							obj: {
								id: _this.props.app.loginid
							}
						},
						channel: `vid${_this.props.user.convId1}`, //isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
						sendByPost: false,
						storeInHistory: false,
						meta: {
							cool: "meta"
						}
					},
					function(status, response) {}
				);
				_this.onlineTimer = setTimeout(() => {
					message.destroy(_this.message);
					_this.message = null;
					 message.error(
						"User is offline disconnecting call",
						2
					);
					_this.endCall();

				}, 20000);
				if (pc1.iceConnectionState === "connected") {
					if (_this.message) {
						message.destroy(_this.message);
						if (_this.onlineTimer) {
							clearTimeout(_this.onlineTimer);
							_this.onlineTimer = null;
						}
					}
				}
			}
		};

		pc1.ontrack = function(evt) {
			remoteView.srcObject = evt.streams[0];
			remoteView.onloadedmetadata = function(e) {
				remoteView.play();
				remoteView.muted = true;
				try {
					_this.removeElement("video-connecting");
				} catch (error) {}
			};
			remoteAudio.srcObject = evt.streams[0];
			//remoteAudio.play();
		};

		pc1.onicecandidate = function(evt) {
			_this.props.pubnub.publish(
				{
					message: {
						type: "video-candidate",
						data: {
							candidate: evt.candidate
						},
						obj: {
							id: _this.props.app.loginid
						}
					},
					channel: `vid${_this.props.user.convId1}`, //isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
					sendByPost: false,
					storeInHistory: false,
					meta: {
						cool: "meta"
					}
				},
				function(status, response) {}
			);
			_this.props.pubnub.publish(
				{
					message: {
						type: "video-candidate",
						data: {
							candidate: evt.candidate
						},
						obj: {
							id: _this.props.app.loginid
						}
					},
					channel: `vid${_this.props.app.loginid}`, //isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
					sendByPost: false,
					storeInHistory: false,
					meta: {
						cool: "meta"
					}
				},
				function(status, response) {}
			);
		};

		function handleSuccess(stream) {
			selfView.srcObject = stream;
			selfView.onloadedmetadata = function(e) {
				selfView.play();
				selfView.muted = true;
			};
			try{
				pc1.addStream(stream);
			}
			catch(err){
				stream.getTracks().forEach(track => pc1.addTrack(track, stream));
			}

			pc1.setRemoteDescription(
				new RTCSessionDescription(signal.sdp)
			).then(function() {
				pc1.createAnswer()
					.then(function(answer) {
						return pc1.setLocalDescription(answer);
					})
					.then(function() {
						_this.props.pubnub.publish(
							{
								message: {
									type: "video-answer",
									data: {
										sdp: pc1.localDescription
									},
									obj: {
										id: msg.obj.id
									}
								},
								channel: `vid${_this.props.user.convId1}`,
								sendByPost: false,
								storeInHistory: false,
								meta: {
									cool: "meta"
								}
							},
							function(status, response) {}
						);
					});
			});
		}

		function handleError(error) {
			console.log("getUserMedia error: ", error);
		}

		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { min: 640, ideal: 1280 },
					height: { min: 400, ideal: 720 },
					aspectRatio: { ideal: 1.33333333333 },
					frameRate: 30,
					deviceId: localStorage.getItem("videoinput") && Browser !== 6
						? { exact: localStorage.getItem("videoinput") }
						: undefined
				},
				audio: {
					sampleSize: 16,
					channelCount: 4,
					echoCancellation: true,
					deviceId: localStorage.getItem("audioinput") && Browser !== 6
						? { exact: localStorage.getItem("audioinput") }
						: undefined
				}
			})
			.then(handleSuccess)
			.catch(handleError);
	};

	call = () => {
		var _this = this;
		var selfView = document.getElementById("video-out");
		var remoteView = document.getElementById("video-in");
		var remoteAudio = document.getElementById("audio-in");

		var pc = new RTCPeerConnection(Video.rtcConfig);
		this.globalPc = pc;

		pc.onicecandidate = function(evt) {
			if (evt.condidate)
				_this.props.pubnub.publish(
					{
						message: {
							type: "video-candidate",
							data: {
								candidate: evt.condidate
							},
							obj: {
								id: _this.props.app.loginid
							}
						},
						channel: `vid${_this.props.user.convId1}`, //isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
						sendByPost: false,
						storeInHistory: false,
						meta: {
							cool: "meta"
						}
					},
					function(status, response) {}
				);
				_this.props.pubnub.publish(
					{
						message: {
							type: "video-candidate",
							data: {
								candidate: evt.condidate
							},
							obj: {
								id: _this.props.app.loginid
							}
						},
						channel: `vid${ _this.props.app.loginid}`, //isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
						sendByPost: false,
						storeInHistory: false,
						meta: {
							cool: "meta"
						}
					},
					function(status, response) {}
				);
		};
		

		pc.onaddstream = function(evt) {
			remoteView.srcObject = evt.stream;
			remoteView.onloadedmetadata = function(e) {
				remoteView.play();
				remoteView.muted = true;
				try {
					_this.removeElement("video-connecting");
				} catch (error) {}
			};
			remoteAudio.srcObject = evt.stream;
			remoteAudio.play();
		};
		pc.ontrack = function(evt) {
			remoteView.srcObject = evt.streams[0];
			remoteView.onloadedmetadata = function(e) {
				remoteView.play();
				remoteView.muted = true;
				try {
					_this.removeElement("video-connecting");
				} catch (error) {}
			};
			remoteAudio.srcObject = evt.streams[0];
			//remoteAudio.play();
		};

		pc.oniceconnectionstatechange = function(event) {
			if(pc.iceConnectionState === "failed"){
				message.error("Call failed! Please check your internet connection or try again");
				_this.message =null;
				_this.endCall()
			}
			if(pc.iceConnectionState === "completed"){
				if(_this.message)
					message.destroy(_this.message);
			}
			if (pc.iceConnectionState === "disconnected") {
				message.error("Connection interrupted", 2).then(() => {
					_this.message = message.loading(
						"Checking if user is online",
						0
					);
				});
				_this.props.pubnub.publish(
					{
						message: {
							type: "areYouOnlineInVideo",
							obj: {
								id: _this.props.app.loginid
							}
						},
						channel: `vid${_this.props.user.convId1}`, //isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
						sendByPost: false,
						storeInHistory: false,
						meta: {
							cool: "meta"
						}
					},
					function(status, response) {}
				);
				_this.onlineTimer = setTimeout(() => {
					message.destroy(_this.message);
					_this.message = null;
					 message.error(
						"User is offline disconnecting call",
						2
					);
					_this.endCall();
				}, 20000);
				if (pc.iceConnectionState === "connected") {
					if (_this.message) {
						message.destroy(_this.message);
						if (_this.onlineTimer) {
							clearTimeout(_this.onlineTimer);
							_this.onlineTimer = null;
						}
					}
				}
			}
		};

		function handleSuccess(stream) {
			selfView.srcObject = stream;
			selfView.onloadedmetadata = function(e) {
				selfView.play();
				selfView.muted = true;
			};
			try{
				pc.addStream(stream);
			}
			catch(err){
				stream.getTracks().forEach(track => pc.addTrack(track, stream));
			}

			pc.createOffer()
				.then(function(offer) {
					return pc.setLocalDescription(offer);
				})
				.catch(function(error) {
					console.log("there is some error", error);
				})
				.then(function() {
					sendDescription(pc.localDescription);
				});

			function sendDescription(desc) {
				_this.props.pubnub.publish(
					{
						message: {
							type: "video-offer",
							data: {
								sdp: desc
							},
							obj: {
								id: _this.props.app.loginid
							}
						},
						channel: `vid${_this.props.user.convId1}`,
						sendByPost: false, // true to send via post
						storeInHistory: false, //override default storage options
						meta: {
							cool: "meta"
						} // publish extra meta with the request
					},
					function(status, response) {}
				);
			}
		}

		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { min: 640, ideal: 1280 },
					height: { min: 400, ideal: 720 },
					aspectRatio: { ideal: 1.33333333333 },
					frameRate: 30,
					deviceId: localStorage.getItem("videoinput") && Browser !== 6
						? { exact: localStorage.getItem("videoinput") }
						: undefined
				},
				audio: {
					sampleSize: 16,
					channelCount: 4,
					echoCancellation: true,
					deviceId: localStorage.getItem("audioinput") && Browser !== 6
						? { exact: localStorage.getItem("audioinput") }
						: undefined
				}
			})
			.then(handleSuccess);
	};

	addElement(parentId, elementTag, elementId, html) {
		var p = document.getElementById(parentId);
		var newElement = document.createElement(elementTag);
		newElement.setAttribute("id", elementId);
		newElement.innerHTML = html;
		p.appendChild(newElement);
	}

	componentDidMount() {
		var _this = this;

		this.props.pubnub.addListener({
			message: function(m) {
				var msg = m.message; // The Payload
				//console.log("got message in video")
				if (msg.type === "video-offer") {
					if (msg.obj.id !== _this.props.app.loginid) {
						let signal = msg.data;
						if (!_this.globalPc1 ){
							_this.someOneCallingMe(signal, msg);
						}
					}
				} else {
					if (msg.type === "video-answer") {
						if (msg.obj.id === _this.props.app.loginid) {
							let signal = msg.data;
							_this.globalPc.setRemoteDescription(
								new RTCSessionDescription(signal.sdp)
							);
						}
					} else {
						if (msg.type === "video-candidate") {
							//if (msg.obj.id !== _this.props.app.loginid) {
							//console.log("recieving candidates",msg)
							var signal = msg.data;
							if (signal.candidate)
								if (msg.obj.id !== _this.props.app.loginid && Browser === 6)
								_this.globalPc1
									? _this.globalPc1.addIceCandidate(
											new RTCIceCandidate(
												signal.candidate
											)
									  )
									: _this.globalPc.addIceCandidate(
											new RTCIceCandidate(
												signal.candidate
											)
									  );
								else
									_this.globalPc1
									? _this.globalPc1.addIceCandidate(
											new RTCIceCandidate(
												signal.candidate
											)
									  )
									: _this.globalPc.addIceCandidate(
											new RTCIceCandidate(
												signal.candidate
											)
									  );
							//}
						} else {
							if (msg.type === "iAmOnlineInVideo") {
								if (msg.obj.id !== _this.props.app.loginid) {
									if (_this.message) {
										message.destroy(_this.message);
										if (_this.onlineTimer) {
											clearTimeout(_this.onlineTimer);
											_this.onlineTimer = null;
										}
										_this.message = message.loading(
											"Reconnecting",
											0
										);
									}
								}
							} else {
								if (msg.type === "areYouOnlineInVideo") {
									if (
										msg.obj.id !== _this.props.app.loginid
									) {
										_this.props.pubnub.publish(
											{
												message: {
													type: "iAmOnlineInVideo",
													obj: {
														id:
															_this.props.app
																.loginid
													}
												},
												channel: m.channel,
												sendByPost: false,
												storeInHistory: false,
												meta: {
													cool: "meta"
												}
											},
											function(status, response) {}
										);
									}
								}
							}
						}
					}
				}
			}
		});

		if (this.props.user.convId !== "") {
			if (this.props.user.meCalling) {
				this.call();
			}
		}

		//if (localStorage.getItem("user_type") === "1") {
		//	this.call();
		//}
	}

	endCall = () => {
		try{
			this.stopStreamedVideo(document.getElementById("video-out"));
		}
		catch(e){

		}
		this.props.sendStopCall(
			this.props.pubnub,
			this.props.user.convId1,
			this.props.app,
			this.props.user.convId,
			this.props.moveDirectlyToVideo
		);
	};

	componentWillUnmount() {
		message.destroy(this.message);
		this.stopStreamedVideo(document.getElementById("video-out"));
		this.globalPc ? this.globalPc.close() : null;
		this.globalPc1 ? this.globalPc1.close() : null;
	}

	openSider() {
		document.getElementById("chat-area-sider").style.width = "80%";
	}

	removeElement(elementId) {
		var element = document.getElementById(elementId);
		element.parentNode.removeChild(element);
	}

	toggleHoverState = () => {
		this.setState({ hover: !this.state.hover })
	}

	render() {
		let todaysDate = new Date();
		return (
			<div
				style={{
					backgroundColor: "white",
					width:"70%",
					height: "100%",
					marginLeft: "3%"
				}}
				
			>
				<video
					id="video-in"
					autoPlay
					style={{
						height: "100%",
						maxHeight: "100%",
						maxWidth: "100%",
						width:"100%",
						position: "relative",
						top: 0,
						left: 0,
						objectFit:'fill'

					}}
				/>
				<video
					id="video-out"
					autoPlay
					style={{
						position: "absolute",
						height: "20%",
						width: "20%",
						top: "14%",
						right: "2.5%"
					}}
				>
					{" "}
				</video>
				<audio id="audio-in" autoPlay preload="auto" />
				{this.props.isMobile ? (
					<a
						href="#!"
						onClick={this.openSider}
						style={{ position: "absolute", top: "2%", left: "5%" }}
					>
						<Icon
							style={{ fontSize: "50px", color: "white" }}
							type="right-circle-o"
						/>{" "}
					</a>
				) : (
					undefined
				)}
				<a
					href="#!"
					onClick={this.endCall}
					style={{ position: "absolute", top: "91%", left: "58%" }}
				>
					<Icon
						style={{ fontSize: "50px", color: "red" }}
						type="close-circle"
					/>{" "}
				</a>

				<img
					id="video-connecting"
					alt="Loading"
					src={videoConnecting}
					style={{
						position: "absolute",
						top: "42%",
						left: "55%"
					}}
				/>
				<VideoOverlay />
			</div>
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
)(Video);
