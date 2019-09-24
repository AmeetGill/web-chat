import React from "react";

export default props => {
	let todayDate = new Date();
	let displayContent = "";

	if (
		parseInt(props.date.substring(0, 4)) === todayDate.getFullYear() &&
		parseInt(props.date.substring(5, 7)) === todayDate.getMonth() + 1
	) {
		if (parseInt(props.date.substring(8, 10)) == todayDate.getDate()) {
			displayContent = "Today";
		} else {
			if (
				parseInt(props.date.substring(8, 10)) ==
				todayDate.getDate() - 1
			) {
				displayContent = "Yesterday";
			} else {
				displayContent = props.date;
			}
		}
	} else {
		displayContent = props.date;
	}
	return <div  id={"div"+props.no} className={displayContent} ></div>;
};
