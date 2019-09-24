import React from "react";
import { Row, Col } from "react-flexbox-grid";
import { Icon } from "antd";

class Device extends React.Component {
	render() {
		return (
			<a
				href="#"
				className="list-group-item list-group-item-action"
				id={this.props.id}
				key={this.props.id}
				onClick={this.props.onClick}
				style={{
					backgroundColor: this.props.selected ? "#32a698" : "white"
				}}
			>
				{this.props.label}
			</a>
		);
	}
}

export default Device;
