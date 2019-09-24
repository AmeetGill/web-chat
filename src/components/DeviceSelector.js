import React from "react";
import { Button } from "antd";
import Popup from "reactjs-popup";
import Device from "./Device";

import "./DeviceSelector.css";

class DeviceSelector extends React.Component {
	constructor() {
		super();
		this.gotStream = this.gotStream.bind(this);
		this.state = {isMounted: false,devicesFetched: false, refresh: false, devicesFetchError: false}
	}

	onClose = () => {
		if (!this.state.devicesFetchError) {
			if (this.props.removeDeviceError) {
				this.props.removeDeviceError();
			}
		}

		if (this.props.onClose) {
			this.props.onClose();
		}

		localStorage.setItem("devicePopupShown","yes")
	};

	componentWillUnmount() {
	    this.setState( { isMounted: false } )
	}

	static audioInputList = [];
	static videoInputList = [];
	static audioInputDetailsList = [];
	static videoInputDetailsList = [];
	changeAudioInputDevice = e => {
		let _this = this;
		DeviceSelector.audioInputList = DeviceSelector.audioInputDetailsList.map(
			device => {
				if (device.id === e.target.id)
					return (
						<Device
							id={device.id}
							key={device.id}
							label={device.label}
							selected={true}
							onClick={_this.changeAudioInputDevice}
						/>
					);
				else
					return (
						<Device
							id={device.id}
							key={device.id}
							label={device.label}
							selected={false}
							onClick={_this.changeAudioInputDevice}
						/>
					);
			}
		);
		localStorage.setItem("audioinput", e.target.id);
		!this.props.app ? this.props.toRefresh() : this.setState({ refresh: !this.state.refresh });
	};

	changeVideoInputDevice = e => {
		let _this = this;
		DeviceSelector.videoInputList = DeviceSelector.videoInputDetailsList.map(
			device => {
				if (device.id === e.target.id)
					return (
						<Device
							id={device.id}
							key={device.id}
							label={device.label}
							selected={true}
							onClick={_this.changeVideoInputDevice}
						/>
					);
				else
					return (
						<Device
							id={device.id}
							key={device.id}
							label={device.label}
							selected={false}
							onClick={_this.changeVideoInputDevice}
						/>
					);
			}
		);
		localStorage.setItem("videoinput", e.target.id);
		!this.props.app ? this.props.toRefresh() : this.setState({ refresh: !this.state.refresh });
	};

	gotStream(stream) {
		this.stream = stream;
		return navigator.mediaDevices.enumerateDevices();
	}

	componentDidMount(){
		console.log("mounted ");
		this.setState( { isMounted: true })
	}

	componentWillMount() {
		let _this = this;
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: true })
			.then(this.gotStream)
			.then(function(devices) {
				let audioInputCount = 1;
				let videoInputCount = 1;
				if (DeviceSelector.audioInputList.length === 0) {
					devices.forEach(function(device) {
						if (device.kind === "audioinput") {
							let label = device.label;
							let id = device.deviceId;
							let jsx = null;
							if (localStorage.getItem("audioinput") === id)
								jsx = (
									<Device
										id={id}
										key={id}
										label={
											label
												? label
												: "Audio Input " +
												  audioInputCount++
										}
										selected={true}
										onClick={_this.changeAudioInputDevice}
									/>
								);
							else
								jsx = (
									<Device
										id={id}
										key={id}
										label={
											label
												? label
												: "Audio Input " +
												  audioInputCount++
										}
										selected={false}
										onClick={_this.changeAudioInputDevice}
									/>
								);

							DeviceSelector.audioInputDetailsList.push({
								id: id,
								label: label
									? label
									: "Audio Input " + audioInputCount - 1
							});

							DeviceSelector.audioInputList.push(jsx);
						} else if (device.kind === "videoinput") {
							let label = device.label;
							let id = device.deviceId;
							let jsx = null;
							if (localStorage.getItem("videoinput") === id)
								jsx = (
									<Device
										id={id}
										key={id}
										label={
											label
												? label
												: "Video Input " +
												  videoInputCount++
										}
										selected={true}
										onClick={_this.changeVideoInputDevice}
									/>
								);
							else
								jsx = (
									<Device
										id={id}
										key={id}
										label={
											label
												? label
												: "Video Input " +
												  videoInputCount++
										}
										selected={false}
										onClick={_this.changeVideoInputDevice}
									/>
								);

							DeviceSelector.videoInputDetailsList.push({
								id: id,
								label: label
									? label
									: "Video Input " + videoInputCount - 1
							});
							DeviceSelector.videoInputList.push(jsx);
						}
					});
				}
				_this.setState({ devicesFetched: true });
				if (_this.stream) {
					let tracks = _this.stream.getTracks();
					tracks.forEach(function(track) {
						track.stop();
					});
				}
			})
			.catch(function(err) {
				console.log(_this.props);
				_this.setState({ devicesFetchError: true });
				if (_this.props.onError) {
					_this.props.onError();
				}
			});
	}

	render() {
		return (
			<Popup
				open={
					(!localStorage.getItem("devicePopupShown") || !this.props.app) &&
					(this.state.devicesFetched || this.state.devicesFetchError)
				}
				modal
				contentStyle={{
					height: "auto",
					minHeight: "250px",
					width: window.matchMedia("(max-device-width: 650px)")
						.matches
						? "65vw"
						: "35vw",
					border: "none",
					padding: 30,
					borderRadius: "20px",
					boxShadow: "0px 3px 99px rgba(0,0,0,0.16)"
				}}
				onClose={this.onClose}
			>
				{close => {
					if (this.state.devicesFetchError) {
						return (
							<div className="no-media-error">
								<i className="fa fa-exclamation-triangle warning-icon" />
								<br />
								<span className="error-message">
									Oops! We cannot find any media device. To
									search for one, we need your permission.
									Please be sure to click on allow to give
									permission.
								</span>
								<br />
								<button className="error-ok" onClick={close}>
									OK
								</button>
							</div>
						);
					} else
						return (
							<div className="device-selector-container">
								<h3
									style={{
										textAlign: "center",
										fontSize: "22px"
									}}
								>
									Select Devices For Videocall
								</h3>
								<div className="icon-container">
									<Popup
										trigger={
											<a href="#!">
												<i class="material-icons">
													mic_none
												</i>
											</a>
										}
										position="top center"
										closeOnDocumentClick
									>
										<div className="list-group">
											{DeviceSelector.audioInputList
												.length > 0 ? (
												DeviceSelector.audioInputList
											) : (
												<a className="list-group-item list-group-item-action">
													No More Devices
												</a>
											)}
										</div>
									</Popup>

									<Popup
										trigger={
											<a href="#!">
												<i class="material-icons">
													video_label
												</i>
											</a>
										}
										position="top center"
										closeOnDocumentClick
									>
										<div className="list-group">
											{DeviceSelector.videoInputList
												.length > 0 ? (
												DeviceSelector.videoInputList
											) : (
												<a className="list-group-item list-group-item-action">
													No More Devices
												</a>
											)}
										</div>
									</Popup>
								</div>
								<div className="button-container">
									<Button onClick={close}>Done </Button>
								</div>
							</div>
						);
				}}
			</Popup>
		);
	}
}

export default DeviceSelector;
