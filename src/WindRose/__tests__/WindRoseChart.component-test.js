import "jest-styled-components";

import React from "react";
import { isPortal, isFragment } from "react-is";
import { mount } from "enzyme";

import Chart from "../WindRoseChart.component";

describe("component <Chart />", () => {
  it("should render correctly", () => {
    mount(<Chart />);
  });

  it("is not type Portal", () => {
    expect(isPortal(<Chart />)).toBeFalsy();
  });

  it("is not type Fragment", () => {
    expect(isFragment(<Chart />)).toBeFalsy();
  });
});
