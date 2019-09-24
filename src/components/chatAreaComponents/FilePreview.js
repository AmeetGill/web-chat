import React from "react";
import Popup from "reactjs-popup";
import pdfIcon from "../../pdf.png";
import unsupportedIcon from "../../unsupported-s.png";

class FilePreview extends React.Component {
  state = { currentImage: 0, comment: "" };

  componentWillMount() {
    let _this = this;
    window.onkeydown = function(e) {
      let code = e.keyCode ? e.keyCode : e.which;
      if (code === 37) {
        _this.prevPhoto();
      } else if (code === 39) {
        _this.nextPhoto();
      }
    };
  }

  handleCommentChange = e => {
    this.setState({ comment: e.target.value });
  };

  nextPhoto = () => {
    let currentImage = this.state.currentImage;
    let totalImages = this.props.files.length;

    currentImage = (currentImage + 1) % totalImages;

    this.setState({ currentImage: currentImage });
  };

  prevPhoto = () => {
    let currentImage = this.state.currentImage;
    let totalImages = this.props.files.length;

    currentImage = currentImage - 1 >= 0 ? currentImage - 1 : totalImages - 1;

    this.setState({ currentImage: currentImage });
  };

  handleClose = () => {
    this.setState({ comment: "" });
    this.props.onClose("", true);
  };

  send = () => {
    this.props.onClose(this.state.comment);
  };

  render() {
    return (
      <Popup
        open={this.props.showFilesPreview}
        modal
        contentStyle={{ height: "80%", width: "80%" }}
        closeOnDocumentClick={false}
      >
        <div className="row">
          <div className="col-xs-3" />

          <div className="col-xs-6">
            {" "}
            <input
              type="text"
              placeholder="Comment.."
              value={this.state.comment}
              onChange={this.handleCommentChange}
            />{" "}
          </div>

          <div className="col-xs-3">
            {" "}
            <a href="#" onClick={this.send} style={{ fontSize: 40 }}>
              <i class="fas fa-paper-plane" />
            </a>
            <a
              href="#"
              onClick={this.handleClose}
              style={{ fontSize: 40, float: "right" }}
            >
              <i class="fas fa-times" />
            </a>
          </div>
        </div>
        <div className="row" style={{ height: "100%" }}>
          <div className="col-xs-2" style={{ height: "100%" }}>
            <a href="#" onClick={this.prevPhoto}>
              <i
                className="fas fa-angle-left"
                style={{ fontSize: 90, marginTop: "43%" }}
              />
            </a>
          </div>
          <div
            className="col-xs-8"
            style={{ height: "80%", textAlign: "center" }}
          >
            {this.props.files[this.state.currentImage] ? (
              this.props.files[this.state.currentImage] === 12 ? (
                <img
                  src={unsupportedIcon}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    display: "block",
                    margin: "0 auto"
                  }}
                />
              ) : this.props.filesInfo[this.state.currentImage] &&
              this.props.filesInfo[this.state.currentImage].type ===
                "application/pdf" ? (
                <div>
                  <img
                    src={pdfIcon}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                  File Name :-
                  {this.props.filesInfo[this.state.currentImage].name}
                </div>
              ) : (
                <img
                  src={this.props.files[this.state.currentImage]}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    display: "block",
                    margin: "0 auto"
                  }}
                />
              )
            ) : this.props.files.length > 0 ? (
              <p>File size Exceeds Size limit (5 mb)</p>
            ) : (
              undefined
            )}
          </div>
          <div className="col-xs-2" style={{ height: "100%" }}>
            <a href="#" onClick={this.nextPhoto}>
              <i
                className="fas fa-angle-right"
                style={{
                  fontSize: 90,
                  float: "right",
                  marginTop: "43%"
                }}
              />
            </a>
          </div>
        </div>
      </Popup>
    );
  }
}

export default FilePreview;
