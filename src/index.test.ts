import { describe, expect, it } from "vitest";
import * as publicApi from "./index";

describe("public API", () => {
  it("exports core UI components", () => {
    expect(publicApi).toHaveProperty("Button");
    expect(publicApi).toHaveProperty("Checkbox");
    expect(publicApi).toHaveProperty("Icon");
    expect(publicApi).toHaveProperty("IconButton");
    expect(publicApi).toHaveProperty("Window");
  });
});
