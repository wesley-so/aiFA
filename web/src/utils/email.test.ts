import { isEmail } from "./email";

describe("Email", () => {
  test("Validate email", () => {
    expect(isEmail("abcde@abc.com")).toBeTruthy();
    expect(isEmail("asc@d")).toBeFalsy();
  });
});
