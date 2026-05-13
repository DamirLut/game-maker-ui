import type { Meta, StoryObj } from "@storybook/react";
import { IconCheck } from "#/assets/icons";
import { Icon } from "./icon";

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: {
    svg: IconCheck,
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon {...args} size="sm" />
      <Icon {...args} size="md" />
      <Icon {...args} size="lg" />
    </div>
  ),
};
