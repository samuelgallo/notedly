import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../img/logo.svg';

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

const Header = () => {
  return (
    <HeaderBar>
      <Link to="/">
        <img src={logo} alt="Notedly" height="40" />
        <LogoText>Notedly</LogoText>
      </Link>
    </HeaderBar>
  );
};

export default Header;
