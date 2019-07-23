import { withCurrentTime } from "./utils";

describe.each([
  [
    new Date(2019, 1, 1, 12, 35, 5),
    new Date(2019, 1, 1, 13, 37, 1),
    new Date(2019, 1, 1, 13, 37, 1)
  ],
  [
    new Date(2019, 1, 1, 12, 35, 5),
    new Date(2019, 5, 5, 13, 37, 1),
    new Date(2019, 1, 1, 13, 37, 1)
  ],
  [
    new Date(2019, 1, 1, 12, 35, 5),
    new Date(2000, 1, 1, 1, 37, 59),
    new Date(2019, 1, 1, 1, 37, 59)
  ]
])(
  ".withCurrentTime(%o, %o)",
  (mainDate: Date, nowWithTime: Date, expected: Date) => {
    test(`returns ${expected}`, () => {
      expect(withCurrentTime(mainDate, nowWithTime)).toStrictEqual(expected);
    });
  }
);
