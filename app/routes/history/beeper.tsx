import React from 'react';
import { Layout, Text, Divider, List, ListItem, Spinner } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import ProfilePicture from '../../components/ProfilePicture';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavParamList } from '../../navigators/MainTabs';
import { gql, useQuery } from '@apollo/client';
import { GetBeepHistoryQuery } from '../../generated/graphql';

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
}

const GetBeepHistory = gql`
    query GetBeepHistory {
        getBeepHistory {
            items {
                id
                start
                end
                groupSize
                origin
                destination
                rider {
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

export function BeeperRideLogScreen(props: Props) {
    const { data, loading, error, refetch } = useQuery<GetBeepHistoryQuery>(GetBeepHistory);

        const renderItem = ({ item }) => (
            <ListItem
                accessoryLeft={() => {
                    return (
                        <ProfilePicture
                            size={50}
                            url={item.rider.photoUrl}
                        />
                    );
                }}
                onPress={() => props.navigation.push("Profile", { id: item.rider.id, beep: item.id })}
                title={`You beeped ${item.rider.first} ${item.rider.last}`}
                description={`Group size: ${item.groupSize}\nOrigin: ${item.origin}\nDestination: ${item.destination}\nDate: ${new Date(item.start)}`}
            />
        );
        
        if (!loading) {
            if (data?.getBeepHistory && data.getBeepHistory.items.length > 0) {
                return (
                <Layout style={styles.container}>
                    <List
                        style={{width:"100%"}}
                        data={data?.getBeepHistory.items}
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
                        <Text appearance='hint'>You have no previous beeps to display</Text>
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
