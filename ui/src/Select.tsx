import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { LinearGradient } from 'tamagui/linear-gradient';
import React from 'react';
import { Select as _Select, Adapt, SelectProps, Sheet, YStack } from 'tamagui';

interface Props<T extends { label: string, value: string }> extends SelectProps {
  items: T[];
  placeholder?: string;
}

export function Select<T extends { label: string, value: string }>({ items, placeholder, ...props }: Props<T>) {
  const native = true;
  return (
    <_Select native {...props}>
      <_Select.Trigger width="100%" iconAfter={ChevronDown}>
        <_Select.Value placeholder={placeholder} />
      </_Select.Trigger>

      <Adapt platform="touch">
        <Sheet
          native={!!native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Handle />
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

      <_Select.Content zIndex={200000}>
        <_Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
        </_Select.ScrollUpButton>

        <_Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <_Select.Group>
            {/* <_Select.Label>Fruits</_Select.Label> */}
            {/* for longer lists memoizing these is useful */}
            {items.map((item, i) => {
              return (
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
              )
            })}
          </_Select.Group>
          {/* Native gets an extra icon */}
          {native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown
                size={16}
              />
            </YStack>
          )}
        </_Select.Viewport>

        <_Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </_Select.ScrollDownButton>
      </_Select.Content>
    </_Select>
  );
}
