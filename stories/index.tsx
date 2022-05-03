import React from "react";
import { storiesOf } from "@storybook/react";

import App from "./App/App.component";
import { Chart } from "../src/WindRose/WindRoseChart.component";

import { data } from "./data";

storiesOf("Components", module).add("WindRose", () => (
  <App>
    <Chart
      chartData={data.chartData}
      columns={data.columns}
      width={1000}
      height={1000}
      responsive
      legendGap={10}
    />
  </App>
));
