import { Box, Text } from "native-base";
import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { BEEPER_ICON } from "./constants";

export const NUM_CONFETTI = 100;
export const COLORS = [
  "#00e4b2",
  "#09aec5",
  "#107ed5",
  "#a864fd",
  "#29cdff",
  "#78ff44",
  "#ff718d",
  "#fdff6a",
];

export const CONFETTI_SIZE = 3;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ConfettiPiece = ({
  x,
  y,
  xVel,
  angle,
  delay,
  yVel,
  angleVel,
  color,
  elasticity,
}: any) => {
  const clock = useSharedValue(0);
  const duration = useSharedValue(getDuration());
  const localX = useSharedValue(x);
  const localY = useSharedValue(y);
  const localXVel = useSharedValue(xVel);
  const localAngle = useSharedValue(angle);
  const timeDiff = useSharedValue(0);
  const dt = useSharedValue(0);
  const dy = useSharedValue(0);
  const dx = useSharedValue(0);
  const dAngle = useSharedValue(0);

  function getDuration() {
    // Adding an extra 100 to the screen's height to ensure it goes off the screen.
    // Then using time = distance / speed for the time calc.
    const a = screenHeight + 100;
    return (a / yVel) * 1000;
  }

  useEffect(() => {
    // delay is multiplied by 1000 to convert into milliseconds
    clock.value = withDelay(
      delay * 1000,
      withTiming(1, { duration: duration.value })
    );
    return () => {
      cancelAnimation(clock);
    };
  });

  const uas = useAnimatedStyle(() => {
    // Because our clock.value is going from 0 to 1, it's value will let us
    // get the actual number of milliseconds by taking it multiplied by the
    // total duration of the animation.
    timeDiff.value = clock.value * duration.value;
    dt.value = timeDiff.value / 1000;

    dy.value = dt.value * yVel;
    dx.value = dt.value * localXVel.value;
    dAngle.value = dt.value * angleVel;
    localY.value = y + dy.value;
    localX.value = x + dx.value;
    localAngle.value += dAngle.value;

    if (localX.value > screenWidth - CONFETTI_SIZE) {
      localX.value = screenWidth - CONFETTI_SIZE;
      localXVel.value = localXVel.value * -1 * elasticity;
    }

    if (localX.value < 0) {
      localX.value = 0;
      localXVel.value = xVel.value * -1 * elasticity;
    }

    return {
      transform: [
        { translateX: localX.value },
        { translateY: localY.value },
        { rotate: localAngle.value + "deg" },
        { rotateX: localAngle.value + "deg" },
        { rotateY: localAngle.value + "deg" },
      ],
    };
  });

  return (
    <Animated.View style={[styles.confettiContainer, uas]}>
      <Box bgColor={color} w={CONFETTI_SIZE} h={CONFETTI_SIZE} />
      {/* <Text>{BEEPER_ICON}</Text> */}
      {/* <Text fontSize="2xl">🍆</Text> */}
    </Animated.View>
  );
};

export const confetti = [...new Array(100)].map((_, index) => {
  // For 'x', spawn confetti from two different sources, a quarter
  // from the left and a quarter from the right edge of the screen.
  return {
    key: index,
    x: screenWidth * (index % 2 ? 0.25 : 0.75) - CONFETTI_SIZE / 2,
    y: -60,
    angle: 0,
    xVel: Math.random() * 400 - 200,
    yVel: Math.random() * 165 + 165,
    angleVel: (Math.random() * 3 - 1.5) * Math.PI,
    delay: Math.floor(index / 10) * 0.5,
    elasticity: Math.random() * 0.3 + 0.1,
    color: COLORS[index % COLORS.length],
  };
});

const styles = StyleSheet.create({
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  confetti: {
    width: CONFETTI_SIZE,
    height: CONFETTI_SIZE,
  },
});
