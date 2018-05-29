import gql from 'graphql-tag';

const CHAT_QUERY = gql`
  query group($groupId: Int!) {
    group(id: $groupId) {
      id
      name
      users {
        id
        username
      }
      messages {
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
  },
`;

export default CHAT_QUERY;
