import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { AxisContainer, Axis } from "./WindRoseChart.style";

const Chart = ({ data, columns }) => {
  const container = useRef();
  const axisContainer = useRef();
  const [state, setState] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (axisContainer.current) {
      const updateSize = () => {
        setState({
          width: axisContainer.current.offsetWidth,
          height: axisContainer.current.offsetHeight
        });
      };
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);
  useEffect(() => {
    const { width, height } = state;
    if (
      data &&
      container.current &&
      axisContainer.current &&
      width > 0 &&
      height > 0
    ) {
      const svg = d3.select(container.current);
      svg.selectAll("*").remove();
      const margin = { top: 40, right: 80, bottom: 40, left: 40 };
      const innerRadius = 20;
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;
      const outerRadius = Math.min(chartWidth, chartHeight) / 2;
      const g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      const angle = d3.scaleLinear().range([0, 2 * Math.PI]);
      const radius = d3.scaleLinear().range([innerRadius, outerRadius]);
      const x = d3
        .scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);
      const y = d3
        .scaleLinear() // you can try scaleRadial but it scales differently
        .range([innerRadius, outerRadius]);
      const z = d3
        .scaleOrdinal()
        .range([
          "#8e44ad",
          "#4242f4",
          "#42c5f4",
          "#42f4ce",
          "#42f456",
          "#adf442",
          "#f4e242",
          "#f4a142",
          "#f44242"
        ]);
      x.domain(data.map(d => d.angle));
      y.domain([
        0,
        d3.max(data, d => d.total) > 1 ? d3.max(data, d => d.total) : 1
      ]);
      z.domain(columns.slice(1));
      // Extend the domain slightly to match the range of [0, 2π].
      angle.domain([0, d3.max(data, (d, i) => i + 1)]);
      radius.domain([0, d3.max(data, d => d.y0 + d.y)]);
      const angleOffset = -360.0 / data.length / 2.0;
      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(columns.slice(1))(data))
        .enter()
        .append("g")
        .attr("fill", d => z(d.key))
        .selectAll("path")
        .data(d => d)
        .enter()
        .append("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(d => y(d[0]))
            .outerRadius(d => y(d[1]))
            .startAngle(d => x(d.data.angle))
            .endAngle(d => x(d.data.angle) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius)
        )
        .attr("transform", () => "rotate(" + angleOffset + ")");
      const label = g
        .append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          d =>
            "rotate(" +
            (((x(d.angle) + x.bandwidth() / 2) * 180) / Math.PI -
              (90 - angleOffset)) +
            ")translate(" +
            (outerRadius + 30) +
            ",0)"
        );
      label
        .append("text")
        .attr("transform", d =>
          (x(d.angle) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) <
          Math.PI
            ? "rotate(90)translate(0,16)"
            : "rotate(-90)translate(0,-9)"
        )
        .text(d => d.angle)
        .style("font-size", 14);
      g.selectAll(".axis")
        .data(d3.range(angle.domain()[1]))
        .enter()
        .append("g")
        .attr("class", "axis")
        .attr("transform", d => "rotate(" + (angle(d) * 180) / Math.PI + ")")
        .call(
          d3
            .axisLeft()
            .scale(radius.copy().range([-innerRadius, -(outerRadius + 10)]))
        );
      const yAxis = g.append("g").attr("text-anchor", "middle");
      const yTick = yAxis
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .enter()
        .append("g");
      yTick
        .append("circle")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "4,4")
        .attr("r", y);
      yTick
        .append("text")
        .attr("y", d => -y(d))
        .attr("dy", "-0.35em")
        .attr("x", () => -10)
        .text(y.tickFormat(5, "s"))
        .style("font-size", 14);
      const legend = g
        .append("g")
        .selectAll("g")
        .data(columns.slice(1).reverse())
        .enter()
        .append("g")
        .attr(
          "transform",
          (d, i) =>
            "translate(" +
            (outerRadius + 0) +
            "," +
            (-outerRadius + 40 + (i - (columns.length - 1) / 2) * 20) +
            ")"
        );
      legend
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);
      legend
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text(d => d)
        .style("font-size", 12);
      g.exit().remove();
    }
  }, [state, data, container.current]);
  return (
    <AxisContainer ref={axisContainer}>
      <Axis className="axis" width={state.width} height={600} ref={container} />
    </AxisContainer>
  );
};

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      "0-1": PropTypes.number.isRequired,
      "1-2": PropTypes.number.isRequired,
      "2-3": PropTypes.number.isRequired,
      "3-4": PropTypes.number.isRequired,
      "4-5": PropTypes.number.isRequired,
      "5-6": PropTypes.number.isRequired,
      "6-7": PropTypes.number.isRequired,
      "7+": PropTypes.number.isRequired,
      angle: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

Chart.defaultProps = {
  data: [
    {
      angle: "N  ",
      "0-1": 0.5,
      "1-2": 1.6,
      "2-3": 0.9,
      "3-4": 0.9,
      "4-5": 0.4,
      "5-6": 0.3,
      "6-7": 0.2,
      "7+": 0.1,
      total: 4.8999999999999995
    },
    {
      angle: "NNE",
      "0-1": 0.6,
      "1-2": 1.8,
      "2-3": 1.3,
      "3-4": 0.8,
      "4-5": 0.5,
      "5-6": 0.3,
      "6-7": 0.1,
      "7+": 0.1,
      total: 5.499999999999999
    },
    {
      angle: "NE ",
      "0-1": 0.5,
      "1-2": 1.5,
      "2-3": 1.6,
      "3-4": 1.2,
      "4-5": 1.2,
      "5-6": 0.6,
      "6-7": 0.1,
      "7+": 0.1,
      total: 6.799999999999999
    },
    {
      angle: "ENE",
      "0-1": 0.4,
      "1-2": 1.6,
      "2-3": 0.9,
      "3-4": 1,
      "4-5": 0.5,
      "5-6": 0.2,
      "6-7": 0.1,
      "7+": 0.1,
      total: 4.8
    },
    {
      angle: "E  ",
      "0-1": 0.4,
      "1-2": 1.6,
      "2-3": 1,
      "3-4": 0.8,
      "4-5": 0.4,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.1,
      total: 4.499999999999999
    },
    {
      angle: "ESE",
      "0-1": 0.3,
      "1-2": 1.2,
      "2-3": 0.6,
      "3-4": 0.4,
      "4-5": 0.2,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.05,
      total: 2.95
    },
    {
      angle: "SE ",
      "0-1": 0.4,
      "1-2": 1.5,
      "2-3": 0.6,
      "3-4": 0.5,
      "4-5": 0.4,
      "5-6": 0.05,
      "6-7": 0.05,
      "7+": 0.05,
      total: 3.5499999999999994
    },
    {
      angle: "SSE",
      "0-1": 0.4,
      "1-2": 1.7,
      "2-3": 0.9,
      "3-4": 0.5,
      "4-5": 0.4,
      "5-6": 0.1,
      "6-7": 0.05,
      "7+": 0.05,
      total: 4.1
    },
    {
      angle: "S  ",
      "0-1": 0.6,
      "1-2": 2.2,
      "2-3": 1.4,
      "3-4": 0.8,
      "4-5": 0.7,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.05,
      total: 5.949999999999999
    },
    {
      angle: "SSW",
      "0-1": 0.4,
      "1-2": 2,
      "2-3": 1.7,
      "3-4": 0.9,
      "4-5": 0.6,
      "5-6": 0.2,
      "6-7": 0.05,
      "7+": 0.1,
      total: 5.949999999999999
    },
    {
      angle: "SW ",
      "0-1": 0.5,
      "1-2": 2.3,
      "2-3": 1.9,
      "3-4": 1.3,
      "4-5": 0.7,
      "5-6": 0.3,
      "6-7": 0.2,
      "7+": 0.1,
      total: 7.299999999999999
    },
    {
      angle: "WSW",
      "0-1": 0.6,
      "1-2": 2.4,
      "2-3": 2.2,
      "3-4": 1.1,
      "4-5": 0.8,
      "5-6": 0.4,
      "6-7": 0.2,
      "7+": 0.1,
      total: 7.800000000000001
    },
    {
      angle: "W  ",
      "0-1": 0.6,
      "1-2": 2.3,
      "2-3": 1.8,
      "3-4": 1.2,
      "4-5": 0.9,
      "5-6": 0.9,
      "6-7": 0.4,
      "7+": 0.9,
      total: 9.000000000000002
    },
    {
      angle: "WNW",
      "0-1": 0.5,
      "1-2": 2.6,
      "2-3": 1.7,
      "3-4": 1.2,
      "4-5": 1,
      "5-6": 0.9,
      "6-7": 0.7,
      "7+": 2.2,
      total: 10.8
    },
    {
      angle: "NW ",
      "0-1": 0.4,
      "1-2": 2.3,
      "2-3": 1.8,
      "3-4": 1.3,
      "4-5": 1,
      "5-6": 0.9,
      "6-7": 0.7,
      "7+": 1.5,
      total: 9.9
    },
    {
      angle: "NNW",
      "0-1": 0.1,
      "1-2": 0.8,
      "2-3": 0.8,
      "3-4": 1,
      "4-5": 0.7,
      "5-6": 0.3,
      "6-7": 0.4,
      "7+": 0.2,
      total: 4.300000000000001
    }
  ],
  columns: ["angle", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7+"]
};

export default Chart;
