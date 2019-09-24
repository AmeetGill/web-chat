import React from ‘react’;

    class reactComponent from React.Component {
        state = {clicked : true}

        handleClick = (e) =>{
            if (e.key === "Enter") {
      e.preventDefault();
      this.setState({clicked});
    }
}

render(){
            return (
                () => {
                    if (this.state.clicked) {

                    }
else{

}           
                }
)
        