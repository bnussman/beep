import React, { useContext, useEffect, useState, useRef } from 'react';
import { Share, Platform, StyleSheet, Linking, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, AppState } from 'react-native';
import { Layout, Text, Button, Input, Card } from '@ui-kitten/components';
import * as SplashScreen from 'expo-splash-screen';
import { UserContext } from '../../utils/UserContext';
import { PhoneIcon, TextIcon, VenmoIcon, FindIcon, ShareIcon, LoadingIndicator } from '../../utils/Icons';
import ProfilePicture from "../../components/ProfilePicture";
import LeaveButton from './LeaveButton';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavParamList } from '../../navigators/MainTabs';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { GetEtaQuery, GetInitialRiderStatusQuery } from '../../generated/graphql';
import { gqlChooseBeep } from './helpers';
import Logger from '../../utils/Logger';
import { client } from '../../utils/Apollo';
import { RateCard } from '../../components/RateCard';
import LocationInput from '../../components/LocationInput';
import * as Location from 'expo-location';
import { isMobile } from '../../utils/config';
import { Tags } from './Tags';
import { throttle } from 'throttle-debounce';

const InitialRiderStatus = gql`
  query GetInitialRiderStatus {
    getRiderStatus {
      id
      position
      isAccepted
      origin
      destination
      state
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photoUrl
        masksRequired
        capacity
        queueSize
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

const RiderStatus = gql`
  subscription RiderStatus($id: String!) {
    getRiderUpdates(id: $id) {
      id
      position
      isAccepted
      origin
      destination
      state
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photoUrl
        masksRequired
        capacity
        queueSize
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

const BeepersLocation = gql`
  subscription BeepersLocation($id: String!) {
    getLocationUpdates(id: $id) {
      latitude
      longitude
    }
  }
`;

const GetETA = gql`
  query GetETA ($start: String!, $end: String!) {
    getETA(start: $start, end: $end)
  }
`;

interface Props {
  navigation: BottomTabNavigationProp<MainNavParamList>;
}

let sub: any;

export function MainFindBeepScreen(props: Props): JSX.Element {
  const user = useContext(UserContext);

  const { subscribeToMore, loading, data, previousData } = useQuery<GetInitialRiderStatusQuery>(InitialRiderStatus, { notifyOnNetworkStatusChange: true });
  const [getETA, { data: eta, loading: etaLoading, error: etaError }] = useLazyQuery<GetEtaQuery>(GetETA);

  const [groupSize, setGroupSize] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [isGetBeepLoading, setIsGetBeepLoading] = useState<boolean>(false);

  const originRef = useRef<any>();
  const destinationRef = useRef<any>();

  const beep = data?.getRiderStatus;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  async function updateETA(lat: number, long: number): Promise<void> {
    getETA({
      variables: {
        start: `${lat},${long}`,
        end: data?.getRiderStatus?.origin
      }
    });
  }

  async function subscribeToLocation() {
    const a = client.subscribe({ query: BeepersLocation, variables: { id: data?.getRiderStatus?.beeper.id } });

    sub = a.subscribe(({ data }) => {
      throttleUpdateETA(data.getLocationUpdates.latitude, data.getLocationUpdates.longitude);
    });
  }

  const throttleUpdateETA = throttle(20000, updateETA);

  useEffect(() => {
    console.log("useEffect");
    SplashScreen.hideAsync();
    if (user?.id) {
      subscribeToMore({
        document: RiderStatus,
        variables: {
          id: user.id
        },
        updateQuery: (prev, { subscriptionData }) => {
          // @ts-expect-error This works, so I'm not changing it
          const newFeedItem = subscriptionData.data.getRiderUpdates;
          return Object.assign({}, prev, {
            getRiderStatus: newFeedItem
          });
        }
      });
    }
  }, [user?.id, appStateVisible]);

  useEffect(() => {
    if ((beep?.state == 1 && previousData?.getRiderStatus?.state == 0) || (beep?.state == 1 && !previousData)) {
      subscribeToLocation();
    }
    if (beep?.state == 2 && previousData?.getRiderStatus?.state == 1) {
      sub?.unsubscribe();
    }
    if (beep?.beeper.location) {
      updateETA(beep.beeper.location.latitude, beep.beeper.location.longitude);
    }
  }, [data]);

  async function findBeep(): Promise<void> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return alert("You must enable location to find a ride.");
    }

    let lastKnowLocation = await Location.getLastKnownPositionAsync({
      maxAge: 180000,
      requiredAccuracy: 800
    });

    if (!lastKnowLocation) {
      lastKnowLocation = await Location.getCurrentPositionAsync();
    }

    return props.navigation.navigate('PickBeepScreen', {
      latitude: lastKnowLocation.coords.latitude,
      longitude: lastKnowLocation.coords.longitude,
      handlePick: (id: string) => chooseBeep(id),
    });
  }

  async function chooseBeep(id: string): Promise<void> {
    setIsGetBeepLoading(true);
    try {
      await gqlChooseBeep({
        beeperId: id,
        origin: origin,
        destination: destination,
        groupSize: Number(groupSize)
      });
    }
    catch (error) {
      alert(error.message);
    }
    setIsGetBeepLoading(false);
  }

  function getVenmoLink(): string {
    if (!beep?.beeper.venmo) return '';

    if (Number(beep.groupSize) > 1) {
      return `venmo://paycharge?txn=pay&recipients=${beep.beeper.venmo}&amount=${beep.beeper.groupRate * beep.groupSize}&note=Beep`;
    }
    return `venmo://paycharge?txn=pay&recipients=${beep.beeper.venmo}&amount=${beep.beeper?.singlesRate}&note=Beep`;
  }

  function getCashAppLink(): string {
    if (!beep?.beeper.cashapp) return '';

    if (Number(beep.groupSize) > 1) {
      return `https://cash.app/$${beep.beeper.cashapp}/${beep.groupSize * beep.beeper.groupRate}`;
    }
    return `https://cash.app/$${beep.beeper.cashapp}/${beep.beeper.singlesRate}`;
  }

  function shareVenmoInformation(): void {
    try {
      Share.share({
        message: `Please Venmo ${beep?.beeper.venmo} $${beep?.beeper.groupRate} for the beep!`,
        url: getVenmoLink()
      });
    }
    catch (error) {
      Logger.error(error);
    }
  }

  function getCurrentStatusMessage(): string {
    switch (beep?.state) {
      case 0:
        return "Beeper is getting ready to come get you.";
      case 1:
        return "Beeper is on their way to get you.";
      case 2:
        return "Beeper is here to pick you up!";
      case 3:
        return "You are currenly in the car with your beeper.";
      default:
        return "Unknown";
    }
  }

  if (user?.isBeeping) {
    return (
      <Layout style={styles.container}>
        <Text category="h5">You are beeping!</Text>
        <Text appearance="hint">You can&apos;t find a ride when you are beeping</Text>
      </Layout>
    );
  }

  if (!beep) {
    return (
      <Layout style={{ height: "100%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!isMobile} >
            <Layout style={styles.container}>
              <RateCard {...props}/>
              <Input
                keyboardType="number-pad"
                label='Group Size'
                style={styles.buttons}
                placeholder='Group Size'
                value={groupSize}
                onChangeText={value => setGroupSize(value)}
                onSubmitEditing={() => originRef.current.focus()}
                returnKeyType="next"
              />
              <LocationInput
                ref={originRef}
                label="Pick-up Location"
                value={origin}
                setValue={(value) => setOrigin(value)}
                getLocation={true}
                onSubmitEditing={() => destinationRef.current.focus()}
                returnKeyType="next"
              />
              <LocationInput
                ref={destinationRef}
                label="Destination Location"
                value={destination}
                setValue={(value) => setDestination(value)}
                getLocation={false}
                returnKeyType="go"
              />
              {!isGetBeepLoading || loading ?
                <Button
                  accessoryRight={FindIcon}
                  onPress={() => findBeep()}
                  size='large'
                  style={{ marginTop: 15 }}
                  disabled={origin === 'Loading your location...' || !origin || !groupSize || !destination}
                >
                  Find a Beep
                </Button>
                :
                <Button
                  size='large'
                  style={{ marginTop: 15 }}
                  appearance='outline'
                  accessoryRight={LoadingIndicator}
                >
                  Loading
                </Button>
              }
            </Layout>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Layout>
    );
  }

  if (beep.isAccepted) {
    return (
      <Layout style={styles.container}>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate("Profile", { id: beep.beeper.id, beep: beep.id })} >
          <Layout style={{ alignItems: "center", justifyContent: 'center' }}>
            {beep.beeper.photoUrl ?
              <ProfilePicture
                style={{ marginBottom: 5 }}
                size={100}
                url={beep.beeper.photoUrl}
              />
              : null
            }
            <Layout style={styles.group}>
              <Text category='h6'>{beep.beeper.name}</Text>
              <Text appearance='hint'>is your beeper!</Text>
            </Layout>
          </Layout>
        </TouchableWithoutFeedback>
        <Tags user={beep.beeper} />
        {beep.position <= 0 ?
          <Layout style={styles.group}>
            <Card>
              <Text category='h6'>Current Status</Text>
              <Text appearance='hint'>
                {getCurrentStatusMessage()}
              </Text>
            </Card>
            {beep.state == 1 ?
              <Layout>
                <Card style={{ marginTop: 10 }}>
                  <Text category='h6'>Arrival ETA</Text>
                  {etaError ? <Text appearance='hint'>{etaError.message}</Text> : null}
                  {etaLoading ? <Text appearance='hint'>Loading ETA</Text> :
                    eta?.getETA && beep.beeper.location ?
                      <Text appearance='hint'>Your beeper is {eta.getETA} away</Text>
                      :
                      <Text appearance='hint'>Beeper has no location data</Text>
                  }
                </Card>
              </Layout>
              : null
            }
          </Layout>
          : null
        }
        {beep.position > 0 ?
          <Layout style={styles.group}>
            <Text category='h6'>{beep.position}</Text>
            <Text appearance='hint'>
              {beep.position === 1 ? "person is" : "people are"} ahead of you in {beep.beeper.first || "User"}&apos;s queue.
            </Text>
          </Layout>
          : null
        }
        <Button
          status='basic'
          accessoryRight={PhoneIcon}
          style={styles.buttons}
          onPress={() => Linking.openURL(`tel:${beep.beeper.phone}`)}
        >
          Call Beeper
        </Button>
        <Button
          status='basic'
          accessoryRight={TextIcon}
          style={styles.buttons}
          onPress={() => Linking.openURL(`sms:${beep.beeper.phone}`)}
        >
          Text Beeper
        </Button>
        {beep.beeper.venmo ?
          <Button
            status='info'
            accessoryRight={VenmoIcon}
            style={styles.buttons}
            onPress={() => Linking.openURL(getVenmoLink())}
          >
            Pay Beeper with Venmo
          </Button>
          : null
        }
        {beep.beeper.cashapp ?
          <Button
            status='success'
            accessoryRight={VenmoIcon}
            style={styles.buttons}
            onPress={() => Linking.openURL(getCashAppLink())}
          >
            Pay Beeper with Cash App
          </Button>
          : null
        }
        {Number(beep.groupSize) > 1 ?
          <Button
            status='basic'
            accessoryRight={ShareIcon}
            style={styles.buttons}
            onPress={() => shareVenmoInformation()}
          >
            Share Venmo Info with Your Friends
          </Button>
          : null
        }
        {beep.position >= 1 ? <LeaveButton /> : null}
      </Layout>
    );
  }
  else {
    return (
      <Layout style={styles.container}>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate("Profile", { id: beep.beeper.id, beep: beep.id })} >
          <Layout style={{ alignItems: "center", justifyContent: 'center' }}>
            {beep.beeper.photoUrl ?
              <ProfilePicture
                style={{ marginBottom: 5 }}
                size={100}
                url={beep.beeper.photoUrl}
              />
              : null
            }
            <Layout style={styles.group}>
              <Text appearance='hint'>Waiting on</Text>
              <Text category='h6'>{beep.beeper.name}</Text>
              <Text appearance='hint'>to accept your request.</Text>
            </Layout>
          </Layout>
        </TouchableWithoutFeedback>
        <Tags user={beep.beeper} />
        <Layout style={styles.group}>
          <Text category='h6'>{beep.beeper.first}{"'"}{(beep.beeper.first.charAt(beep.beeper.first.length - 1) != 's') ? "s" : ''} Rates</Text>
          <Text appearance='hint' style={{ marginBottom: 6 }}>per person</Text>
          <Layout style={styles.rateGroup}>
            <Layout style={styles.rateLayout}>
              <Text appearance='hint'>Single</Text>
              <Text>${beep.beeper.singlesRate}</Text>
            </Layout>
            <Layout style={styles.rateLayout} >
              <Text appearance='hint'>Group</Text>
              <Text>${beep.beeper.groupRate}</Text>
            </Layout>
          </Layout>
        </Layout>
        <Layout style={styles.group}>
          <Text category='h6'>{beep.beeper.queueSize}</Text>
          <Text appearance='hint'>
            {beep.beeper.queueSize === 1 ? "person is" : "people are"} ahead of you in {beep.beeper.first}{"'"}s queue
          </Text>
        </Layout>
        <LeaveButton />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    width: "100%"
  },
  buttons: {
    marginBottom: 5,
    width: "85%"
  },
  rowItem: {
    marginBottom: 5,
    width: "95%"
  },
  group: {
    alignItems: "center",
    marginBottom: 12,
    width: '100%'
  },
  groupConatiner: {
    flexDirection: 'row',
    width: "80%",
    alignItems: "center",
    justifyContent: 'center',
  },
  rateGroup: {
    flexDirection: 'row',
    width: 120
  },
  layout: {
    flex: 1,
  },
  rateLayout: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
});
