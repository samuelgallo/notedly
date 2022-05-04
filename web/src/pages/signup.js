import React, { useEffect, useState } from 'react';
import { useMutation, useApolloClient, gql } from '@apollo/client';
import styled from 'styled-components';

import Button from '../components/Button';

const Wrapper = styled.div`
  border: 1px solid #f5f4f0;
  max-width: 500px;
  padding: 1rem;
  margin: 0 auto;
`;

const Form = styled.form`
  label,
  input {
    display: block;
    line-height: 2rem;
  }
  input {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const SIGN_USER = gql`
  mutation signUp($email: String!, $username: String!, $password: String!) {
    signUp(email: $email, username: $username, password: $password)
  }
`;

const SignUp = props => {
  const [values, setValues] = useState();

  const onChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

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
    <Wrapper>
      <Form
        onSubmit={event => {
          event.preventDefault();
          signUp({
            variables: {
              ...values
            }
          });
        }}
      >
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          required
          onChange={onChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          onChange={onChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          onChange={onChange}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </Wrapper>
  );
};

export default SignUp;
