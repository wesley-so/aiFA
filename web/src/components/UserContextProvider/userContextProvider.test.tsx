import { render } from "@testing-library/react";
import { UserContextProvider } from "./UserContextProvider";

describe("UserContextProvider", () => {
  test("renders user context provider", () => {
    render(<UserContextProvider></UserContextProvider>);
  });
});
