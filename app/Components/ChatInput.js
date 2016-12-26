import React from 'react';

const chatInputStyle = {
	width:'900px',
	height: '75px',
	backgroundColor: '#8b9dc3',
	color: '#ffffff'
}

const formStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
}

const inputStyle = {
  width: '400px',
  height: '30px'
}

export default class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	message: ''
    }
  }

  handleSubmit(e) {
  	e.preventDefault();
  	socket.emit('sendMessage', {
  		user: this.props.currentUser,
  		message: this.state.message
  	});
  	this.setState({
  		message: ''
  	});
  	this.props.handleStopTyping(this.props.currentUser);
  }

  handleOnChange(e) {
  	e.preventDefault();
  	this.setState({
  		message: e.target.value
  	});
  	if(e.target.value) {
  		this.props.handleTyping(this.props.currentUser);
  	}
  	if(!e.target.value) {
  		this.props.handleStopTyping(this.props.currentUser);
  	}
  }

  render() {
    return (
      <div style={chatInputStyle}>
      	<form style={formStyle}>
          <div style={{margin: '10px', fontSize: '20px'}}>Message:</div>
          <input type='text' style={inputStyle} value={this.state.message} 
          onChange={this.handleOnChange.bind(this)}/>
	        <input type='submit' value='Submit' onClick={this.handleSubmit.bind(this)} />
        </form>
      </div>
    );
  }
}