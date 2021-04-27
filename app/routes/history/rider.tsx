import React from 'react';
import { Layout, Text, Divider, List, ListItem, Spinner } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import ProfilePicture from '../../components/ProfilePicture';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainNavParamList} from '../../navigators/MainTabs';
import { gql, useQuery } from '@apollo/client';
import { GetRideHistoryQuery } from '../../generated/graphql';

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
}

const GetRideHistory = gql`
    query GetRideHistory {
        getRideHistory {
            items {
                id
                start
                end
                groupSize
                origin
                destination
                beeper {
                    id
                    name
                    first
                    last
                    photoUrl
                }
            }
            count
        }
    }
`;

export function RiderRideLogScreen(props: Props) {
    const { data, loading, error, refetch } = useQuery<GetRideHistoryQuery>(GetRideHistory);

        const renderItem = ({ item }) => (
            <ListItem
                accessoryLeft={() => {
                    return (
                        <ProfilePicture
                            size={50}
                            url={item.beeper.photoUrl}
                        />
                    );
                }}
                onPress={() => props.navigation.push("Profile", { id: item.beeper.id, beep: item.id })}
                title={`${item.beeper.first} ${item.beeper.last} beeped you`}
                description={`Group size: ${item.groupSize}\nOrigin: ${item.origin}\nDestination: ${item.destination}\nDate: ${new Date(item.start)}`}
            />
        );
        
        if (!loading) {
            if (data?.getRideHistory && data.getRideHistory.items.length != 0) {
                return (
                <Layout style={styles.container}>
                    <List
                        style={{width:"100%"}}
                        data={data?.getRideHistory.items}
                        ItemSeparatorComponent={Divider}
                        renderItem={renderItem}
                    />
                </Layout>
                );
            }
            else {
                return (
                    <Layout style={styles.container}>
                        <Text category='h5'>Nothing to display!</Text>
                        <Text appearance='hint'>You have no previous rides to display</Text>
                    </Layout>
                );
            }
        }
        else {
            return (
                <Layout style={styles.container}>
                    <Text category='h5'>Loading your history</Text>
                    <Spinner />
                </Layout>
            );
        }
}

const styles = StyleSheet.create({
    container: {
        height: '83%',
        alignItems: "center",
        justifyContent: 'center'
    }
});
