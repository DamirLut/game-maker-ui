import { useState } from "react";
import { IconCheck, IconCheckIndeterminate, IconClose } from "#/assets/icons";
import { Button, Checkbox, Icon, IconButton, Window } from "#components";
import "#styles/index.scss";

import "./demo.scss";

export function DemoPage() {
  const [secondaryVisible, setSecondaryVisible] = useState(true);

  return (
    <main className="demo-page" aria-label="Game Maker UI demo">
      <Window
        className="demo-window demo-window-primary"
        defaultPosition={{ x: 56, y: 56 }}
        width={540}
        minWidth={360}
        minHeight={260}
        draggable
        resizable
      >
        <Window.Header
          title={
            <span className="demo-title">
              <Icon svg={IconCheck} size="sm" aria-hidden="true" />
              Game Maker UI demo
            </span>
          }
          collapsible
        />
        <Window.Body>
          <div className="demo-stack">
            <section className="demo-section">
              <h2>Button</h2>
              <div className="demo-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="demo-row">
                <Button leftIcon={<Icon svg={IconCheck} size="md" />}>
                  With left icon
                </Button>
                <Button rightIcon={<Icon svg={IconCheck} size="md" />}>
                  With right icon
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </section>

            <section className="demo-section">
              <h2>IconButton</h2>
              <div className="demo-row">
                <IconButton
                  aria-label="Small confirm"
                  size="sm"
                  icon={<Icon svg={IconCheck} size="sm" />}
                />
                <IconButton
                  aria-label="Medium confirm"
                  size="md"
                  icon={<Icon svg={IconCheck} size="md" />}
                />
                <IconButton
                  aria-label="Large confirm"
                  size="lg"
                  icon={<Icon svg={IconCheck} size="lg" />}
                />
                <IconButton
                  aria-label="Close"
                  icon={<Icon svg={IconClose} />}
                />
                <IconButton
                  aria-label="Disabled confirm"
                  icon={<Icon svg={IconCheck} />}
                  disabled
                />
              </div>
            </section>

            <section className="demo-section">
              <h2>Icon</h2>
              <div className="demo-row demo-icons">
                <Icon svg={IconCheck} size="sm" aria-label="Small check icon" />
                <Icon
                  svg={IconCheck}
                  size="md"
                  aria-label="Medium check icon"
                />
                <Icon svg={IconCheck} size="lg" aria-label="Large check icon" />
                <Icon
                  svg={IconCheckIndeterminate}
                  size="lg"
                  aria-label="Indeterminate check icon"
                />
              </div>
            </section>

            <section className="demo-section">
              <h2>Checkbox</h2>
              <div className="demo-grid">
                <Checkbox size="sm" label="Small unchecked" />
                <Checkbox size="md" label="Medium checked" checked />
                <Checkbox size="lg" label="Large mixed" checked="mixed" />
                <Checkbox label="Disabled unchecked" disabled />
                <Checkbox label="Disabled checked" checked disabled />
                <Checkbox label="Disabled mixed" checked="mixed" disabled />
              </div>
            </section>
          </div>
        </Window.Body>
      </Window>

      {secondaryVisible && (
        <Window
          className="demo-window demo-window-secondary"
          defaultPosition={{ x: 620, y: 96 }}
          width={360}
          minWidth={280}
          draggable
        >
          <Window.Header
            title="Secondary window"
            collapsible
            closable
            onClose={() => setSecondaryVisible(false)}
          />
          <Window.Body>
            <div className="demo-stack">
              <section className="demo-section">
                <h2>Window</h2>
                <p className="demo-copy">
                  Header handles drag, body owns content scroll, and root owns
                  optional resize.
                </p>
                <div className="demo-row">
                  <Button leftIcon={<Icon svg={IconCheck} />}>Apply</Button>
                  <Button disabled>Locked</Button>
                </div>
              </section>
            </div>
          </Window.Body>
        </Window>
      )}
    </main>
  );
}
