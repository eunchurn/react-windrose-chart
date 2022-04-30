/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import * as d3 from "d3";
import { AxisContainer, Axis } from "./WindRoseChart.style";
import { ChartPropTypes, ChartDefaultProps, DataType } from "../Types";
import { useResponsive } from "./hooks";

export function Chart(props: ChartPropTypes) {
  const {
    width: propWidth,
    height: propHeight,
    chartData: data,
    columns,
    responsive,
    legendGap,
  } = props;
  const containerRef = React.useRef<SVGSVGElement>(null);
  const axisContainerRef = React.useRef<HTMLDivElement>(null);
  const containerSize = useResponsive(axisContainerRef, {
    width: propWidth,
    height: propHeight,
  });

  const [size, setSize] = React.useState({
    width: propWidth,
    height: propHeight,
  });
  React.useEffect(() => {
    const { width, height } = containerSize;
    if (responsive) {
      const rect = Math.min(width, height);
      setSize({ width: rect, height: rect });
    } else {
      setSize({ width: propWidth, height: propHeight });
    }
  }, [responsive, axisContainerRef, containerSize.width]);
  React.useEffect(() => {
    const { current } = containerRef;
    if (current === null) return;
    const { width, height } = size;
    const svg = d3.select(containerRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 40, right: 80, bottom: 40, left: 40 };
    const innerRadius = 20;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const outerRadius = Math.min(chartWidth, chartHeight) / 2.4 - legendGap / 2;
    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const angle = d3.scaleLinear().range([0, 2 * Math.PI]);
    const radius = d3.scaleLinear().range([innerRadius, outerRadius]);
    const x = d3
      .scaleBand()
      .range([0, 2 * Math.PI])
      .align(0);
    // const xGroup = d3
    //   .scaleBand()
    //   .range([0, 2 * Math.PI])
    //   .align(0);
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
    x.domain(data.map((d) => String(d.angle)));
    // xGroup.domain(columns.map((d) => d));
    y.domain([
      0,
      (d3.max(data, (d) => d.total) || 0) > 1
        ? d3.max(data, (d) => d.total) || 0
        : 1,
    ]);
    z.domain(columns.slice(1));

    // Extend the domain slightly to match the range of [0, 2π].
    angle.domain([0, d3.max(data, (_, i): number => i + 1) || 0]);
    radius.domain([0, d3.max(data, (): number => 0) || 0]);
    // radius.domain([innerRadius, outerRadius]);
    const angleOffset = -360.0 / data.length / 2.0;
    const stackGen: d3.Stack<any, DataType, string> = d3
      .stack()
      .keys(columns.slice(1));
    const arcVal: d3.Arc<SVGPathElement, d3.DefaultArcObject> = d3 // d3.DefaultArcObject
      .arc()
      .innerRadius((d) => Number(y(d[0])))
      .outerRadius((d) => Number(y(d[1])))
      // @ts-ignore
      .startAngle((d) => Number(x(d.data.angle)))
      // .startAngle((d) => x(String(d.startAngle)) || 0)
      // @ts-ignore
      .endAngle((d) => Number(x(d.data.angle)) + x.bandwidth())
      // .endAngle((d) => x(String(d.endAngle)) || 0 + x.bandwidth())
      .padAngle(0.0)
      .padRadius(innerRadius);
    const arcParent = g
      .append("g")
      .selectAll("g")
      // @ts-ignore
      .data(stackGen(data))
      .enter()
      .append("g")
      .attr("fill", (d) => {
        return z(d.key) as string;
      });
    // @ts-ignore
    const arc: d3.Selection<
      SVGPathElement,
      d3.SeriesPoint<DataType>,
      d3.EnterElement,
      d3.Series<DataType, string>
    > = arcParent
      .selectAll<SVGPathElement, d3.SeriesPoint<DataType>>("path")
      .data((d) => d)
      .enter()
      .append("path");
    arc
      // @ts-ignore
      .attr("d", arcVal)
      .attr("transform", `rotate(${angleOffset})`);
    const label = g
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("text-anchor", "middle")
      .attr("transform", (d) => {
        return `rotate(${
          // @ts-ignore
          ((Number(x(d.angle)) + x.bandwidth() / 2) * 180) / Math.PI -
          (90 - angleOffset)
        })translate(${outerRadius + 30},0)`;
      });
    label
      .append("text")
      // eslint-disable-next-line no-confusing-arrow
      .attr("transform", (d, _i) =>
        // @ts-ignore
        (x(d.angle) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI < Math.PI)
          ? "rotate(90)translate(0,16)"
          : "rotate(-90)translate(0,-9)",
      )
      .attr("transform", "rotate(90)translate(0,-9)")
      .text((d) => d.angle)
      .style("font-size", 14);
    g.selectAll(".axis")
      .data(d3.range(angle.domain()[1]))
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", (d) => `rotate(${(angle(d) * 180) / Math.PI})`)
      .call(
        d3
          // @ts-ignore
          .axisLeft()
          .scale(radius.copy().range([-innerRadius, -(outerRadius + 10)])),
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
      .attr("y", (d) => -y(d))
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
          `translate(${outerRadius + 45 + legendGap / 2},${
            -outerRadius + 40 + (i - (columns.length - 1) / 2) * 20
          })`,
      );
    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      // @ts-ignore
      .attr("fill", z);
    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d)
      .style("font-size", 12);
    g.exit().remove();
  }, [containerSize.width]);
  return (
    <AxisContainer ref={axisContainerRef}>
      <Axis
        className="axis"
        width={size.width}
        height={size.height}
        ref={containerRef}
      />
    </AxisContainer>
  );
}

Chart.defaultProps = ChartDefaultProps;
