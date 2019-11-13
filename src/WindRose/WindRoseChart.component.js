import React from "react";
import * as d3 from "d3";
import { AxisContainer, Axis } from "./WindRoseChart.style";
import { ChartPropTypes, ChartDefaultProps } from "./PropTypes";

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: props.width, height: props.height };
    this.containerRef = React.createRef();
    this.axisContainerRef = React.createRef();
    this.updateSize = this.updateSize.bind(this);
  }

  componentDidMount() {
    const { data, columns } = this.props;
    const { width, height } = this.state;

    window.addEventListener("resize", this.updateSize);
    this.updateSize();

    if (
      data &&
      this.containerRef.current &&
      this.axisContainerRef.current &&
      width > 0 &&
      height > 0
    ) {
      const svg = d3.select(this.containerRef.current);
      svg.selectAll("*").remove();
      const margin = { top: 40, right: 80, bottom: 40, left: 40 };
      const innerRadius = 20;
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;
      const outerRadius = Math.min(chartWidth, chartHeight) / 2;
      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const angle = d3.scaleLinear().range([0, 2 * Math.PI]);
      const radius = d3
        .scaleLinear()
        .range([innerRadius, outerRadius]);
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
          "#f44242",
        ]);
      x.domain(data.map(d => d.angle));
      y.domain([
        0,
        d3.max(data, d => d.total) > 1
          ? d3.max(data, d => d.total)
          : 1,
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
            .padRadius(innerRadius),
        )
        .attr("transform", () => `rotate(${angleOffset})`);
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
            `rotate(${((x(d.angle) + x.bandwidth() / 2) * 180) /
              Math.PI -
              (90 - angleOffset)})translate(${outerRadius + 30},0)`,
        );
      label
        .append("text")
        // eslint-disable-next-line no-confusing-arrow
        .attr("transform", d =>
          (x(d.angle) + x.bandwidth() / 2 + Math.PI / 2) %
          (2 * Math.PI < Math.PI)
            ? "rotate(90)translate(0,16)"
            : "rotate(-90)translate(0,-9)",
        )
        .text(d => d.angle)
        .style("font-size", 14);
      g.selectAll(".axis")
        .data(d3.range(angle.domain()[1]))
        .enter()
        .append("g")
        .attr("class", "axis")
        .attr(
          "transform",
          d => `rotate(${(angle(d) * 180) / Math.PI})`,
        )
        .call(
          d3
            .axisLeft()
            .scale(
              radius
                .copy()
                .range([-innerRadius, -(outerRadius + 10)]),
            ),
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
            `translate(${outerRadius + 0},${-outerRadius +
              40 +
              (i - (columns.length - 1) / 2) * 20})`,
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
    return window.removeEventListener("resize", this.updateSize);
  }

  updateSize() {
    this.setState({
      width: this.axisContainerRef.current.offsetWidth,
      height: this.axisContainerRef.current.offsetHeight,
    });
  }

  render() {
    const { width } = this.state;
    return (
      <AxisContainer ref={this.axisContainerRef}>
        <Axis
          className="axis"
          width={width}
          height={600}
          ref={this.containerRef}
        />
      </AxisContainer>
    );
  }
}

Chart.propTypes = ChartPropTypes;
Chart.defaultProps = ChartDefaultProps;

export default Chart;
