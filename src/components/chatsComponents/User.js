import React from "react";
import * as actions from "../../actions/index";
import { connect } from "react-redux";
import "./User.css";

class User extends React.Component {

  render() {
    return(
      <ul 
        className="selected-user"
        style={{
          position: this.props.mode === "video" ? "absolute" : "static",
          width: this.props.mode === "video" ? "250px" : "auto",
          top: "15px",
          left: "5%"
        }}
      >
          <li className="username">
            {this.props.user.name && this.props.user.name.length > 2
              ? this.props.user.name
              : "no name"}
          </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(
  mapStateToProps,
  actions
)(User);