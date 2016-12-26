import React from 'react';
import UsersList from './Components/UsersList';
import MessagesList from './Components/MessagesList';
import Status from './Components/Status';
import ChatInput from './Components/ChatInput';
import './App.css';

const containerStyle = {
  backgroundColor: '#ffffff',
  width: '900px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '2px',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
}

const titleStyle = {
  backgroundColor: '#3b5998',
  color: '#ffffff',
  width: '100%',
  textAlign: 'center',
  paddingTop: '30px',
  paddingBottom: '20px',
  fontSize: '50px',
  fontWeight: '700'
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      users: [],
      messages: [],
      status: '',
      typingUsers: {}
    };
  }

  componentDidMount() {
    socket.emit('mounted', 'the app mounted');
    socket.on('getUsersAndMessages', this.getUsersAndMessages.bind(this));
    socket.on('receiveMessage', this.receiveMessage.bind(this));
    socket.on('userEntered', this.userEntered.bind(this));
    socket.on('userLeft', this.userLeft.bind(this));
    socket.on('addNewUserTyping', this.addNewUserTyping.bind(this));
    socket.on('removeNewUserStopTyping', this.removeNewUserStopTyping.bind(this));
  }

  getUsersAndMessages(data) {
    this.setState({
      currentUser: data.currentUser,
      users: data.users,  
      messages: data.messages,
      typingUsers: data.typingUsers
    });
    console.log('INIT', data);
  }

  receiveMessage(message) {
    let newMessages = this.state.messages.slice();
    newMessages.push(message);

    this.setState({
      messages: newMessages
    });
  }

  userEntered(name) {
    let newUsers = this.state.users
    newUsers.push(name);
    let newStatus = name + ' entered';

    this.setState({
      users: newUsers,
      status: newStatus
    });
  }

  userLeft(name) {
    let newUsers = this.state.users.filter((user) => {
      return user !== name;
    });
    let newStatus = name + ' left';

    this.setState({
      users: newUsers,
      status: newStatus
    });
  }

  thisUserTyping(name) {
    if(!this.state.typingUsers[name]) {
      socket.emit('addTypingUser', name);
    }
  }

  thisUserStopTyping(name) {
    socket.emit('removeTypingUser', name);
  }

  addNewUserTyping(name) {
    let newTypingObj = Object.assign({}, this.state.typingUsers);
    newTypingObj[name] = true;
    this.setState({
      typingUsers: newTypingObj
    });
  }

  removeNewUserStopTyping(name) {
    let newTypingObj = Object.assign({}, this.state.typingUsers);
    delete newTypingObj[name];
    this.setState({
      typingUsers: newTypingObj
    });
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>Anonymous Chat</div>
        <div style={{display: 'flex', width: '900px'}}>
          <UsersList 
          users={this.state.users}
          typingUsers={this.state.typingUsers}
          />
          <MessagesList messages={this.state.messages}/>
        </div>
        <Status status={this.state.status}/>
        <ChatInput 
        handleTyping={this.thisUserTyping.bind(this)} 
        handleStopTyping={this.thisUserStopTyping.bind(this)} 
        currentUser={this.state.currentUser}/>
      </div>
    );
  }
}
