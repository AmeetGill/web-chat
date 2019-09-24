import React from "react";
import $ from "jquery";

class Image extends React.Component {
  state = { loadComplete: false, error: false };
  handleImageLoaded() {
    this.setState({ loadComplete: true });
  }

  handleImageErrored() {
    setTimeout(() => this.setState({ error: true }), 2000);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            height: 234,
            minWidth: 194,
            position: "relative"
          }}
        >
          <a
            href="#"
            onClick={() => {
              this.setState({ loadComplete: false, error: false });
            }}
            style={{
              top: "30%",
              left: "25%",
              position: "absolute",
              color: "green"
            }}
          >
            <i className="large material-icons">autorenew </i>
            <p
              style={{
                display: "block"
              }}
            >
              Error Loading Image
            </p>
          </a>
        </div>
      );
    }

    if (this.state.loadComplete) {
      return (
        <a
          href="#"
          onClick={event => {
            let src = $(event.target).children("img").prevObject[0].src;
            $("#previewImage").attr("src", src);
            $("#modalbg3").fadeIn();
            $("#modalbg3").click(e => {
              if (e.target.id !== "previewImage") $("#modalbg3").fadeOut();
            });
            $(window).keypress( () => {
              $("#modalbg3").fadeOut();
            })
          }}
          style={{
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            height: 234,
            minWidth: 194,
            borderRadius: this.props.border
          }}
        >
          <img
            height="134"
            alt="Loading Image"
            className="embeddedImage"
            src={this.props.file}
            style={{
              borderRadius: 10,
              margin: 0,
              display: "block",
              position: "absolute",
              top: "50%",
              left: "50%",
              minHeight: "100%",
              minWidth: "100%",
              transform: "translate(-50%, -50%)"
            }}
          />
        </a>
      );
    }

    if (!this.state.loadComplete) {
      return (
        <div
          style={{
            height: 234,
            minWidth: 194,
            position: "relative"
          }}
        >
          <div
            className="preloader-wrapper small active"
            style={{ top: "40%", left: "40%", position: "absolute" }}
          >
            <div className="spinner-layer spinner-green-only">
              <div className="circle-clipper left">
                <div className="circle" />
              </div>
              <div className="gap-patch">
                <div className="circle" />
              </div>
              <div className="circle-clipper right">
                <div className="circle" />
              </div>
            </div>
          </div>
          <img
            src={this.props.file}
            style={{
              width: 0,
              height: 0
            }}
            onLoad={this.handleImageLoaded.bind(this)}
            onError={this.handleImageErrored.bind(this)}
          />
        </div>
      );
    }
  }
}

export default Image;
