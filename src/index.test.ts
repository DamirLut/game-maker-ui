import { describe, expect, it } from "vitest";
import * as publicApi from "./index";

describe("public API", () => {
  it("exports core UI components", () => {
    expect(publicApi.Button).toBeTypeOf("function");
    expect(publicApi.Checkbox).toBeTypeOf("function");
    expect(publicApi.Icon).toBeTypeOf("function");
    expect(publicApi.IconButton).toBeTypeOf("function");
    expect(publicApi.Window).toBeTypeOf("function");
  });
});
