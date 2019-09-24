*	function handleSuccess(stream) {
		  window.stream = stream; // only to make stream available to console
		  video1.srcObject = stream;
		  video2.srcObject = stream;
		}

		function handleError(error) {
		  console.log('getUserMedia error: ', error);
		}

		navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
	*/
