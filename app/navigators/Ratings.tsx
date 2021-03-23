import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Tab, TabView, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { BackIcon } from '../utils/Icons';
import { RatingsIMadeScreen } from '../routes/ratings/RatingsIMade';
import {RatingsOnMeScreen} from '../routes/ratings/RatingsOnMe';

export const RatingsNavigator = ({ navigation }) => {

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()}/>
    );

    return (
        <>
            <TopNavigation
                title='Ratings' 
                alignment='center' 
                accessoryLeft={BackAction} 
            />
            <Layout style={styles.conatiner}>
                <TabView
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                    <Tab title='Ratings I made'>
                        <Layout style={styles.tabContainer}>
                            <RatingsIMadeScreen navigation={navigation} />
                        </Layout>
                    </Tab>
                    <Tab title='Ratings on me'>
                        <Layout style={styles.tabContainer}>
                            <RatingsOnMeScreen navigation={navigation} />
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
