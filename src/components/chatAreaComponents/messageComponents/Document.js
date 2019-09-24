import React from 'react';
import img from '../../../pdf.png';

export default (props) => {
	return(
		<a download href = {props.file} target = "_blank">
			<img height = {67} src = {img} />
		</a>
	);
};