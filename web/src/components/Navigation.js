import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 1rem;
  background-color: #f5f4f0;

  @media (max-width: 768px) {
    padding-top: 64px;
  }

  @media (min-width: 768px) {
    position: fixed;
    width: 220px;
    height: calc(100% - 64px);
    overflow-y: scroll;
  }
`;

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 2;

  a {
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;

    &:visited {
      color: #333;
    }

    &:hover,
    &:focus {
      color: #0077cc;
    }
  }
`;

const Navigation = () => {
  return (
    <Nav>
      <NavList>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/mynotes">My Notes</Link>
        </li>
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
      </NavList>
    </Nav>
  );
};

export default Navigation;
