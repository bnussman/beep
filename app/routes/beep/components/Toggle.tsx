import React from 'react';
import { Toggle as KittenToggle } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

interface Props {
    isBeepingState: boolean;
    onToggle: (value: boolean) => void
}

export default function Toggle(props: Props) {
    return (
        <KittenToggle
            style={styles.toggle}
            onChange = {(value) => props.onToggle(value)}
            checked = {props.isBeepingState}
        >
            {props.isBeepingState ? "Stop Beeping" : "Start Beeping"}
        </KittenToggle>
    );
}

const styles = StyleSheet.create({
    toggle: {
        marginBottom: 7
    }
});
