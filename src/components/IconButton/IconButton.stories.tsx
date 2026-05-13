import type { Meta, StoryObj } from "@storybook/react";
import { IconCheck } from "#/assets/icons";
import { Icon } from "#components/Icon";
import { IconButton } from "./icon-button";

const iconOptions = {
  Check: <Icon svg={IconCheck} />,
};

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    "aria-label": "Confirm",
    icon: "Check",
  },
  argTypes: {
    icon: {
      control: "select",
      options: Object.keys(iconOptions),
      mapping: iconOptions,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <IconButton
        {...args}
        size="sm"
        icon={<Icon svg={IconCheck} size="sm" />}
      />
      <IconButton
        {...args}
        size="md"
        icon={<Icon svg={IconCheck} size="md" />}
      />
      <IconButton
        {...args}
        size="lg"
        icon={<Icon svg={IconCheck} size="lg" />}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
