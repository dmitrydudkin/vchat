import gql from 'graphql-tag';

const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!, $userId: Int!, $groupId: Int!) {
    createMessage(text: $text, userId: $userId, groupId: $groupId) {
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

export default SEND_MESSAGE;
