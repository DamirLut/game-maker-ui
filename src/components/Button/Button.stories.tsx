import type { Meta, StoryObj } from "@storybook/react";
import { IconCheck } from "#/assets/icons";
import { Icon } from "#components/Icon";
import { Button } from "./button";

const iconOptions = {
  None: undefined,
  Check: <Icon svg={IconCheck} />,
};

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    leftIcon: "None",
    rightIcon: "None",
  },
  argTypes: {
    leftIcon: {
      control: "select",
      options: Object.keys(iconOptions),
      mapping: iconOptions,
    },
    rightIcon: {
      control: "select",
      options: Object.keys(iconOptions),
      mapping: iconOptions,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const WithIcons: Story = {
  args: {
    children: "Button",
    leftIcon: "Check",
    rightIcon: "Check",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Button {...args} size="sm" leftIcon={<Icon svg={IconCheck} size="sm" />}>
        Small
      </Button>
      <Button {...args} size="md" leftIcon={<Icon svg={IconCheck} size="md" />}>
        Medium
      </Button>
      <Button {...args} size="lg" leftIcon={<Icon svg={IconCheck} size="lg" />}>
        Large
      </Button>
    </div>
  ),
};
