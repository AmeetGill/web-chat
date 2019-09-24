import React from "react";
import Input from "./chatsComponents/Input";
import Chat from "./chatsComponents/Chat";
import { Card } from "antd";
import { connect } from "react-redux";
import { List } from "react-virtualized";
import * as actions from "../actions";

class Chats extends React.Component {
  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
  }
  state = { reRenderList: true, scrollTop: null };
  static scrollTop = -1;

  renderRow({ index, key, parent, style, isScrolling }) {
    let chat = this.props.chats[index];
    //console.log("chat name "+chat.FirstName)
    // console.log(window.location.hash.indexOf("uId" + chat.UserID) >= 0 )
    let cond1 =
      window.location.hash.indexOf("id" + chat.ID) >= 0 &&
      window.location.hash.length - 1 === ("id" + chat.ID).length;
    let cond2 =
      window.location.hash.indexOf("uId" + chat.UserID) >= 0 &&
      window.location.hash.length - 1 === ("uId" + chat.UserID).length;
    var cond12 = cond1 || cond2;
    return (
      <div style={style} key={key}>
        <Chat
          name={chat.FirstName + " " + chat.LastName}
          lastMessage={
            chat.LastMessageContent.content instanceof Array
              ? chat.LastMessageContent.content.join(" ")
              : chat.LastMessageContent.content
          }
          index={index}
          isMobile={this.props.isMobile}
          userId={chat.UserID}
          convId={chat.ID + ""}
          loginId={chat.login_id}
          img={chat.ImageURL}
          app={this.props.app}
          online={chat.online}
          new_msg_count={chat.new_msg_count}
          muted={chat.Muted}
          blocked={chat.Blocked}
          shiftedToTop={chat.shiftedToTop}
          gender={chat.Gender}
          style={style}
          activeChat={cond12}
          specialty={chat.specialty}
          insurance={chat.insurance}
          dob={chat.dob}
          userType={chat.user_type}
        />
      </div>
    );
  }
  //.ljljjjjjhhhhhhhhhhhhhhhhhhhk
  closeNav() {
    document.getElementById("chats-sider").style.width = "0%";
  }
  componentWillReceiveProps(newProps) {
    if (newProps.chats.length > 0 && newProps.chats[0].shiftedToTop) {
      Chats.scrollTop = 0;
      this.props.make_shifted_property_false(newProps.chats);
      this.setState({ reRenderList: !this.state.reRenderList, scrollTop: 0 });
      setTimeout(() => {
        this.setState({ scrollTop: null });
      }, 500);
    } else {
      this.setState({
        reRenderList: !this.state.reRenderList,
        scrollTop: null
      });
    }
  }

  render() {
    if (
      this.props.chats.length === 0 &&
      this.props.app["patients"].length === 0 &&
      !this.props.noChat
    ) {
      return (
        <div style={{ height: "100%", backgroundColor: "#ffffff", width: 500 }}>
          <Card
            bordered={false}
            style={{
              width: "101.95%",
              paddingRight: "12%",
              backgroundColor: "#ffffff"
            }}
            loading={true}
          />
          <Card
            bordered={false}
            style={{
              width: "101.95%",
              paddingRight: "12%",
              paddingTop: "-23%",
              backgroundColor: "#ffffff"
            }}
            loading={true}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          height: "100%",
          backgroundColor: "#ffffff",
          width: 500,
          paddingLeft: -8,
          paddingRight: 6
        }}
      >
        <Input app={this.props.app} />
        <div
          style={{
            height: "100%",
            width: "100%"
          }}
          id="chats"
        >
          <List
            width={510}
            height={window.innerHeight * 0.8}
            rowHeight={220}
            rowRenderer={this.renderRow}
            rowCount={this.props.chats.length}
            overscanRowCount={2}
            renderAgain={this.state.reRenderList}
            scrollTop={this.state.scrollTop}
            style={{ outline: "none" }}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pubnub: state.pubnub,
    chats: state.chats,
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  actions
)(Chats);
