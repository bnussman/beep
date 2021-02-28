import React from 'react';
import { Platform, StatusBar } from 'react-native';

export type barStyles = "light-content" | "dark-content";

interface Props {
    theme: string;
}

export default function ThemedStatusBar(props: Props) {
    
    const barStyle: barStyles = (props.theme === 'light' ? 'dark' : 'light') + "-content" as barStyles;

    const barColor: string = (props.theme === "dark") ? "#000000" : "#ffffff";

    if (Platform.OS == "ios") return <StatusBar barStyle={barStyle} />

    return <StatusBar translucent barStyle={barStyle} backgroundColor={barColor} />;
}
