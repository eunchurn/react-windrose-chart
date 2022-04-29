import React from "react";
import { storiesOf } from "@storybook/react";
// import { doc } from "storybook-readme";

import App from "./App/App.component";
import { Chart } from "../src/WindRose/WindRoseChart.component";

// import Readme from "../README.md";
import { data } from "./data";

// storiesOf("Documentation", module).add("Readme", doc(Readme));

storiesOf("Components", module).add("WindRose", () => (
  <App>
    <Chart chartData={data.chartData} columns={data.columns} />
  </App>
));

// require("./packages");
