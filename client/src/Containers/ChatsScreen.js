import faker from 'faker';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import { Constants } from 'expo';

import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import USER_QUERY from '../Graphql/user.query';
import CREATE_USER from '../Graphql/create-user.mutation';
import USER_CREATED_SUBSCRIPTION from '../Graphql/user-created.subscription';

import ChatRow from '../Components/ChatRow';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: 10,
  },
});

class ChatsScreen extends Component {
  static navigationOptions = {
    title: 'Чаты',
  };

  constructor(props) {
    super(props);

    this.goToChat = this.goToChat.bind(this);
  }

  componentWillReceiveProps() {
    if (!this.subscription) {
      this.subscription = this.props.subscribeToMore({
        document: USER_CREATED_SUBSCRIPTION,
        variables: {},
        updateQuery: (previousResult, { subscriptionData }) => {
          const { data } = subscriptionData;
          const user = data.userCreated;

          const isCurrentUser = user.uuid === Constants.deviceId;

          const msg = !isCurrentUser ? 'К нам присоединился' : 'Привет';

          alert(`${msg} ${user.username}!`); //eslint-disable-line

          if (!isCurrentUser) {
            return previousResult;
          }

          const newState = update(previousResult, {
            user: { $set: user },
          });

          return newState;
        },
      });
    }
  }

  getKey = item => item.id.toString();

  goToChat(chat) {
    const { navigation, user } = this.props;
    navigation.navigate('Chat', {
      chatId: chat.id,
      title: chat.name,
      user,
    });
  }

  createUser() {
    this.props.createUser({
      uuid: Constants.deviceId,
      username: faker.internet.userName(),
      groupId: 1, // hardcoded
    });
  }

  renderItem = ({ item }) => <ChatRow chat={item} goToChat={this.goToChat} />;

  render() {
    const { loading, user } = this.props;

    if (loading) {
      return (
        <ActivityIndicator />
      );
    }

    return (
      <View style={styles.container}>
        { !this.props.user &&
          <TouchableOpacity
            onPress={() => this.createUser()}
            style={styles.button}
          >
            <Text>Присоединиться</Text>
          </TouchableOpacity>
        }
        <FlatList
          data={(user && user.groups) || []}
          keyExtractor={this.getKey}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const userQuery = graphql(USER_QUERY, {
  options: () => ({
    variables: { uuid: Constants.deviceId },
  }),
  props: ({ data: { loading, user, subscribeToMore } }) => ({
    loading,
    user,
    subscribeToMore,
  }),
});

const createUser = graphql(CREATE_USER, {
  props: ({ ownProps, mutate }) => ({ //eslint-disable-line
    createUser: ({ uuid, username, groupId }) =>
      mutate({
        variables: { uuid, username, groupId },
        update: (cache, { data }) => {
          const query = cache.readQuery({
            query: USER_QUERY,
            variables: { uuid: Constants.deviceId },
          });
          query.user = data.createUser;

          cache.writeQuery({
            query: USER_QUERY,
            data: query,
          });
        },
      }),
  }),
});

ChatsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  user: PropTypes.any,
  createUser: PropTypes.func,
  subscribeToMore: PropTypes.func,
};

export default compose(
  userQuery,
  createUser,
)(ChatsScreen);
