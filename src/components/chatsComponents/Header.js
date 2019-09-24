import React from "react";
import { connect } from "react-redux";

const listStyle = {
	backgroundColor: "#54B1D2",
	height: "14%",
	marginBottom: "0px"
};

class Header extends React.Component {
	render() {
		return (
			<div style={listStyle} className="row">
				{this.props.img ? (
					<img
						src={this.props.img}
						style={{
							height: "85%",
							width: "24%",
							marginTop: "3%",
							marginLeft: "10%"
						}}
						alt=""
						className="circle"
					/>
				) : (
					<div
						className="circle-my-avatar"
						style={{
							width: "25%",
							backgroundColor: "#7c1c1c",
							borderRadius: "60%",
							height: "90%",
							marginLeft: "12%",
							marginTop: "3%"
						}}
					>
						<span className="circle-my-avatar-text" style = {{fontSize:"4vw"}}>
							{this.props.app.name.charAt(0).toUpperCase()}
						</span>
					</div>
				)}
				<ul style={{ marginTop: "6%", marginLeft: "2%" }}>
					<li>
						<h5 style={{ color: "white" }}>
							{this.props.app.name}
						</h5>
					</li>
					<li>
						<p style={{ color: "white", marginTop: -10 }}>
							{this.props.chats.length !== 0 ? "Available" : ""}
						</p>
					</li>
				</ul>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		chats: state.chats
	};
}

export default connect(mapStateToProps)(Header);
