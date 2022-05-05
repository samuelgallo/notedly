import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { useQuery, gql } from '@apollo/client';

import logo from '../img/logo.svg';
import ButtonALink from './ButtonAsLink';

const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  height: 64px;
  position: fixed;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

const LogoText = styled.h1`
  margin: 0;
  margin-left: 10px;
  padding: 0;
  display: inline;
  color: #333;
  text-decoration: none;
`;

const UserState = styled.div`
  margin-left: auto;
`;

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

const Header = props => {
  // query hook for user logged in
  const { data, client } = useQuery(IS_LOGGED_IN);

  return (
    <HeaderBar>
      <Link to="/">
        <img src={logo} alt="Notedly" height="40" />
        <LogoText>Notedly</LogoText>
      </Link>

      <UserState>
        {data.isLoggedIn ? (
          <ButtonALink
            onClick={() => {
              localStorage.removeItem('token');
              client.resetStore();
              client.writeData({ data: { isLoggedIn: false } });
              props.history.push('/signin');
            }}
          >
            Log Out
          </ButtonALink>
        ) : (
          <p>
            <Link to={'/signin'}>Sign In</Link> or{' '}
            <Link to={'/signup'}>Sign Up</Link>
          </p>
        )}
      </UserState>
    </HeaderBar>
  );
};

export default withRouter(Header);
