import React from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import $ from 'jquery';

import './input.css'

class Input extends React.Component {
	state = {
		value : "",
		inputVisible: false,
	};

	handleChange = (event) => {
		this.props.searchPatient(this.props.app,event.target.value)
		this.setState({value : event.target.value})
	}
	componentDidMount(){
		if(window.location.hash.length > 4){
			let index = 4;
			let userId = window.location.hash.substring(index);

			if(this.props.app["UserToConv"][userId]){
				let convId = this.props.app["UserToConv"][userId].convId
				if(convId){
					let name = this.props.app["patientsObj"][convId].name
					if(name){
						$('#chats-search-input').val(name);
						this.props.searchPatient(this.props.app,name);
						window.location.hash = ""
					}
				}
			}
		}
	}

	// renderInput = () => {
	// 	this.setState({inputVisible: !this.state.inputVisible});
	// }
	
	render(){
		return(
			<div className="chats-header" >
				<div class="chat-search">
					<i class="fa fa-search">
					</i>
        </div>
				<div className="chat-records">
						<input 
							className="chats-input"
							type="text"
							id = "chats-search-input"
							placeholder = "Search Contacts...."
							value={this.state.value}
							onChange={this.handleChange}
							style={{
								border: "0px",
								boxShadow: "none",
								outline: "none",
							}}
						/>
				</div>
			</div>
			);
	}
}



export default connect(null,actions)(Input);