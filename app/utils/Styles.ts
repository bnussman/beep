import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const styles = StyleSheet.create({
    statusbar: {
        paddingTop: getStatusBarHeight()
    }
});
