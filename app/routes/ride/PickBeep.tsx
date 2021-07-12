import React, { useEffect } from 'react';
import { Layout, Text, Divider, List, ListItem, Button, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { BackIcon } from '../../utils/Icons';
import ProfilePicture from '../../components/ProfilePicture';
import { gql, useQuery } from '@apollo/client';
import { printStars } from '../../components/Stars';
import { GetBeeperListQuery, User } from '../../generated/graphql';
import { Navigation } from '../../utils/Navigation';

interface Props {
    navigation: Navigation;
    route: any;
}

const GetBeepers = gql`
    query GetBeeperList($latitude: Float!, $longitude: Float!) {
        getBeeperList(input: {
            latitude: $latitude,
            longitude: $longitude
        })  {
            id
            first
            last
            isStudent
            singlesRate
            groupRate
            capacity
            queueSize
            photoUrl
            role
            masksRequired
            rating
            venmo
            cashapp
        }
    }
`;

export function PickBeepScreen(props: Props): JSX.Element {
    const { navigation, route } = props;
    const { data, loading, error, startPolling, stopPolling } = useQuery<GetBeeperListQuery>(GetBeepers, {
      variables: {
        latitude: route.params.latitude,
        longitude: route.params.longitude
      }
    });

    useEffect(() => {
        startPolling(5000);
        return () => {
            stopPolling();
        };
    }, []);

    function getSubtitle(): string {
      if (loading) return `0 people are beeping`;
      if (error) return `Unable to get beeper list`;
      return (data?.getBeeperList.length == 1) ? `${data.getBeeperList.length} person is beeping` : `${data?.getBeeperList.length} people are beeping`;
    }

    function goBack(id: string): void {
        route.params.handlePick(id);
        navigation.goBack();
    }

    function getDescription(user: User): string {
        return `${user.queueSize} in ${user.first}'s queue\nCapacity: ${user.capacity} riders\nSingles: $${user.singlesRate}\nGroups: $${user.groupRate}\nUser Rating: ${printStars(user.rating)}`;
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()}/>
    );

    const renderItem = ({ item }: { item: User }) => (
        <ListItem
            onPress={() => goBack(item.id)}
            title={`${item.first} ${item.last}`}
            description={getDescription(item)}
            accessoryRight={() => {
                return (
                    <View style={styles.row}>
                        {item.role === "admin" && <Button size='tiny' status='danger'>Founder</Button>}
                        {item.isStudent && <Button status="basic" size='tiny' style={{marginRight: 4}}>Student</Button>}
                        {item.masksRequired && <Button status="info" size='tiny' style={{marginRight: 4}}>Masks</Button>}
                        {item.venmo && <Button status="info" size='tiny' style={{marginRight: 4}}>Venmo</Button>}
                        {item.cashapp && <Button status="success" size='tiny' style={{marginRight: 4}}>Cash App</Button>}
                    </View>
                );
            }}
            accessoryLeft={() => {
                return (
                    <ProfilePicture
                        size={50}
                        url={item.photoUrl || ''}
                    />
                );
            }}
        />
    );

  return (
    <>
      <TopNavigation title='Beeper List'
        alignment='center'
        subtitle={getSubtitle()}
        accessoryLeft={BackAction}
      />
      {loading &&
        <Layout style={styles.container}>
          <Spinner size='large' />
        </Layout>
      }
      {error &&
        <Layout style={styles.container}>
          <Text category='h5'>Error</Text>
          <Text appearance='hint'>{error.message}</Text>
        </Layout>
      }
      {data?.getBeeperList && data.getBeeperList.length === 0 &&
        <Layout style={styles.container}>
          <Text category='h5'>Nobody is beeping!</Text>
          <Text appearance='hint'>Nobody is giving rides right now. Check back later!</Text>
        </Layout>
      }
      {data?.getBeeperList && data.getBeeperList.length > 0 &&
        <List
          data={data.getBeeperList}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      }
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: "center",
        justifyContent: 'center'
    },
    row: {
        flex: 1,
        flexDirection: "row-reverse",
    }
});
