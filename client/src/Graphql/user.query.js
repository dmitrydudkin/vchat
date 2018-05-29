import gql from 'graphql-tag';

const USER_QUERY = gql`
  query user($uuid: String) {
    user(uuid: $uuid) {
      id
      uuid
      username
      groups {
        id
        name
      }
    }
  }
`;

export default USER_QUERY;
