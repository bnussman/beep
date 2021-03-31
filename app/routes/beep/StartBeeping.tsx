import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { StyleSheet, Linking, Platform, TouchableWithoutFeedback, Keyboard, Alert, AppState } from 'react-native';
import { Card, Layout, Text, Button, Input, List, CheckBox } from '@ui-kitten/components';
import { UserContext } from '../../utils/UserContext';
import { isAndroid } from "../../utils/config";
import ActionButton from "../../components/ActionButton";
import AcceptDenyButton from "../../components/AcceptDenyButton";
import AsyncStorage from '@react-native-community/async-storage';
import { PhoneIcon, TextIcon, VenmoIcon, MapsIcon, DollarIcon } from '../../utils/Icons';
import ProfilePicture from '../../components/ProfilePicture';
import Toggle from "./components/Toggle";
import * as Permissions from 'expo-permissions';
import Logger from '../../utils/Logger';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GetInitialQueueQuery, UpdateBeepSettingsMutation } from '../../generated/graphql';

interface Props {
    navigation: any;
}

let unsubscribe = null;

const GetInitialQueue = gql`
    query GetInitialQueue {
        getQueue {
            id
            isAccepted
            groupSize
            origin
            destination
            state
            timeEnteredQueue
            rider {
                id
                name
                first
                last
                venmo
                cashapp
                phone
                photoUrl
            }
        }
    }
`;

const GetQueue = gql`
    subscription GetQueue($topic: String!) {
        getBeeperUpdates(topic: $topic) {
            id
            isAccepted
            groupSize
            origin
            destination
            state
            timeEnteredQueue
            rider {
                id
                first
                last
                venmo
                cashapp
                phone
                photoUrl
            }
        }
    }
`;

const UpdateBeepSettings = gql`
    mutation UpdateBeepSettings($singlesRate: Float!, $groupRate: Float!, $capacity: Float!, $isBeeping: Boolean!, $masksRequired: Boolean!) {
        setBeeperStatus(
        input : {
            singlesRate: $singlesRate
            groupRate: $groupRate
            capacity: $capacity
            isBeeping: $isBeeping
            masksRequired: $masksRequired
        }
        )
    }
`;

const LOCATION_TRACKING = 'location-tracking';

export function StartBeepingScreen(props: Props) {
    const userContext: any = React.useContext(UserContext);
    const [isBeeping, setIsBeeping] = useState<boolean>(userContext.user.user.isBeeping);
    const [masksRequired, setMasksRequired] = useState<boolean>(userContext.user.user.masksRequired);
    const [singlesRate, setSinglesRate] = useState<string>(userContext.user.user.singlesRate);
    const [groupRate, setGroupRate] = useState<string>(userContext.user.user.groupRate);
    const [capacity, setCapacity] = useState<string>(userContext.user.user.capacity);

    const { subscribeToMore, loading, error, data, refetch } = useQuery<GetInitialQueueQuery>(GetInitialQueue, { notifyOnNetworkStatusChange: true });
    //const { loading, error, data } = useSubscription<GetQueueSubscription>(GetQueue, { variables: { topic: userContext.user.user.id }});
    const [updateBeepSettings, { loading: loadingBeepSettings, error: beepSettingsError }] = useMutation<UpdateBeepSettingsMutation>(UpdateBeepSettings);

    function toggleSwitchWrapper(value: boolean): void {
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
                    { text: "OK", onPress: () => toggleSwitch(value) }
                ],
                { cancelable: true }
            );
        }
        else {
            toggleSwitch(value);
        }
    }

    async function toggleSwitch(value: boolean): Promise<void> {
        setIsBeeping(value);

        if (value) {
            //if we are turning on isBeeping, ensure we have location permission
            const { status } = await Permissions.askAsync(Permissions.LOCATION);


            if (status !== 'granted') {
                setIsBeeping(false);
                return alert("You must allow location to beep!");
            }
            //if user turns 'isBeeping' on (to true), subscribe to rethinkdb changes
            startLocationTracking();
        }
        else {
            //if user turns 'isBeeping' off (to false), unsubscribe to rethinkdb changes
            stopLocationTracking();
        }
        
        const result = await updateBeepSettings({ variables: {
            isBeeping: !isBeeping,
            singlesRate: Number(singlesRate),
            groupRate: Number(groupRate),
            masksRequired: masksRequired,
            capacity: Number(capacity)
        }});

        if (result) {
            //We sucessfuly updated beeper status in database
            const tempUser = JSON.parse(JSON.stringify(userContext.user));
            tempUser.user.isBeeping = value;
            AsyncStorage.setItem('auth', JSON.stringify(tempUser));
            userContext.setUser(tempUser);
            if (value) {
                sub();
            }
            else {
                if (unsubscribe) unsubscribe();
            }
        }
        else {
            //Use native popup to tell user why they could not change their status
            //Unupdate the toggle switch because something failed
            //We redo our actions so the client does not have to wait on server to update the switch
            setIsBeeping(!isBeeping);
            //we also need to resubscribe to the socket
            if (isBeeping) {
                startLocationTracking();
            }
            else {
                stopLocationTracking();
            }
        }
    }

    async function startLocationTracking(): Promise<void> {
        if (!__DEV__) {
            await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
                accuracy: Location.Accuracy.Highest,
                timeInterval: (15 * 1000),
                distanceInterval: 6,
                foregroundService: {
                    notificationTitle: "Ride Beep App",
                    notificationBody: "You are currently beeping!",
                    notificationColor: "#e8c848"
                }
            });
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(
                LOCATION_TRACKING
            );
        }
    }

    async function stopLocationTracking(): Promise<void> {
        if (!__DEV__) {
            Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        }
    }

    useEffect(() => {
        if (userContext.user.user.isBeeping) sub();

        AppState.addEventListener("change", handleAppStateChange);


        return () => {
            AppState.removeEventListener("change", handleAppStateChange);
        };
    }, []);

    function handleAppStateChange(nextAppState: string): void {
        if(nextAppState === "active" && userContext.user.user.isBeeping) {
            refetch();
        }
    }

    function sub() {
        unsubscribe = subscribeToMore({
            document: GetQueue,
            variables: {
                topic: userContext.user.user.id
            },
            updateQuery: (prev, { subscriptionData }) => {
                const newQueue = subscriptionData.data.getBeeperUpdates;
                console.log(newQueue);
                return Object.assign({}, prev, {
                    getQueue: newQueue
                });
            }
        });
    }

    function handleDirections(origin: string, dest: string): void {
        if (Platform.OS == 'ios') {
            Linking.openURL('http://maps.apple.com/?saddr=' + origin + '&daddr=' + dest);
        }
        else {
            Linking.openURL('https://www.google.com/maps/dir/' + origin + '/' + dest + '/');
        }
    }

    function handleVenmo(groupSize: string | number, venmo: string): void {
        if (groupSize > 1) {
            Linking.openURL('venmo://paycharge?txn=pay&recipients='+ venmo + '&amount=' + userContext.user.user.groupRate + '&note=Beep');
        }
        else {
            Linking.openURL('venmo://paycharge?txn=pay&recipients='+ venmo + '&amount=' + userContext.user.user.singlesRate + '&note=Beep');
        }
    }

    function handleCashApp(groupSize: string | number, cashapp: string): void {
        if (Number(groupSize) > 1) {
            Linking.openURL(`https://cash.app/$${cashapp}/${Number(groupSize) * userContext.user.user.groupRate}`);
        }
        else {
            Linking.openURL(`https://cash.app/$${cashapp}/${userContext.user.user.singlesRate}`);
        }
    }

    if(!isBeeping) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!(Platform.OS == "ios" || Platform.OS == "android")} >
                <Layout style={styles.container}>
                    <Toggle isBeepingState={isBeeping} onToggle={async (value) => toggleSwitchWrapper(value)}/>
                    <Layout style={{marginTop: 6, width: "85%"}}>
                        <Input
                            label='Max Capacity'
                            caption='The maximum number of people you can fit in your vehicle not including yourself.'
                            placeholder='Max Capcity'
                            keyboardType='numeric'
                            style={styles.inputs}
                            value={String(capacity)}
                            onChangeText={(value) => setCapacity(value)}
                        />
                        <Input
                            label='Singles Rate'
                            caption='Riders who need a ride alone will pay this price.'
                            placeholder='Singles Rate'
                            keyboardType='numeric'
                            style={styles.inputs}
                            accessoryLeft={DollarIcon}
                            value={String(singlesRate)}
                            onChangeText={(value) => setSinglesRate(value)}
                        />
                        <Input
                            label='Group Rate'
                            caption='Riders who ride in a group will each pay this price.'
                            placeholder='Group Rate'
                            keyboardType='numeric'
                            style={styles.inputs}
                            accessoryLeft={DollarIcon}
                            value={String(groupRate)}
                            onChangeText={(value) => setGroupRate(value)}
                        />
                        <CheckBox
                            checked={masksRequired}
                            onChange={(value) => setMasksRequired(value)}
                            style={{marginTop: 15}}
                        >
                            Require riders to have a mask
                        </CheckBox>
                    </Layout>
                </Layout>
            </TouchableWithoutFeedback>
        );
    }
    else {
        if (data?.getQueue && data.getQueue.length > 0) {
            return (
                <Layout style={styles.container}>
                    {loading && <Text>Loading</Text>}
                    <Toggle isBeepingState={isBeeping} onToggle={async (value) => toggleSwitchWrapper(value)}/>
                    <List
                        style={styles.list}
                        data={data?.getQueue}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({item, index}) =>
                            item.isAccepted ?

                                <Card
                                    style={styles.cards}
                                    status={(0 == index) ? "primary" : "basic"} 
                                    onPress={() => props.navigation.navigate("Profile", { id: item.rider.id, beep: item.id })}
                                >
                                    <Layout
                                        style={{flex: 1, flexDirection: "row", alignItems: 'center'}}
                                    >
                                        {item.rider.photoUrl &&
                                        <ProfilePicture
                                            size={50}
                                            url={item.rider.photoUrl}
                                        />
                                        }
                                        <Text category="h6" style={styles.rowText}>{item.rider.first} {item.rider.last}</Text>
                                        {item.rider.isStudent && <Text>🎓</Text>}
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
                                                onPress={() =>{ Linking.openURL('tel:' + item.rider.phone); } }
                                            >
                                                Call Rider
                                            </Button>
                                        </Layout>
                                        <Layout style={styles.layout}>
                                            <Button
                                                size="small"
                                                status='basic'
                                                accessoryLeft={TextIcon}
                                                onPress={() =>{ Linking.openURL('sms:' + item.rider.phone); } }
                                            >
                                                Text Rider
                                            </Button>
                                        </Layout>
                                    </Layout>
                                    {item.rider?.venmo &&
                                        <Button
                                            size="small"
                                            style={styles.paddingUnder}
                                            status='info'
                                            accessoryLeft={VenmoIcon}
                                            onPress={() => handleVenmo(item.groupSize, item.rider.venmo)}
                                        >
                                            Request Money from Rider with Venmo
                                        </Button>
                                    }
                                    {item.rider?.cashapp &&
                                        <Button
                                            size="small"
                                            style={styles.paddingUnder}
                                            status='success'
                                            accessoryLeft={VenmoIcon}
                                            onPress={() => handleCashApp(item.groupSize, item.rider.cashapp)}
                                        >
                                            Request Money from Rider with Cash App
                                        </Button>
                                    }
                                    {item.state <= 1 ?
                                        <Button
                                            size="small"
                                            style={styles.paddingUnder}
                                            status='success'
                                            accessoryLeft={MapsIcon}
                                            onPress={() => handleDirections("Current+Location", item.origin) }
                                        >
                                            Get Directions to Rider
                                        </Button>
                                        :
                                        <Button
                                            size="small"
                                            style={styles.paddingUnder}
                                            status='success'
                                            accessoryLeft={MapsIcon}
                                            onPress={() => handleDirections(item.origin, item.destination) }
                                        >
                                            Get Directions for Beep
                                        </Button>
                                    }
                                    {index == 0 && <ActionButton item={item}/>}
                                </Card>

                                :

                                <Card
                                    style={styles.cards}
                                    onPress={() => props.navigation.navigate("Profile", { id: item.rider.id, beep: item.id })}
                                >
                                    <Layout style={{flex: 1, flexDirection: "row", alignItems: 'center'}}>
                                        {item.rider.photoUrl &&
                                        <ProfilePicture
                                            size={50}
                                            url={item.rider.photoUrl}
                                        />
                                        }
                                        <Text category="h6" style={styles.rowText}>{item.rider.first} {item.rider.last}</Text>
                                        {item.rider.isStudent && <Text>🎓</Text>}
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
                    <Toggle isBeepingState={isBeeping} onToggle={async (value) => toggleSwitchWrapper(value)}/>
                    <Layout style={styles.empty}>
                        <Text category='h5'>Your queue is empty</Text>
                        <Text appearance='hint'>If someone wants you to beep them, it will appear here. If your app is closed, you will recieve a push notification.</Text>
                    </Layout>
                </Layout>
            );
        }
    }
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        return Logger.error(error);
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

        const auth = await AsyncStorage.getItem('auth')

        if (!auth) return;

        const authToken = JSON.parse(auth).tokens.id;
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
