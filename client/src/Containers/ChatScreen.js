import React from 'react';
import PropTypes from 'prop-types';

import { GiftedChat } from 'react-native-gifted-chat';
import { graphql, compose } from 'react-apollo';
import { View, StyleSheet } from 'react-native';
import update from 'immutability-helper';

import CHAT_QUERY from '../Graphql/chat.query';
import SEND_MESSAGE from '../Graphql/send-message.mutation';
import MESSAGE_ADDED_SUBSCRIPTION from '../Graphql/message-added.subscription';

import prepareMessages from '../Utils/prepareMessage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});

class ChatScreen extends React.Component {
  componentWillReceiveProps() {
    if (!this.subscription) {
      this.subscription = this.props.subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: {
          groupIds: [this.props.navigation.state.params.chatId],
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          const newMessage = subscriptionData.data.messageAdded;

          const newState = update(previousResult, {
            group: {
              messages: {
                $unshift: [newMessage],
              },
            },
          });

          return newState;
        },
      });
    }
  }

  onSend(messages = []) {
    this.props.createMessage({
      groupId: this.props.navigation.state.params.chatId,
      userId: this.props.navigation.state.params.user.id, // faking the user for now
      text: messages[0].text,
    });
  }

  render() {
    const { loading, group, navigation } = this.props;

    return (
      <View style={styles.container}>
        <GiftedChat
          isLoadingEarlier={loading}
          showAvatarForEveryMessage
          messages={prepareMessages(group && group.messages)}
          onSend={messages => this.onSend(messages)}
          renderAvatarOnTop
          user={{
            _id: navigation.state.params.user.id,
          }}
        />
      </View>
    );
  }
}

ChatScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  group: PropTypes.any,
  navigation: PropTypes.object.isRequired,
  createMessage: PropTypes.func,
  subscribeToMore: PropTypes.func,
};

const chatQuery = graphql(CHAT_QUERY, {
  options: ownProps => ({
    variables: { groupId: ownProps.navigation.state.params.chatId },
  }),
  props: ({ data: { loading, group, subscribeToMore } }) => ({
    loading,
    group,
    subscribeToMore,
  }),
});

const sendMessage = graphql(SEND_MESSAGE, {
  props: ({ ownProps, mutate }) => ({ // eslint-disable-line
    createMessage: ({ text, userId, groupId }) =>
      mutate({
        variables: { text, userId, groupId },
      }),
  }),
});

export default compose(
  chatQuery,
  sendMessage,
)(ChatScreen);
