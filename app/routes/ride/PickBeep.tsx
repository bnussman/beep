import React, { Component } from 'react';
import { Layout, Text, Divider, List, ListItem, Button, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { config } from "../../utils/config";
import { BackIcon, RefreshIcon } from '../../utils/Icons';
import { handleFetchError } from "../../utils/Errors";
import ProfilePicture from '../../components/ProfilePicture';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainNavParamList} from '../../navigators/MainTabs';
import {User} from '../../types/Beep';

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
    route: any;
}

interface State {
    isLoading: boolean;
    beeperList: User[];
}

export class PickBeepScreen extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            beeperList: []
        }
    }

    async getBeeperList(): Promise<void> {
        try {
            const result = await fetch(config.apiUrl + "/rider/list");

            const data = await result.json();

            if (data.status === "success") {
                this.setState({ isLoading: false, beeperList: data.beeperList });
            }
            else {
                this.setState({ isLoading: handleFetchError(data.message) });
            }
        }
        catch (error){
            this.setState({ isLoading: handleFetchError(error) });
        }
    }

    componentDidMount(): void {
        this.getBeeperList();
    }

    goBack(id: string): void {
        const { navigation, route } = this.props;
        route.params.handlePick(id);
        navigation.goBack();
    }

    getDescription(item: any): string {
        return `${item.queueSize} in ${item.first}'s queue\nCapacity: ${item.capacity} riders\nSingles: $${item.singlesRate}\nGroups: $${item.groupRate}`;
    }

    render() {
        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
        );

        const RefreshAction = () => (
            <TopNavigationAction icon={RefreshIcon} onPress={() => this.getBeeperList()}/>
        );

        const renderItem = ({ item }: any) => (
            <ListItem
                onPress={() => this.goBack(item.id)}
                title={`${item.first} ${item.last}`}
                description={this.getDescription(item)}
                accessoryRight={() => {
                    return (
                        <View style={styles.row}>
                            {item.userLevel > 0 && <Button size='tiny' status='danger'>Founder</Button>}
                            {item.isStudent && <Button status="basic" size='tiny' style={{marginRight: 4}}>Student</Button>}
                            {item.masksRequired && <Button status="info" size='tiny' style={{marginRight: 4}}>Masks</Button>}
                        </View>
                    );
                }}
                accessoryLeft={() => {
                    return (
                        <ProfilePicture
                            size={50}
                            url={item.photoUrl}
                        />
                    );
                }}
            />
        );
        
        if (!this.state.isLoading) {
            if (this.state.beeperList && this.state.beeperList.length != 0) {
                return (
                    <>
                        <TopNavigation title='Beeper List' 
                            alignment='center' 
                            subtitle={(this.state.beeperList.length == 1) ? `${this.state.beeperList.length} person is beeping` : `${this.state.beeperList.length} people are beeping`}
                            accessoryLeft={BackAction} 
                            accessoryRight={RefreshAction}
                        />
                        <List
                            data={this.state.beeperList}
                            ItemSeparatorComponent={Divider}
                            renderItem={renderItem}
                        />
                    </>
                );
            }
            else {
                return (
                    <>
                        <TopNavigation
                            title='Beeper List'
                            subtitle={(this.state.beeperList.length == 1) ? `${this.state.beeperList.length} person is beeping` : `${this.state.beeperList.length} people are beeping`}
                            alignment='center'
                            accessoryLeft={BackAction}
                            accessoryRight={RefreshAction}
                        />
                        <Layout style={styles.container}>
                            <Text category='h5'>Nobody is beeping!</Text>
                            <Text appearance='hint'>Nobody is giving rides right now. Check back later!</Text>
                        </Layout>
                    </>
                );
            }
        }
        else {
            return (
                <>
                    <TopNavigation
                        title='Beeper List'
                        subtitle={(this.state.beeperList.length == 1) ? `${this.state.beeperList.length} person is beeping` : `${this.state.beeperList.length} people are beeping`}
                        alignment='center'
                        accessoryLeft={BackAction}
                        accessoryRight={RefreshAction}
                    />
                    <Layout style={styles.container}>
                        <Spinner size='large' />
                    </Layout>
                </>
            );
        }
    } 
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
