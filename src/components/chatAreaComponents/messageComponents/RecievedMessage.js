import React from 'react';
import InnerBox from './InnerBox';


export default (props) => {
	return (
			<div style = {{marginTop:0,marginBottom:0}} className = "row">
				<div className = "col-md-10">
					<InnerBox 
						sent={false} 
						message = {props.message}
						wordDesc = {props.wordDesc}
						id = {props.id}
						time = {props.time}
						nock = {props.nock}
						file={props.file}
						fileType = {props.fileType}
						lastMessageNock = {props.lastMessageNock}
					/>
				</div>
			</div>			
		);
}