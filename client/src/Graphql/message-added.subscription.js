import gql from 'graphql-tag';

const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription onMessageAdded($userId: Int, $groupIds: [Int]){
    messageAdded(userId: $userId, groupIds: $groupIds){
      id
      to {
        id
      }
      from {
        id
        username
      }
      createdAt
      text
    }
  }
`;

export default MESSAGE_ADDED_SUBSCRIPTION;
