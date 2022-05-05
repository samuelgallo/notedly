import React, { useEffect, useState } from 'react';
import { useMutation, useApolloClient, gql } from '@apollo/client';

import UserForm from '../components/UserForm';

const SIGN_USER = gql`
  mutation signUp($email: String!, $username: String!, $password: String!) {
    signUp(email: $email, username: $username, password: $password)
  }
`;

const SignUp = props => {
  useEffect(() => {
    document.title = 'Sign Up - Notedly';
  });

  const client = useApolloClient();

  // add mutation hook
  const [signUp, { loading, error }] = useMutation(SIGN_USER, {
    onCompleted: data => {
      // save localStorage
      localStorage.setItem('token', data.signUp);

      // update the local cache
      client.writeData({ data: { isLoggedIn: true } });

      // print token
      console.log(data.signUp);

      // redirect
      props.history.push('/');
    }
  });

  return (
    <React.Fragment>
      <UserForm action={signUp} formType="signup" />

      {loading && <p>Loading...</p>}

      {error && <p>Error creating an account!</p>}
    </React.Fragment>
  );
};

export default SignUp;
