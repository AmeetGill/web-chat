import React from "react";

export default props => {
	return (
		<div
			id="divider"
			style={{
				width: "100%",
				height: props.type === "Loaded Messages" ? 0 : 10,
				borderBottom:  props.type === "Loaded Messages" ? 0 : " 1px solid rgb(108, 92, 231)",
				textAlign: "right",
				marginTop:"2%",
				marginBottom:"4%"
			}}
		>
			<span
				style={{
					fontSize: props.type === "Loaded Messages" ? 0 : 17,
					backgroundColor: "#e8e6f5",
					padding: "0 8px",
					marginRight:"6%",
					color:'#595959',
					border:  props.type === "Loaded Messages" ? 0 : " 1px solid rgb(108, 92, 231)"
				}}
			>
				{props.type}
			</span>
		</div>
	);
};
