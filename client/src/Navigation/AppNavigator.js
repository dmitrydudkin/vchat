import React from 'react';

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import { Text, View, StyleSheet } from 'react-native';
import ChatScreen from '../Containers/ChatScreen';
import ChatsScreen from '../Containers/ChatsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
  },
});

const TestScreen = title => () => (
  <View style={styles.container}>
    <Text>
      {title}
    </Text>
  </View>
);

const MainScreenNavigator = TabNavigator({
  Chats: { screen: ChatsScreen },
  Settings: { screen: TestScreen('Settings') },
}, {
  initialRouteName: 'Chats',
});

const AppNavigator = StackNavigator({
  Main: { screen: MainScreenNavigator },
  Chat: { screen: ChatScreen },
});

export default AppNavigator;

