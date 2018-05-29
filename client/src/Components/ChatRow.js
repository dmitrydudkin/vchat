import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
});

export default class ChatRow extends Component {
  constructor(props) {
    super(props);

    this.goToChat = this.props.goToChat.bind(this, this.props.chat);
  }

  render() {
    const { id, name } = this.props.chat;

    return (
      <TouchableHighlight
        key={id}
        onPress={this.goToChat}
      >
        <View style={styles.groupContainer}>
          <Text style={styles.groupName}>{`${name}`}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

ChatRow.propTypes = {
  goToChat: PropTypes.func.isRequired,
  chat: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
