import styled, { css, keyframes } from "styled-components";

const appLogoSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const logo = css`
  animation: ${appLogoSpin} infinite 20s linear;
  height: 40px;
`;

export const header = css`
  background-color: #222;
  height: 40px;
  padding: 10px;
  color: white;
`;

export const h1 = css`
  font-size: 1.5em;
`;

export const app = css`
  text-align: center;
`;

export const Header = styled.header`
  ${header}
`;

export const Title = styled.h1`
  ${h1}
`;

export const App = styled.div`
  ${app}
`;
