import React, { Component, ReactNode } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { StyleSheet, Linking, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Card, Layout, Text, Button, Input, List, CheckBox } from '@ui-kitten/components';
import socket from '../../utils/Socket';
import { UserContext, UserContextData } from '../../utils/UserContext';
import { config, isAndroid } from "../../utils/config";
import * as Notifications from 'expo-notifications';
import ActionButton from "../../components/ActionButton";
import AcceptDenyButton from "../../components/AcceptDenyButton";
import { handleFetchError } from "../../utils/Errors";
import AsyncStorage from '@react-native-community/async-storage';
import { PhoneIcon, TextIcon, VenmoIcon, MapsIcon, DollarIcon } from '../../utils/Icons';
import ProfilePicture from '../../components/ProfilePicture';
import Toggle from "./components/Toggle";
import * as Permissions from 'expo-permissions';
import Logger from '../../utils/Logger';
import { BeepTableResult } from '../../types/Beep';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainNavParamList} from '../../navigators/MainTabs';

interface Props {
    navigation: BottomTabNavigationProp<MainNavParamList>;
}

interface State {
    isBeeping: boolean; 
    masksRequired: boolean;
    capacity: undefined | string;
    singlesRate: undefined | string;
    groupRate: undefined | string;
    queue: BeepTableResult[];
}

const LOCATION_TRACKING = 'location-tracking';

export class StartBeepingScreen extends Component<Props, State> {
    static contextType = UserContext;
    
    constructor(props: Props, context: UserContextData) {
        super(props);
        this.state = {
            isBeeping: context.user.isBeeping,
            masksRequired: context.user.masksRequired,
            capacity: String(context.user.capacity),
            singlesRate: String(context.user.singlesRate),
            groupRate: String(context.user.groupRate),
            queue: []
        };
    }

    async retrieveData(): Promise<void> {
        try {
            const result = await fetch(config.apiUrl + '/users/' + this.context.user.id);

            const data = await result.json();

            if (data.status == "success") {
                if (this.state.isBeeping !== data.user.isBeeping) {
                    this.setState({ isBeeping: data.isBeeping });
                }

                if(data.user.isBeeping) {
                    this.getQueue();
                    this.enableGetQueue();
                    this.startLocationTracking();

                    const { status } = await Permissions.askAsync(Permissions.LOCATION);


                    if (status !== 'granted') {
                        //if we have no location access, dont let the user beep
                        //TODO we only disable beeping client side, should we push false to server also?
                        this.setState({ isBeeping: false });
                        this.disableGetQueue();
                        this.stopLocationTracking();
                        //TODO better error handling
                        alert("You must allow location to beep!");
                    }
                }
            }
            else {
                handleFetchError(data.message);
            }
        }
        catch (error) {
            handleFetchError(error);
        }
    }

    async startLocationTracking(): Promise<void> {
        if (!__DEV__) {
            await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
                accuracy: Location.Accuracy.Highest,
                timeInterval: (30 * 1000),
                distanceInterval: 20,
                foregroundService: {
                    notificationTitle: "Ride Beep App",
                    notificationBody: "You are currently beeping!",
                    notificationColor: "#e8c848"
                }
            });
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(
                LOCATION_TRACKING
            );
            console.log(hasStarted);
        }
    } 

    async stopLocationTracking(): Promise<void> {
        if (!__DEV__) {
            Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        }
    }

    componentDidMount(): void {
        this.retrieveData();

        socket.on("updateQueue", () => {
            this.getQueue();
            //alert("Socket Triggered an Update");
        });

        socket.on("connect", async () => {
            await this.retrieveData();
            if (this.state.isBeeping) {
                Logger.info("[getQueue] reconnected to socket successfully");
                this.getQueue();
                this.enableGetQueue();
            }
        });
    }

    async getQueue(): Promise<void> {
        try {
            const result = await fetch(config.apiUrl + "/users/" + this.context.user.id + "/queue", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.context.user.token
                }
            });

            const data = await result.json();
            
            if (data.status === "success") {
                //this is cool and it works with web somehow, iOS or web
                //badge count will be your queue size!!
                //TODO revisit this
                Notifications.setBadgeCountAsync(data.queue.length);

                if (JSON.stringify(this.state.queue) !== JSON.stringify(data.queue)) {
                    this.setState({ queue: data.queue });
                }
            }
            else {
                handleFetchError(data.message);
            }
        }
        catch (error) {
            handleFetchError(error);
        }
    }

    toggleSwitchWrapper(value: boolean): void {
        if (isAndroid && value) {
            Alert.alert(
                "Background Location Notice",
                "Ride Beep App collects location data to enable ETAs for riders when your are beeping and the app is closed or not in use",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                    },
                    //fuck buddy
                    { text: "OK", onPress: () => this.toggleSwitch(value) }
                ],
                { cancelable: true }
            );
        }
        else {
            this.toggleSwitch(value);
        }
    }

    async toggleSwitch(value: boolean): Promise<void> {
        //Update the toggle switch's value into a isBeeping state
        this.setState({ isBeeping: value });

        if (value) {
            //if we are turning on isBeeping, ensure we have location permission
            const { status } = await Permissions.askAsync(Permissions.LOCATION);


            if (status !== 'granted') {
                this.setState({ isBeeping: false });
                return alert("You must allow location to beep!");
            }
            //if user turns 'isBeeping' on (to true), subscribe to rethinkdb changes
            this.enableGetQueue();
            this.startLocationTracking();
        }
        else {
            //if user turns 'isBeeping' off (to false), unsubscribe to rethinkdb changes
            this.disableGetQueue();
            this.stopLocationTracking();
        }
        
        try {
            const result = await fetch(config.apiUrl + "/beeper/status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.context.user.token
                },
                body: JSON.stringify({
                    isBeeping: value,
                    singlesRate: this.state.singlesRate,
                    groupRate: this.state.groupRate,
                    capacity: this.state.capacity,
                    masksRequired: this.state.masksRequired
                })
            });

            const data = await result.json();

            if (data.status === "success") {
                //We sucessfuly updated beeper status in database
                if (value) {
                    this.getQueue();
                }

                const tempUser = JSON.parse(JSON.stringify(this.context.user));
                tempUser.isBeeping = value;
                AsyncStorage.setItem('@user', JSON.stringify(tempUser));
                //this.context.setUser(tempUser);
            }
            else {
                //Use native popup to tell user why they could not change their status
                //Unupdate the toggle switch because something failed
                //We redo our actions so the client does not have to wait on server to update the switch
                this.setState({ isBeeping: !this.state.isBeeping });
                //we also need to resubscribe to the socket
                if (this.state.isBeeping) {
                    this.enableGetQueue();
                    this.startLocationTracking();
                }
                else {
                    this.disableGetQueue();
                    this.stopLocationTracking();
                }

                handleFetchError(data.message);
            }
        }
        catch (error) {
            handleFetchError(error);
        }
    }

    enableGetQueue(): void {
        socket.emit('getQueue', this.context.user.id);
    }

    disableGetQueue(): void {
        socket.emit('stopGetQueue');
    }

    updateSingles(value: undefined | string): void {
        this.setState({ singlesRate: value });

        const tempUser = this.context.user;

        tempUser.singlesRate = value;

        AsyncStorage.setItem('@user', JSON.stringify(tempUser));
    }

    updateGroup(value: undefined | string): void {
        this.setState({groupRate: value});

        const tempUser = this.context.user;

        tempUser.groupRate = value;

        AsyncStorage.setItem('@user', JSON.stringify(tempUser));
    }

    updateCapacity(value: undefined | string): void {
        this.setState({capacity: value});

        const tempUser = this.context.user;

        tempUser.capacity = value;

        AsyncStorage.setItem('@user', JSON.stringify(tempUser));
    }

    handleDirections(origin: string | null, dest: string): void {
        if (origin) {
            if (Platform.OS == 'ios') {
                Linking.openURL('http://maps.apple.com/?saddr=' + origin + '&daddr=' + dest);
            }
            else {
                Linking.openURL('https://www.google.com/maps/dir/' + origin + '/' + dest + '/');
            }
        }
        else {
            if (Platform.OS == 'ios') {
                Linking.openURL('http://maps.apple.com/?saddr=My+Location&daddr=' + dest);
            }
            else {
                Linking.openURL('https://www.google.com/maps?q=' + dest);
            }
        }
    }

    handleVenmo (groupSize: string | number, venmo: string): void {
        if (groupSize > 1) {
            Linking.openURL('venmo://paycharge?txn=pay&recipients='+ venmo + '&amount=' + this.state.groupRate + '&note=Beep');
        }
        else {
            Linking.openURL('venmo://paycharge?txn=pay&recipients='+ venmo + '&amount=' + this.state.singlesRate + '&note=Beep');
        }
    }

    render(): ReactNode {
        console.log("[StartBeeping.js] Rendering Start Beeping Screen");
        if(!this.state.isBeeping) {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
                <Layout style={styles.container}>
                    <Toggle isBeepingState={this.state.isBeeping} onToggle={(value) => this.toggleSwitchWrapper(value)}/>
                    <Layout style={{marginTop: 6, width: "85%"}}>
                        <Input
                            label='Max Capacity'
                            caption='The maximum number of people your vehicle is designed to fit not including yourself.'
                            placeholder='Max Capcity'
                            keyboardType='numeric'
                            style={styles.inputs}
                            value={this.state.capacity}
                            onChangeText={(value) => this.updateCapacity(value)}
                        />
                        <Input
                            label='Singles Rate'
                            caption='Riders who need a ride alone will pay this price.'
                            placeholder='Singles Rate'
                            keyboardType='numeric'
                            style={styles.inputs}
                            value={this.state.singlesRate}
                            accessoryLeft={DollarIcon}
                            onChangeText={(value) => this.updateSingles(value)}
                        />
                        <Input
                            label='Group Rate'
                            caption='Riders who ride in a group will each pay this price.'
                            placeholder='Group Rate'
                            keyboardType='numeric'
                            style={styles.inputs}
                            value={this.state.groupRate}
                            accessoryLeft={DollarIcon}
                            onChangeText={(value) => this.updateGroup(value)}
                        />
                        <CheckBox
                            checked={this.state.masksRequired}
                            onChange={(value) => this.setState({ masksRequired: value })}
                            style={{marginTop: 7}}
                        >
                            Require riders to have a mask
                        </CheckBox>
                    </Layout>
                </Layout>
                </TouchableWithoutFeedback>
            );
        }
        else {
            if (this.state.queue && this.state.queue.length != 0) {
                return (
                    <Layout style={styles.container}>
                        <Toggle isBeepingState={this.state.isBeeping} onToggle={(value) => this.toggleSwitchWrapper(value)}/>
                        <List
                            style={styles.list}
                            data={this.state.queue}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({item, index}) =>
                                item.isAccepted ?

                                <Card
                                    style={styles.cards}
                                    status={(index == 0) ? "primary" : "basic"} 
                                    onPress={() => this.props.navigation.navigate("Profile", {id: item.riderid, beepEventId: item.id })}
                                >
                                    <Layout
                                        style={{flex: 1, flexDirection: "row", alignItems: 'center'}}
                                    >
                                        {item.personalInfo.photoUrl &&
                                        <ProfilePicture
                                            size={50}
                                            url={item.personalInfo.photoUrl}
                                        />
                                        }
                                        <Text category="h6" style={styles.rowText}>{item.personalInfo.first} {item.personalInfo.last}</Text>
                                        {item.personalInfo.isStudent && <Text>🎓</Text>}
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Text category='h6'>Group Size</Text>
                                        <Text style={styles.rowText}>{item.groupSize}</Text>
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Text category='h6'>Pick Up </Text>
                                        <Text style={{ width: '80%' }}>{item.origin}</Text>
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Text category='h6'>Drop Off </Text>
                                        <Text style={styles.rowText}>{item.destination}</Text>
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Layout style={styles.layout}>
                                            <Button
                                                size="small"
                                                style={styles.rowButton}
                                                status='basic'
                                                accessoryLeft={PhoneIcon}
                                                onPress={() =>{ Linking.openURL('tel:' + item.personalInfo.phone); } }
                                            >
                                            Call Rider
                                            </Button>
                                        </Layout>
                                        <Layout style={styles.layout}>
                                            <Button
                                                size="small"
                                                status='basic'
                                                accessoryLeft={TextIcon}
                                                onPress={() =>{ Linking.openURL('sms:' + item.personalInfo.phone); } }
                                            >
                                            Text Rider
                                            </Button>
                                    </Layout>
                                    </Layout>
                                    <Button
                                        size="small"
                                        style={styles.paddingUnder}
                                        status='info'
                                        accessoryLeft={VenmoIcon}
                                        onPress={() => this.handleVenmo(item.groupSize, item.personalInfo.venmo)}
                                    >
                                    Request Money from Rider with Venmo
                                    </Button>
                                    {item.state <= 1 ?
                                        <Button
                                            size="small"
                                            style={styles.paddingUnder}
                                            status='success'
                                            accessoryLeft={MapsIcon}
                                            onPress={() => this.handleDirections(null, item.origin) }
                                        >
                                        Get Directions to Rider
                                        </Button>
                                    :
                                        <Button
                                            size="small"
                                            style={styles.paddingUnder}
                                            status='success'
                                            accessoryLeft={MapsIcon}
                                            onPress={() => this.handleDirections(item.origin, item.destination) }
                                        >
                                        Get Directions for Beep
                                        </Button>
                                    }

                                    {index == 0 &&
                                        <ActionButton item={item}/>
                                    }
                                </Card>

                                :

                                <Card
                                    style={styles.cards}
                                    onPress={() => this.props.navigation.navigate("Profile", {id: item.riderid})}
                                >
                                    <Layout style={{flex: 1, flexDirection: "row", alignItems: 'center'}}>
                                        {item.personalInfo.photoUrl &&
                                        <ProfilePicture
                                            size={50}
                                            url={item.personalInfo.photoUrl}
                                        />
                                        }
                                        <Text category="h6" style={styles.rowText}>{item.personalInfo.first} {item.personalInfo.last}</Text>
                                        {item.personalInfo.isStudent && <Text>🎓</Text>}
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Text category='h6'>Entered Queue</Text>
                                        <Text style={styles.rowText}>{new Date(item.timeEnteredQueue).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Text category='h6'>Group Size</Text>
                                        <Text style={styles.rowText}>{item.groupSize}</Text>
                                    </Layout>
                                    <Layout style={styles.row}>
                                        <Layout style={styles.layout}>
                                            <AcceptDenyButton type="accept" item={item}/>
                                        </Layout>
                                        <Layout style={styles.layout}>
                                            <AcceptDenyButton type="deny" item={item}/>
                                        </Layout>
                                    </Layout>
                                </Card>
                            }
                        />
                    </Layout>
                );
            }
            else {
                return (
                    <Layout style={styles.container}>
                        <Toggle isBeepingState={this.state.isBeeping} onToggle={(value) => this.toggleSwitchWrapper(value)}/>
                        <Layout style={styles.empty}>
                            <Text category='h5'>Your queue is empty</Text>
                            <Text appearance='hint'>If someone wants you to beep them, it will appear here. If your app is closed, you will recieve a push notification.</Text>
                        </Layout>
                    </Layout>
                );
            }
        }
    }
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        Logger.error(error);
        return;
    }

    if (data) {
        const { locations } = data;
        const lat = locations[0].coords.latitude;
        const long = locations[0].coords.longitude;
        const altitude = locations[0].coords.altitude;
        const accuracy = locations[0].coords.accuracy;
        const altitudeAccuracy = locations[0].coords.altitudeAccuracy;
        const heading = locations[0].coords.heading;
        const speed = locations[0].coords.speed;

        const user = await AsyncStorage.getItem('@user');

        if (!user) return;

        const userObj = JSON.parse(user);

        socket.emit('updateUsersLocation', userObj.token, lat, long, altitude, accuracy, altitudeAccuracy, heading, speed);
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 15,
    },
    paddingUnder: {
        marginBottom:5,
    },
    list: {
        width: "90%",
        backgroundColor: 'transparent'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        marginBottom:5,
    },
    layout: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    toggle: {
        marginBottom: 7
    },
    inputs: {
        marginBottom: 6
    },
    empty : {
        height: '80%',
        width: '80%',
        alignItems: "center",
        justifyContent: 'center',
    },
    emptyConatiner: {
        width: '85%'
    },
    cards: {
        marginBottom: 10 
    },
    rowText: {
        marginTop: 2,
        marginLeft: 5
    },
    rowButton: {
        width: "98%"
    }
});
