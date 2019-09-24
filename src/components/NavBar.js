import React from "react";
import { connect } from "react-redux";
import noNotifications from "../img/no-notification.png";
import defaultProfile from "../img/default-profile.jpg";
import heartIcon from "../img/Heart-Icon.png";
import logoHeader from "../img/Logo-header.png";
import profileIcon from "../img/profile-icon.png";
import searchArrow from "../img/search-drop-down-arrow.png";
import settingsIcon from "../img/settings-icon.png";
import signOut from "../img/sign-out.png";
import $ from "jquery";
import man from "../coreIMAGES/man.svg";
import woman from "../coreIMAGES/woman.svg";
import doctorFemale from "../coreIMAGES/doctor_female.svg";
import doctorMale from "../coreIMAGES/doctor_male.svg";
import dentist from "../img/dentist-img.png";
import logo from "../coreIMAGES/logo.png";
import moment from "moment";
import "./NavBar.css";
import { tab } from "jquery-ui";
import { Tooltip } from "antd";

class NavBar extends React.Component {
  state = {
    showDropdown: false,
    newMessages: 0,
    showIcons: true
  };
  /* componentWillMount () {
    const script = document.createElement("script");
    const script2 = document.createElement("script");
    const script3 = document.createElement("script");

    script.src = "../helperFunctions/LandingPage_UI_BEHAVIORS.js";
    script.async = true;

    script2.src = "../helperFunctions/CORE_GlobalFunctions.js";
    script2.async = true;

    script3.src = "../helperFunctions/home.js";
    script3.async = true;

    document.body.appendChild(script);
    document.body.appendChild(script2);
    document.body.appendChild(script3);
  } */

  toggleMenu = () => {
    this.setState({ menuRendered: !this.state.menuRendered });
  };

  signout = () => {
    console.log("signing out")
    localStorage.clear();
    try {
      $.removeCookie("user_email");
      $.removeCookie("user_type");
      $.removeCookie("user_token");
    } catch (e) {}
    window.location = "/sign-in.php";
  };

  handleClick = () => {
    if (!this.state.showDropdown) {
      this.setState({ showDropdown: true });
      $(".img-holder").attr("aria-expanded", "true");
    } else {
      this.setState({ showDropdown: false });
      $(".img-holder").attr("aria-expanded", "false");
    }
  };
  componentDidMount() {
    if (typeof app_url === "undefined") {
      var server = window.location.hostname;
    }

    var userprofile;
    var btid;

    if (localStorage.getItem("user_type") == 1) {
      var settings_user = {
        async: true,
        crossDomain: true,
        url: app_url + "/v1/doctor",
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("user_token")
        }
      };

      $.ajax(settings_user).done(function(response) {
        btid = response.braintree_id;
        userprofile = response;
        $("#modalsettings input[name=id]").val(userprofile.ID);
        $("#modalsettings input[name=email]").val(userprofile.email);
        $("header .account label").html(
          response.firstName + " " + response.lastName
        );

        if (userprofile.mainSpecialtyID.indexOf(",") > -1) {
          var tmpspecialty = userprofile.mainSpecialtyID.split(",");
          var specialty = tmpspecialty[0];
        } else {
          var specialty = userprofile.mainSpecialtyID;
        }

        if (response.picture != "") {
          $("header .account .img-holder img").attr(
            "src",
            response.picture.replace("http://", "//")
          );
        } else {
          if (
            specialty.toLowerCase() == "dental lab" ||
            specialty.toLowerCase() == "dentist"
          ) {
            $("header .account .img-holder img").attr("src", dentist);
          } else {
            $("header .account .img-holder img").attr(
              "src",
              response.gender == "Male" ? doctorMale : doctorFemale
            );
          }
        }

        var user_lat = parseFloat(response.latitude);
        var user_long = parseFloat(response.longitude);

        if ($(".orderlink").hasClass("active")) {
          // GET USER ORDERS
          var settings_user = {
            async: true,
            crossDomain: true,
            url: app_url + "/v1/orders",
            method: "GET",
            headers: {
              "content-type": "application/json",
              authorization: localStorage.getItem("user_token")
            }
          };
          $.ajax(settings_user).done(function(response) {
            $(".order-list .box-footer .col4").click(function() {
              var id = $(this).html();
              // GET USER ORDERS
              var settings_user = {
                async: true,
                crossDomain: true,
                url:
                  app_url +
                  "/v1/order/" +
                  $(this)
                    .html()
                    .replace("#FN-", ""),
                method: "GET",
                headers: {
                  "content-type": "application/json",
                  authorization: localStorage.getItem("user_token")
                }
              };

              $.ajax(settings_user).done(function(response) {
                var dropoffvalname = "",
                  pickupvalname = "";
                var tmp1 = response.order.dropoffPackageSmallName.split(",");
                var tmp2 = response.order.dropoffPackageLargeName.split(",");
                var tmp3 = response.order.pickupPackageSmallName.split(",");
                var tmp4 = response.order.pickupPackageLargeName.split(",");
                if (tmp1.length > 1) {
                  dropoffvalname = response.order.dropoffPackageSmallName;
                } else {
                  if (tmp1[0] != "") {
                    dropoffvalname = tmp1[0];
                  }
                }
                if (tmp2.length > 1) {
                  dropoffvalname +=
                    ", " + response.order.dropoffPackageLargeName;
                } else {
                  if (tmp2[0] != "") {
                    dropoffvalname += ", " + tmp2[0];
                  }
                }
                if (tmp3.length > 1) {
                  pickupvalname = response.order.pickupPackageSmallName;
                } else {
                  if (tmp3[0] != "") {
                    pickupvalname = tmp3[0];
                  }
                }
                if (tmp4.length > 1) {
                  pickupvalname += ", " + response.order.pickupPackageLargeName;
                } else {
                  if (tmp4[0] != "") {
                    pickupvalname += ", " + tmp4[0];
                  }
                }
                var tmpdate = response.order.deliveryDate.split("T");
                var tmpdate2 = tmpdate[0].split("-");
                var deliverydate =
                  tmpdate2[1] + "/" + tmpdate2[2] + "/" + tmpdate2[0];

                if (response.order.deliverySchedule == "Rush") {
                  var tmptime = response.order.deliveryTime.split(":");
                  if (parseInt(tmptime[0]) < 12) {
                    var ampm = " PM";
                  } else {
                    var ampm = " AM";
                  }

                  var deliverytime = response.order.deliveryTime + ampm;
                } else {
                  var deliverytime = response.order.deliverySchedule;
                }

                var dropoffval =
                  parseInt(response.order.dropoffPackageLarge) +
                  parseInt(response.order.dropoffPackageSmall);
                var pickupval =
                  parseInt(response.order.pickupPackageLarge) +
                  parseInt(response.order.pickupPackageSmall);
                $("#modalorderdetails .name").html(response.order.pickupName);
                $("#modalorderdetails .clinic").html(
                  response.order.pickupLocationName
                );
                $("#modalorderdetails .address").html(
                  '<img class="icons address-icon" src="img/location-icon.png" alt=""> ' +
                    response.order.pickupAddress +
                    "<br>" +
                    response.order.pickupCity +
                    ", " +
                    response.order.pickupState +
                    " " +
                    response.order.pickupZip
                );
                $("#modalorderdetails .col4").html(deliverytime); // id
                $("#modalorderdetails .col6").html("$" + response.order.price);
                $("#modalorderdetails .col5").html(deliverydate);
                $("#modalorderdetails .dropoffvalsmall").html(
                  response.order.dropoffPackageSmall
                );
                $("#modalorderdetails .dropoffvallarge").html(
                  response.order.dropoffPackageLarge
                );
                $("#modalorderdetails .pickupvalsmall").html(
                  response.order.pickupPackageSmall
                );
                $("#modalorderdetails .pickupvallarge").html(
                  response.order.pickupPackageLarge
                );
                $("#modalorderdetails .dropoffvalname").html(dropoffvalname);
                $("#modalorderdetails .pickupvalname").html(pickupvalname);
                $("#modalorderdetails,#modalbg").fadeIn();
              });
            });
            $("select[name=showlist]").change();
          });

          //GET RX
          var settings_rx = {
            async: true,
            crossDomain: true,
            url: app_url + "/v1/rx",
            method: "GET",
            headers: {
              "content-type": "application/json",
              authorization: localStorage.getItem("user_token")
            }
          };
          $.ajax(settings_rx).done(function(responserx) {
            if (
              responserx.status != "completed" ||
              responserx.status != "reject"
            ) {
              $("#totalrxcount").html(responserx.length);
            }
          });
        }
      });
    } else {
      var settings_user = {
        async: true,
        crossDomain: true,
        url: app_url + "/v1/patient",
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("user_token")
        }
      };
      $.ajax(settings_user).done(function(response) {
        if (response.image_url != "") {
          $("header .account .img-holder img").attr(
            "src",
            response.image_url.replace("http://", "//")
          );
        } else {
          $("header .account .img-holder img").attr(
            "src",
            response.gender == "Male" ? man : woman
          );
        }
      });
    }

    

   
  }

  componentDidUpdate(prevProps) {
    let prevMessageCount = 0;
    let newMessageCount = 0;
    // prevProps.chats.forEach(prevChat => {
    //   console.log(prevChat);
    //   prevMessageCount += prevChat.new_msg_count;
    // });
    this.props.chats.forEach(chat => {
      newMessageCount += chat.new_msg_count;
    });
    console.log(prevMessageCount, newMessageCount);
    if (newMessageCount !== this.state.newMessages) {
      this.setState({ newMessages: newMessageCount });
    }
  }

  render() {
    return (
      <header>
        {this.state.showDropdown ? (
          <ul
            className="my-dropdown"
            style={{
              position: "absolute",
              zIndex: 3,
              backgroundColor: "white",
              width: 160,
              color: "black",
              display: "block",
              border: "1px solid rgba(0,0,0,.15)",
              textAlign: "left",
              borderRadius: 4
            }}
          >
            <li param="profile">
              <a href = '/settings.php#profile'>
                <span>
                  <i class="far fa-user" />
                </span>
                Profile
              </a>
            </li>
            {parseInt(localStorage.getItem("user_type")) === 1 ? (
              <li param="payment" >
                <a href="/settings.php#billing">
                  <span>
                    <i class="fas fa-credit-card" />
                  </span>
                  Payment
                </a>
              </li>
            ) : (
              undefined
            )}

            <li param="settings">
              <a href = '/settings.php#credentials'>
                <span>
                  <i class="fas fa-sliders-h" />
                </span>
                Settings
              </a>
            </li>
            <li id="signout">
              <a onClick = {this.signout} style = {{textDecoration:'none'}}>
                <span>
                  <i class="fas fa-sign-out-alt" />
                </span>
                Sign Out
              </a>
            </li>
          </ul>
        ) : (
          undefined
        )}
        <div
          style={{
            height: 62,
            backgroundColor: "#185A9D",
            zIndex: 2,
            position: "absolute",
            width: "100%"
          }}
        >
          <a
            style={{
              paddingTop: 10,
              display: "inline-block",
              marginLeft: "6.5%"
            }}
            href="/"
          >
            <img src={logo} />
          </a>

          <ul id="headers-icons">
            <li class="account-menu">
              <a
                onClick={this.handleClick}
                style={{ curson: "pointer", paddingTop: 10 }}
              >
                <div class="dropdown-btn">
                  <div class="account" style={{ display: "inline" }}>
                    <div
                      class="img-holder dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <img src="coreIMAGES/man.svg" />
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <Tooltip placement="bottom" title="Chat">
                <a href="/chat3.php" style = {{height:57.5}}>
                  {" "}
                  <i
                    style={{ fontSize: 20, color: "#FFDE03" }}
                    class="fas fa-comment-alt"
                  />
                </a>
              </Tooltip>
              <div style = {{backgroundColor:'#FFDE03',height:3}} ></div>
            </li>
            <li>
              <Tooltip placement="bottom" title="Calendar">
                <a href="/new-calendar.php">
                  {" "}
                  <i
                    style={{ fontSize: 20, color: "#FFDE03" }}
                    class="far fa-calendar-alt"
                  />
                </a>
              </Tooltip>
            </li>
            <li>
              <Tooltip placement="bottom" title="Chatbot">
                <a href="chatbot.php" >
                    <i style={{ fontSize: 20, color: "#FFDE03" }} class="fas fa-robot"></i>
                </a>
              </Tooltip>
            </li>
          </ul>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    chats: state.chats
  };
}

export default connect(mapStateToProps)(NavBar);
