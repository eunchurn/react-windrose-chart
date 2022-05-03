import { classifyDir } from "../index";
import { Direction } from "../../Types";

describe("classifyDir", () => {
  it("should return N when angle 0 degree", () => {
    const result = classifyDir(0);
    expect(result).toBe(Direction.N);
  });
  it("should return W when angle 270 degree", () => {
    const result = classifyDir(270);
    expect(result).toBe(Direction.W);
  });
  it("should return WNW when angle 303.74 degree", () => {
    const result = classifyDir(303.74);
    expect(result).toBe(Direction.WNW);
  });
  it("should return NW when angle 303.75 degree", () => {
    const result = classifyDir(303.75);
    expect(result).toBe(Direction.NW);
  });
});
