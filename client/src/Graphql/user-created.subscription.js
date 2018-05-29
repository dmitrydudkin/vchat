import gql from 'graphql-tag';

const USER_CREATED_SUBSCRIPTION = gql`
  subscription onUserCreated {
    userCreated {
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

export default USER_CREATED_SUBSCRIPTION;
