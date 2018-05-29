import gql from 'graphql-tag';

const CREATE_USER = gql`
  mutation createUser($uuid: String!, $username: String!, $groupId: Int!) {
    createUser(uuid: $uuid, username: $username, groupId: $groupId) {
      id,
      uuid,
      username
      groups {
        id
        name
      }
    }
  }
`;

export default CREATE_USER;
