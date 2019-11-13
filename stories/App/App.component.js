// @flow
import React from "react";
import styled from "styled-components";

import * as styles from "./App.style";

type Props = {
  children: any,
};

const Header = styled.header`
  ${styles.header}
`;

const Title = styled.h1`
  ${styles.h1}
`;

const App = styled.div`
  ${styles.app}
`;

export default ({ children }: Props) => (
  <App>
    <Header>
      <Title>{"Wind Rose Chart"}</Title>
    </Header>
    {children}
  </App>
);
