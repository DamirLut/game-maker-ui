import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { IconCheck } from "#/assets/icons";
import { Icon } from "#components/Icon";
import "#styles/index.scss";
import { IconButton } from "./icon-button";

describe("IconButton", () => {
  it("uses solid variant by default", async () => {
    const { container } = await render(
      <IconButton aria-label="Confirm" icon={<Icon svg={IconCheck} />} />,
    );
    const button = container.querySelector("button") as HTMLButtonElement;
    const style = getComputedStyle(button);

    expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(style.borderColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  it("renders ghost variant without resting background or border", async () => {
    const { container } = await render(
      <IconButton
        aria-label="Confirm"
        variant="ghost"
        icon={<Icon svg={IconCheck} />}
      />,
    );
    const button = container.querySelector("button") as HTMLButtonElement;
    const style = getComputedStyle(button);

    expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(style.borderColor).toBe("rgba(0, 0, 0, 0)");
  });
});
