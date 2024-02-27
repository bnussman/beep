import React, { useState } from 'react';
import { ListItem, ListItemProps, Popover, Separator, YGroup } from "tamagui";

interface Props {
  items: ListItemProps[];
  Trigger: JSX.Element;
}

export function Menu({ items, Trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover size="$5" allowFlip open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        {Trigger}
      </Popover.Trigger>

      <Popover.Content
        padding="$0"
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YGroup alignSelf="center" bordered width={240} size="$5" separator={<Separator />}>
          {items.map((item, index) => (
            <YGroup.Item key={index}>
              <ListItem
                hoverTheme
                pressTheme
                title="Unknown"
                {...item}
                onPress={(e) => {
                  item.onPress?.(e);
                  setOpen(false);
                }}
              />
            </YGroup.Item>
          ))}
        </YGroup>
      </Popover.Content>
    </Popover>
  );
}
