import React from 'react';
import { Check, ChevronDown } from '@tamagui/lucide-icons';
import { Select as _Select, Adapt, SelectProps, Sheet } from 'tamagui';

interface Props<T extends { label: string, value: string }> extends SelectProps {
  items: T[];
  placeholder?: string;
}

export function Select<T extends { label: string, value: string }>({ items, placeholder, ...props }: Props<T>) {
  return (
    <_Select native {...props}>
      <_Select.Trigger width="100%" iconAfter={ChevronDown}>
        <_Select.Value placeholder={placeholder} />
      </_Select.Trigger>

      <Adapt platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Handle backgroundColor="$gray8" />
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <_Select.Content>
        <_Select.Viewport minWidth={200}>
          <_Select.Group>
            {items.map((item, i) => (
              <_Select.Item
                index={i}
                key={item.label}
                value={item.value}
              >
                <_Select.ItemText>{item.label}</_Select.ItemText>
                <_Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </_Select.ItemIndicator>
              </_Select.Item>
            ))}
          </_Select.Group>
        </_Select.Viewport>
      </_Select.Content>
    </_Select>
  );
}
