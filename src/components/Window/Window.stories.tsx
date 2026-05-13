import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Window } from "./window";

const meta = {
  title: "Components/Window",
  component: Window,
  args: {
    title: "Window",
    collapsible: false,
    children: <Button>Action</Button>,
  },
} satisfies Meta<typeof Window>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsible: Story = {
  args: {
    collapsible: true,
  },
};
