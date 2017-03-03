import React, { Component } from 'react';
import MessagePane from './MessagePane';
import ChannelList from './ChannelList';

//import { getMessages, getChannels, saveMessage, onNewMessage } from './storage';

import './App.css';

const messages = [
  {
    id: 1,
    text: 'this is hardcoded',
    author: 'Nathan',
    channel_id: 1
  },
  {
    id: 2,
    text: 'hello',
    author: 'Emanuel',
    channel_id: 1
  },
  {
    id: 3,
    text: 'Ello',
    author: 'Meg',
    channel_id: 2
  },
  {
    id: 4,
    text: 'hi to you too from another channel',
    author: 'Jeff',
    channel_id: 2
  }
];

const channels = [
  { id: 1, name: 'Room 1' },
  { id: 2, name: 'Room 2' },
  { id: 3, name: 'Room 3' },
];


class App extends Component {
  constructor() {
    super();
    this.state = {
      messages,
      channels,
      selected_channel_id: channels[0].id
    };

    this.onSendMessage = this.onSendMessage.bind(this);
    this.onChannelSelect = this.onChannelSelect.bind(this);
  }




  onSendMessage(author, text) {
    const new_message = {
      id: this.state.messages[this.state.messages.length - 1].id + 1,
      author,
      text,
      channel_id: this.state.selected_channel_id
    };

    const messages = [...this.state.messages, new_message];
    this.setState({messages});
  }

  onChannelSelect(id) {
    this.setState({ selected_channel_id: id });
  }

  filteredMessages() {
    return this.state.messages.filter(({channel_id}) => channel_id === this.state.selected_channel_id);
  }

  render() {
    return (
      <div className="App">
        <ChannelList
          channels={this.state.channels}
          selectedChannelId={this.state.selected_channel_id}
          onSelect={this.onChannelSelect}
        />
        <MessagePane messages={this.filteredMessages()} onSendMessage={this.onSendMessage} />
      </div>
    );
  }
}

export default App;
