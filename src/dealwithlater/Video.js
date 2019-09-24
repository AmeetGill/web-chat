import React from 'react';
import PubNub from 'pubnub';
import { connect } from 'react-redux';

class Video extends React.Component{

	call = () => {
		var peerConnectionConfig = {
			  iceServers:[
			    {urls:["stun:stun.l.google.com:19302"]}
			  ]};
		var _this = this;
		var selfView = document.getElementById('video-out');
		var remoteView = document.getElementById('video-in');
		
	    var pc = new RTCPeerConnection(peerConnectionConfig);
	    pc.onicecandidate = function (evt) {
	    	if(evt.candidate)
	        _this.props.pubnub.publish(
                {
                    message: {
                        type: 'video-answer',
                        data :{
                          candidate: evt.candidate
                        },
                        obj:{
                        	id : _this.props.app.userid,
                        	//conv : isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`
                        }
                    },
                    channel: 'iamhere',//isCaller ? `vid${_this.props.user.convId}` : `vid${msg.obj.conv}`,
                    sendByPost: false, 
                    storeInHistory: false, 
                    meta: {
                        "cool": "meta"
                    } 
                },
                function (status, response) {
                    console.log(response)
                }
            );
	    };

	    pc.ontrack = function (evt) {
	        remoteView.srcObject = evt.stream;
	    };

	    
	    function handleSuccess(stream) {
	        selfView.srcObject = stream;
	        stream.getTracks().forEach(function(track) {
			    pc.addTrack(track, stream);
			  });

	        pc.createOffer().then(function(offer) {
              return pc.setLocalDescription(offer);
            }).catch(function(error){
            	console.log('there is some error',error)
            })
            .then(function() {
              sendDescription(pc.localDescription)
            })
	    

		    function sendDescription(desc) {
	                
	                _this.props.pubnub.publish(
	                  {
	                      message: {
	                          type: 'video-offer',
	                          data: {
	                            sdp: desc
	                          },
	                          obj:{
	                          	id : _this.props.app.userid
	                          }
	                      },
	                      channel: `iamhere`,
	                      sendByPost: false, // true to send via post
	                      storeInHistory: false, //override default storage options
	                      meta: {
	                          "cool": "meta"
	                      } // publish extra meta with the request
	                  },
	                  function (status, response) {
	                     console.log(response)
	                  }
	              );
	            }
	        } 
	


		function handleError(error) {
		  console.log('getUserMedia error: ', error);
		}

		navigator.mediaDevices.getUserMedia({video:true}).then(handleSuccess).catch(handleError);
		this.globalPc = pc   
	}

	componentDidMount(){
		var  _this = this;

		this.props.pubnub.subscribe({
			channels : ['iamhere']
		})

		this.props.pubnub.addListener({
		    message: function (m) {
		        // handle message
		        var channelName = m.channel; // The channel for which the message belongs
		        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
		        var pubTT = m.timetoken; // Publish timetoken
		        var msg = m.message; // The Payload
		       	if (msg.type === 'video-offer') {
		       		if(msg.obj.id !== _this.props.app.userid){
		       			_this.call();

				    	var signal = msg.data;
					    _this.globalPc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
					    	//_this.globalPc.createAnswer(_this.globalPc.remoteDescription);
					    
					    //    _this.globalPc.addIceCandidate(new RTCIceCandidate(signal.candidate));
		 			}
		 			else{
		 				var signal = msg.data;
		 				console.log(_this.globalPc)
					    _this.globalPc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function(){

							_this.globalPc.createAnswer().then(function(answer) {
					            return _this.globalPc.setLocalDescription(answer);
					          }).catch(function(error){
					            console.log(error)
					          })
					          .then(function() {
					            _this.props.pubnub.publish(
					                    {
					                        message: {
					                            type: 'video-answer',
					                            data :{
					                              candidate: _this.globalPc.localDescription
					                            },
						                        obj:{
						                          id : _this.props.app.userid
						                        }
					                        },
					                        channel: `iamhere`,
					                        sendByPost: false, // true to send via post
					                        storeInHistory: false, //override default storage options
					                        meta: {
					                            "cool": "meta"
					                        } // publish extra meta with the request
					                    },
					                    function (status, response) {
					                        console.log(status)
					                    }
					                );
					          })
					      })
		 			}
		    	}else{
		    		if (msg.type === 'video-answer') {
		    			var signal = msg.data;
		    			if(msg.obj.id !== _this.props.app.userid){
		    				_this.globalPc.addIceCandidate(new RTCIceCandidate(signal.candidate));
		    			}else{
							_this.globalPc.addIceCandidate(new RTCIceCandidate(signal.candidate));
		    			}
		    		}
		    	}
		    },
		    presence: function (p) {
		        // handle presence
		        var action = p.action; // Can be join, leave, state-change or timeout
		        var channelName = p.channel; // The channel for which the message belongs
		        var occupancy = p.occupancy; // No. of users connected with the channel
		        var state = p.state; // User State
		        var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
		        var publishTime = p.timestamp; // Publish timetoken
		        var timetoken = p.timetoken;  // Current timetoken
		        var uuid = p.uuid; // UUIDs of users who are connected with the channel
		    },
		    status: function (s) {
		        var affectedChannelGroups = s.affectedChannelGroups;
		        var affectedChannels = s.affectedChannels;
		        var category = s.category;
		        var operation = s.operation;
		    }
		});
	}
	render(){
		return (
			<div style = {{backgroundColor:'black',position:'relative',top:0,left:0}} className = {`col-md-${this.props.width}`}>
				<button onClick = {this.call}> call </button>
				<video id = "video-in" autoPlay style = {{height:'100%',width:'100%',position:'relative',top:0,left:0}}></video> 
		     	<video id = "video-out" autoPlay style = {{position:'absolute',height:'30%',width:'33%',top:'64%',left:'0.5%'}}> </video>
		     </div>
		     );
	}
};

function mapStateToProps(state){
	return {
		pubnub : state.pubnub,
		user : state.user
	};
}

export default connect(mapStateToProps)(Video);