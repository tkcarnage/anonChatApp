import React from 'react';

const userListStyle = {
	width:'300px', 
	height:'450px',
	paddingLeft: '20px',
	paddingRight: '20px',
	borderRight: '3px solid #8b9dc3',
	overflowY: 'auto'
}

const childStyle = {
	margin: '0px',
	padding: '5px'
}

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	
  	let listOfUsers = this.props.users.map((user, index) => {
  		if(this.props.typingUsers[user]) {
  			return <div style={childStyle} key={index}> - {user} is typing...</div>
  		}
  		return <div style={childStyle} key={index}> - {user}</div>
  	});

    return (
      <div style={userListStyle}>
      	<h3 style={{color: '#3b5998'}}>USERS</h3>
      	{listOfUsers}
      </div>
    );
  }
}