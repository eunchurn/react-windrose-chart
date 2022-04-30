import React from "react";
import { App, Header, Title } from "./App.style";

type Props = {
  children: any;
};

export default ({ children }: Props) => (
  <App>
    <Header>
      <Title>Wind Rose Chart</Title>
    </Header>
    {children}
  </App>
);
