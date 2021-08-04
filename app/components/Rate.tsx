import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Button, ButtonElement } from '@ui-kitten/components';
import { StarIcon } from '../utils/Icons';

export interface RateBarProps extends ViewProps {
  hint: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RateBar = (props: RateBarProps): React.ReactElement<ViewProps> => {

  const renderRateButtonElement = (value: number): ButtonElement => {
    const status: string = value <= props.value ? 'warning' : 'basic';

    return (
      <Button
        key={value}
        style={styles.iconButton}
        appearance='ghost'
        size='giant'
        status={status}
        accessoryLeft={StarIcon}
        onPress={() => props.onValueChange(value)}
      />
    );
  };

  const { ...restProps } = props;

  return (
    <View
      {...restProps}
      style={[styles.container, restProps.style]}>
      {[1, 2, 3, 4, 5].map(renderRateButtonElement)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    marginRight: 8,
  },
  iconButton: {
    paddingHorizontal: -4,
  },
});
