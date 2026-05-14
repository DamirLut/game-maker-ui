import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IconCheck } from "#/assets/icons";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Window } from "./window";

const meta = {
  title: "Components/Window",
  component: Window,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Window>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Window width={360}>
      <Window.Header title="Window" />
      <Window.Body>
        <Button>Action</Button>
      </Window.Body>
    </Window>
  ),
};

export const TitleWithNode: Story = {
  render: () => (
    <Window width={380}>
      <Window.Header
        title={
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Icon svg={IconCheck} size="sm" aria-hidden="true" />
            Window with icon
          </span>
        }
      />
      <Window.Body>
        <Button>Action</Button>
      </Window.Body>
    </Window>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Window width={360} defaultCollapsed={false}>
      <Window.Header title="Collapsible window" collapsible />
      <Window.Body>
        <Button>Action</Button>
      </Window.Body>
    </Window>
  ),
};

export const ControlledCollapsed: Story = {
  render: function ControlledCollapsedStory() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <Window
        width={380}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <Window.Header title="Controlled collapse" collapsible />
        <Window.Body>
          <Button onClick={() => setCollapsed(true)}>Collapse from body</Button>
        </Window.Body>
      </Window>
    );
  },
};

export const Closable: Story = {
  render: function ClosableStory() {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return <Button onClick={() => setVisible(true)}>Restore window</Button>;
    }

    return (
      <Window width={360}>
        <Window.Header
          title="Closable window"
          closable
          onClose={() => setVisible(false)}
        />
        <Window.Body>
          <Button>Action</Button>
        </Window.Body>
      </Window>
    );
  },
};

export const Resizable: Story = {
  render: () => (
    <Window width={360} height={180} minWidth={280} minHeight={120} resizable>
      <Window.Header title="Resizable window" />
      <Window.Body>
        <Button>Action</Button>
      </Window.Body>
    </Window>
  ),
};

export const Draggable: Story = {
  render: () => (
    <Window width={360} defaultPosition={{ x: 32, y: 32 }} draggable>
      <Window.Header title="Draggable window" />
      <Window.Body>
        <Button>Action</Button>
      </Window.Body>
    </Window>
  ),
};

export const ControlledPosition: Story = {
  render: function ControlledPositionStory() {
    const [position, setPosition] = useState({ x: 48, y: 48 });

    return (
      <Window
        width={380}
        position={position}
        onPositionChange={setPosition}
        draggable
      >
        <Window.Header title={`Position: ${position.x}, ${position.y}`} />
        <Window.Body>
          <Button onClick={() => setPosition({ x: 0, y: 0 })}>
            Reset position
          </Button>
        </Window.Body>
      </Window>
    );
  },
};

export const CustomHeaderBodyAttributes: Story = {
  render: () => (
    <Window width={380} data-testid="window-root">
      <Window.Header title="Custom attrs" data-testid="window-header" />
      <Window.Body data-testid="window-body">
        <Button>Action</Button>
      </Window.Body>
    </Window>
  ),
};
