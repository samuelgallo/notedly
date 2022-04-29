import styled from 'styled-components';

const Button = styled.button`
  display: block;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  color: #fff;
  background-color: #0077cc;
  cursor: pointer;
  transition: opacity ease-in 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    background-color: #005fa3;
  }
`;

export default Button;

// export const Button = styled.button``;
