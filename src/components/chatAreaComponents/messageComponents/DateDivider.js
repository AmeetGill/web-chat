import React from "react";
import moment from 'moment';

export default props => {
	let todayDate = new Date();
	let displayContent = "";
	if (
		parseInt(props.date.substring(0, 4),10) === todayDate.getFullYear()  &&
		parseInt(props.date.substring(5, 7),10) === todayDate.getMonth() + 1
	) {
		if (parseInt(props.date.substring(8, 10),10) === todayDate.getDate()) {
			displayContent = "Today";
		} else {
			if (parseInt(props.date.substring(8, 10),10) === (todayDate.getDate() - 1) ) {
				displayContent = "Yesterday";
			} else {
				
				displayContent =  moment(props.date).format("dddd, MMMM Do")
			}
		}
	}
	else{
		displayContent =  moment(props.date).format("dddd, MMMM Do")
	}
	return (
		<div
			id = {props.id}
			className = {displayContent}
			style={{
				width: "100%",
				height: 10,
				borderBottom: "0px solid #888",
				textAlign: "center",
				marginTop: "2%",
				marginBottom: "4%"
			}}
		>
			<span
				style={{
					fontSize: "17px",
					backgroundColor: "white",
					padding: "0 8px",
					color: "black",
					fontWeight: 500
				}}
			>
				{displayContent}
			</span>
		</div>
	);
};
