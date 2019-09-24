import React from "react";
import { Button, Row, Col, Input, Icon } from "antd";
import Popup from "reactjs-popup";
import $ from "jquery";

class Login extends React.Component {
	state = {
		email: "",
		pass: "",
		displayLoginError: false,
		loginButtonText: "Login",
		loginButtonDisabled: false,
		openPopup: false
	};
	resendEmail = () => {
		var settings = {
			async: true,
			crossDomain: true,
			url: "https://${urlAPI}/v1/resend_verification_email",
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			processData: false,
			data: JSON.stringify({
				email: localStorage.getItem("user_email")
			})
		};

		$.ajax(settings)
			.done(function(response) {
				$(".errormsg.access")
					.html("Verification email sent.")
					.css("color", "green")
					.show();
			})
			.fail(function() {
				$(".errormsg.access")
					.html("Something went wrong")
					.css("color", "red")
					.show();
			});
	};
	handleEmailChange = e => {
		this.setState({ email: e.target.value });
	};
	handlePassChange = e => {
		this.setState({ pass: e.target.value });
	};

	signMeIn = () => {
		this.setState({
			loginButtonText: "Logging In ...",
			displayLoginError: false,
			loginButtonDisabled: true
		});
		this.props.login(this.state.email, this.state.pass);
	};

	componentWillReceiveProps(newProps) {
		if (
			newProps.err === "CHATS_LOAD_ERROR" ||
			newProps.err === "LOGIN_FAILURE" ||
			newProps.err === "LOGIN_SUCCESS" ||
			newProps.err === "EMAIL_NOT_VERIFIED"
		) {
			this.setState({ openPopup: true });
		}
		if (newProps.err) {
			if (newProps.err === "LOGIN_FAILURE") {
				this.setState({
					displayLoginError: true,
					loginButtonText: "Login",
					loginButtonDisabled: false
				});
			} else {
				if (newProps.err === "LOGIN_SUCCESS") {
					this.setState({ displayLoginError: false });
					window.location.reload(true);
				}
			}
		}
	}
	render() {
		return (
			<Popup
				open={this.state.openPopup}
				contentStyle={{
					width: this.props.isMobile ? "95%" : 340,
					height: this.props.isMobile
						? process.env.NODE_ENV === "development"
							? "95%"
							: 267
						: process.env.NODE_ENV === "development"
							? this.props.err === "EMAIL_NOT_VERIFIED" ? 487 :467
							: this.props.err === "EMAIL_NOT_VERIFIED" ?  287 : 267
				}}
				closeOnDocumentClick={false}
			>
				<div>
					<div
						style={{
							marginLeft: "10%",
							marginRight: "10%",
							marginTop: "20%"
						}}
					>
						<h4>
							{this.props.err === "EMAIL_NOT_VERIFIED"
								? "Email not verified"
								: "Login Again"}
						</h4>
						<p>
							{this.props.err === "EMAIL_NOT_VERIFIED"
								? "Your account is not yet verified. Please check your email for your verification link"
								: "You are logged out either due to token expired or you are logged in any other device"}
						</p>
						<h6  style = {{display: "none"}} className="errormsg access">Incorrect Email Address or Password</h6> 

					</div>
					{process.env.NODE_ENV === "development" ? (
						<div>
							<Row style={{ marginTop: "5%" }}>
								<Col span={8} />

								{this.state.displayLoginError ? (
									<p
										style={{
											color: "red",
											marginLeft: "30%"
										}}
									>
										Login Error
									</p>
								) : (
									undefined
								)}
							</Row>
							<Row>
								<Col span={7} />
							</Row>
							<Row>
								<Input.Group style={{ width: "92%" }}>
									<Input
										placeholder="Enter your email"
										prefix={
											<Icon
												type="user"
												style={{
													color: "rgba(0,0,0,.25)"
												}}
											/>
										}
										style={{
											marginLeft: "15%",
											width: "70%"
										}}
										type="text"
										value={this.state.email}
										onChange={this.handleEmailChange}
									/>
									<Input
										placeholder="Enter your password"
										prefix={
											<Icon
												type="user"
												style={{
													color: "rgba(0,0,0,.25)"
												}}
											/>
										}
										style={{
											marginLeft: "15%",
											width: "70%"
										}}
										type="password"
										value={this.state.pass}
										onChange={this.handlePassChange}
									/>
								</Input.Group>
							</Row>
						</div>
					) : (
						undefined
					)}
					<Row>
						
						<Button
							style={{
								marginLeft: "22%",
								backgroundColor: "#54B1D2",
								color: "white"
							}}
							onClick={() => {
								window.location.href = "/";
							}}
						>
							Go Back
						</Button>
						{this.props.err === "EMAIL_NOT_VERIFIED" ? (
							<Button
								type="primary"
								style={{
									marginLeft: "5%",
									width: "40%",
									backgroundColor: "#54B1D2",
									color: "white"
								}}
								onClick={ () => this.resendEmail()}
							>
								Resend Email
							</Button>
						) : (
							<Button
								type="primary"
								style={{
									marginLeft: "5%",
									width: "30%",
									backgroundColor: "#54B1D2",
									color: "white"
								}}
								disabled={
									(!(
										this.state.email.length > 0 &&
										this.state.pass.length > 0
									) ||
										this.state.loginButtonDisabled) &&
									process.env.NODE_ENV === "development"
								}
								onClick={
									process.env.NODE_ENV === "development"
										? this.signMeIn
										: () => {
												window.location.href =
													"/sign-in.php";
										  }
								}
							>
								{" "}
								{this.state.loginButtonText}{" "}
							</Button>
						)}
					</Row>
				</div>
			</Popup>
		);
	}
}

export default Login;
