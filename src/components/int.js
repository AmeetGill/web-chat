<a
					href="#!"
					onClick={this.toggelVideo}
					style={{ position: "absolute", top: "92%", left: "55%" }}
				>
					{this.state.videoOn ? (
						<i
							class="material-icons"
							style={{ color: "white", fontSize: "50px" }}
						>
							videocam
						</i>
					) : (
						<i
							class="material-icons"
							style={{ color: "red", fontSize: "50px" }}
						>
							videocam_off
						</i>
					)}
				</a>