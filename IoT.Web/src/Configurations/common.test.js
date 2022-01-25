import { common } from "../Configurations/common";

test('Get Date time ', () => {
    expect(common.getDateTime(new Date("2022-01-17"))).toBe('17-Jan-2022 5:30 AM');
});

test('Has Value ', () => {
    expect(common.hasValue(1)).toBe(true);
});
