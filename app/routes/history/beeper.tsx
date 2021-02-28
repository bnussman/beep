import React, { Component } from 'react';
import { Layout, Text, Divider, List, ListItem, Spinner } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { config } from "../../utils/config";
import { handleFetchError } from "../../utils/Errors";
import { UserContext } from '../../utils/UserContext';
import ProfilePicture from '../../components/ProfilePicture';
import { UserPluckResult } from '../../types/Beep';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavParamList } from '../../navigators/MainTabs';

export interface BeeperEventEntry {
    beep: {
        beepersid: string;
        destination: string;
        doneTime: string;
        groupSize: string;
        id: string;
        isAccepted: boolean;
        origin: string;
        riderid: string;
        state: number;
        timeEnteredQueue: number;
    };
    rider: {
        first: string;
        id: string;
        last: string;
        photoUrl: string;
        username: string;
    };
}

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
}

interface State {
    isLoading: boolean;
    beeperList: UserPluckResult[];
}

export class BeeperRideLogScreen extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            beeperList: []
        }
    }

    async getBeeperList(): Promise<void> {
        try {
            const result = await fetch(config.apiUrl + "/users/" + this.context.user.id + "/history/beeper", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.context.user.token}`
                }
            });

            const data = await result.json();

            if (data.status == "success") {
                this.setState({ isLoading: false, beeperList: data.data });
            }
            else {
                this.setState({ isLoading: handleFetchError(data.message) });
            }
        }
        catch (error) {
            this.setState({ isLoading: handleFetchError(error) });
        }
    }

    componentDidMount(): void {
        this.getBeeperList();
    }

    render() {
        const renderItem = ({ item }: { item: BeeperEventEntry }) => (
            <ListItem
                accessoryLeft={() => {
                    return (
                        <ProfilePicture
                            size={50}
                            url={item.rider.photoUrl}
                        />
                    );
                }}
                onPress={() => this.props.navigation.push("Profile", { id: item.rider.id, beepEventId: item.beep.id })}
                title={`You beeped ${item.rider.first} ${item.rider.last}`}
                description={`Group size: ${item.beep.groupSize}\nOrigin: ${item.beep.origin}\nDestination: ${item.beep.destination}\nDate: ${new Date(item.beep.timeEnteredQueue)}`}
            />
        );
        
        if (!this.state.isLoading) {
            if (this.state.beeperList && this.state.beeperList.length != 0) {
                return (
                <Layout style={styles.container}>
                    <List
                        style={{width:"100%"}}
                        data={this.state.beeperList}
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
}

const styles = StyleSheet.create({
    container: {
        height: '83%',
        alignItems: "center",
        justifyContent: 'center'
    }
});
