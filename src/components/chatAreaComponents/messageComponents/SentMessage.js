import React from 'react';
import InnerBox from './InnerBox';

export default (props) => {
	return (
			<div style = {{marginBottom:0}} className = "row">
				<div className = "col-md-2" />
				<div className = "col-md-10">
					<InnerBox 
						sent={true} 
						message = {props.message}
						wordDesc = {props.wordDesc}
						app = {props.app}
						id = {props.id}
						time = {props.time}
						nock = {props.nock}
						file={props.file}
						fileType = {props.fileType}
						lastMessageNock = {props.lastMessageNock}
						offline = {props.offline}
					/>
				</div>
			</div>			
		);
}