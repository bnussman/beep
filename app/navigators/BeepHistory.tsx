import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Tab, TabView, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { BeeperRideLogScreen } from "../routes/history/beeper";
import { RiderRideLogScreen } from "../routes/history/rider";
import { BackIcon } from '../utils/Icons';

export const BeepHistoryNavigator = ({ navigation }) => {

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()}/>
    );

    return (
        <>
            <TopNavigation
                title='Beep Logs' 
                alignment='center' 
                accessoryLeft={BackAction} 
            />
            <Layout style={styles.conatiner}>
                <TabView
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                    <Tab title='Beeps'>
                        <Layout style={styles.tabContainer}>
                            <BeeperRideLogScreen navigation={navigation} />
                        </Layout>
                    </Tab>
                    <Tab title='Rides'>
                        <Layout style={styles.tabContainer}>
                            <RiderRideLogScreen navigation={navigation} />
                        </Layout>
                    </Tab>
                </TabView>
            </Layout>
        </>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        height: "100%",
        width: "100%",
    },
    conatiner: {
        height: "100%",
        width: "100%",
    }
});
