import React from 'react';

const statusStyle = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width:'900px', 
	height:'50px',
	backgroundColor: '#8b9dc3',
	color: '#ffffff',
  fontSize: '20px'
}

export default class Status extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={statusStyle}>
      	<div style={{paddingRight: '40px'}}>{this.props.status}</div>
      </div>
    );
  }
}