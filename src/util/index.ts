import { Direction, Count, ChartData } from "../Types";

const countPush = (count: Count, dir: Direction, speed: number) => {
  if (speed < 1) {
    count[dir]["0-1"] = count[dir]["0-1"] + 1;
  } else if (speed < 2) {
    count[dir]["1-2"] = count[dir]["1-2"] + 1;
  } else if (speed < 3) {
    count[dir]["2-3"] = count[dir]["2-3"] + 1;
  } else if (speed < 4) {
    count[dir]["3-4"] = count[dir]["3-4"] + 1;
  } else if (speed < 5) {
    count[dir]["5-6"] = count[dir]["5-6"] + 1;
  } else if (speed < 6) {
    count[dir]["6-7"] = count[dir]["6-7"] + 1;
  } else {
    count[dir]["7+"] = count[dir]["7+"] + 1;
  }
};

// const CountClassify = {
//   "0-1": "0-1",
//   "1-2": "1-2",
//   "2-3": "2-3",
//   "3-4": "3-4",
//   "4-5": "4-5",
//   "5-6": "5-6",
//   "6-7": "6-7",
//   "7+": "7+",
// };

// type DirectionCount = {
//   "0-1": number;
//   "1-2": number;
//   "2-3": number;
//   "3-4": number;
//   "4-5": number;
//   "5-6": number;
//   "6-7": number;
//   "7+": number;
// };

// type CountClassify = typeof CountClassify[keyof typeof CountClassify];

// const Direction = {
//   N: "N",
//   NNE: "NNE",
//   NE: "NE",
//   ENE: "ENE",
//   E: "E",
//   ESE: "ESE",
//   SE: "SE",
//   SSE: "SEE",
//   S: "S",
//   SSW: "SSW",
//   SW: "SW",
//   WSW: "WSW",
//   W: "W",
//   WNW: "WNW",
//   NW: "NW",
//   NNW: "NNW",
// };

// type Count = {
//   N: DirectionCount;
//   NNE: DirectionCount;
//   NE: DirectionCount;
//   ENE: DirectionCount;
//   E: DirectionCount;
//   ESE: DirectionCount;
//   SE: DirectionCount;
//   SSE: DirectionCount;
//   S: DirectionCount;
//   SSW: DirectionCount;
//   SW: DirectionCount;
//   WSW: DirectionCount;
//   W: DirectionCount;
//   WNW: DirectionCount;
//   NW: DirectionCount;
//   NNW: DirectionCount;
// };

// type Direction = typeof Direction[keyof typeof Direction];

export const classifyDir = (direction: number): Direction => {
  const dTh = 11.25;
  let dir;
  if (direction >= 360 - dTh || direction < dTh) {
    dir = Direction.N;
  } else if (direction >= dTh && direction < dTh * 3) {
    dir = Direction.NNE;
  } else if (direction >= dTh * 3 && direction < dTh * 5) {
    dir = Direction.NE;
  } else if (direction >= dTh * 5 && direction < dTh * 7) {
    dir = Direction.ENE;
  } else if (direction >= dTh * 7 && direction < dTh * 9) {
    dir = Direction.E;
  } else if (direction >= dTh * 9 && direction < dTh * 11) {
    dir = Direction.ESE;
  } else if (direction >= dTh * 11 && direction < dTh * 13) {
    dir = Direction.SE;
  } else if (direction >= dTh * 13 && direction < dTh * 15) {
    dir = Direction.SSE;
  } else if (direction >= dTh * 15 && direction < dTh * 17) {
    dir = Direction.S;
  } else if (direction >= dTh * 17 && direction < dTh * 19) {
    dir = Direction.SSW;
  } else if (direction >= dTh * 19 && direction < dTh * 21) {
    dir = Direction.SW;
  } else if (direction >= dTh * 21 && direction < dTh * 23) {
    dir = Direction.WSW;
  } else if (direction >= dTh * 23 && direction < dTh * 25) {
    dir = Direction.W;
  } else if (direction >= dTh * 25 && direction < dTh * 27) {
    dir = Direction.WNW;
  } else if (direction >= dTh * 27 && direction < dTh * 29) {
    dir = Direction.NW;
  } else if (direction >= dTh * 29 && direction < dTh * 31) {
    dir = Direction.NNW;
  } else {
    throw new Error("over 360 or under 0");
  }
  return dir;
};

type Data = {
  direction: number[];
  speed: number[];
};

export function calculateWindRose(data: Data): ChartData[] {
  const count: Count = {
    N: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    NNE: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    NE: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    ENE: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    E: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    ESE: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    SE: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    SSE: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    S: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    SSW: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    SW: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    WSW: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    W: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    WNW: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    NW: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
    NNW: {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "3-4": 0,
      "4-5": 0,
      "5-6": 0,
      "6-7": 0,
      "7+": 0,
    },
  };
  const dataLength = data.direction.length;
  data.direction.map((direction, index) => {
    const speed = data.speed[index];
    const dir = classifyDir(direction);
    return countPush(count, dir, speed);
  });
  const ret = Object.keys(count).map((key) => {
    let total = 0;
    const elements = Object.keys(count[key]).map((subkey) => {
      const E = count[key][subkey] / dataLength;
      total += E;
      return { [subkey]: E };
    });
    const obj = {};
    elements.map((val) => {
      const [elKey] = Object.keys(val);
      const [elVal] = Object.values(val);
      obj[elKey] = elVal;
      return obj;
    });
    return {
      angle: key,
      ...obj,
      total,
    } as ChartData;
  });
  return ret;
}
