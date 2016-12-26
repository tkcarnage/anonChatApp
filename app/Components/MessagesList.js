import React from 'react';

const messageListStyle = {
	width:'600px', 
	height:'450px',
	paddingLeft: '20px',
	paddingRight: '20px',
	overflowY: 'auto'
}

export default class MessagesList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

  	let listOfMessages = this.props.messages.map((message, index) => {
      if(index % 2 === 0) {
        return <div style={{padding: '5px', backgroundColor:'#dfe3ee'}} key={index}>{message.user}: {message.message}</div>
      }
  		return <div style={{padding: '5px'}} key={index}>{message.user}: {message.message}</div>
  	});

    return (
      <div style={messageListStyle}>
      	<h3 style={{color: '#3b5998'}}>MESSAGES</h3>
      	{ listOfMessages }
      </div>
    );
  }
}