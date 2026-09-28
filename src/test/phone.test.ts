import { describe, expect, it } from "vitest";
import { samePhoneNumber } from "@/test/phone";

describe("samePhoneNumber", () => {
  it.each([
    ["01 23 45 67 89", "+33123456789"],
    ["06.12.34.56.78", "+33612345678"],
    ["+33 6 12 34 56 78", "+33612345678"],
    ["+33 (0)6 12 34 56 78", "+33612345678"],
    ["0262 12 34 56", "+262262123456"],
  ])("« %s » est bien %s", (display, e164) => {
    expect(samePhoneNumber(display, e164)).toBe(true);
  });

  it.each([
    ["01 23 45 67 88", "+33123456789"],
    ["06 12 34 56 78", "+33712345678"],
    ["", "+33123456789"],
  ])("« %s » n'est pas %s", (display, e164) => {
    expect(samePhoneNumber(display, e164)).toBe(false);
  });
});
