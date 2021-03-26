import React from 'react';
import { Layout, Text, Divider, List, ListItem, Spinner } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import ProfilePicture from '../../components/ProfilePicture';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainNavParamList} from '../../navigators/MainTabs';
import { gql, useQuery } from '@apollo/client';
import {GetRatingsOnMeQuery} from '../../generated/graphql';
import {printStars} from '../../components/Stars';

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
}

const GetRatingsOnMe = gql`
    query GetRatingsOnMe($id: String, $me: Boolean) {
        getRatings(id: $id, me: $me) {
            items {
                id
                stars
                timestamp
                message
                rater {
                    id
                    name
                    photoUrl
                }
            }
            count
        }
    }
`;

export function RatingsOnMeScreen(props: Props) {
    const { data, loading, error, refetch } = useQuery<GetRatingsOnMeQuery>(GetRatingsOnMe);

        const renderItem = ({ item }) => (
            <ListItem
                accessoryLeft={() => {
                    return (
                        <ProfilePicture
                            size={50}
                            url={item.rater.photoUrl}
                        />
                    );
                }}
                onPress={() => props.navigation.push("Profile", { id: item.rater.id })}
                title={`${item.rater.name} rated you`}
                description={`Message: ${item.message}\nStars: ${printStars(item.stars)} ${item.stars}\n`}
            />
        );
        
        if (!loading) {
            if (data?.getRatings?.items && data.getRatings.count != 0) {
                return (
                <Layout style={styles.container}>
                    <List
                        style={{width:"100%"}}
                        data={data?.getRatings.items}
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
