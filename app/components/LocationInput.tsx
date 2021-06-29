import 'react-native-get-random-values';
import React, {Ref} from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Autocomplete, AutocompleteItem, Icon, Layout, InputProps } from '@ui-kitten/components';
import * as Location from 'expo-location';
import {gql, useLazyQuery} from '@apollo/client';
import {GetSuggestionsQuery} from '../generated/graphql';
import { v4 } from 'uuid';

interface Props {
    getLocation: boolean;
    value: string;
    setValue: (id: string) => void;
    label: string;
    ref?: Ref<any>;
    returnKeyType: string;
}

const GetSuggestions = gql`
    query GetSuggestions($location: String!, $sessiontoken: String!) {
        getLocationSuggestions(location: $location, sessiontoken: $sessiontoken) {
            title
        }
    }
`;

let token: string;

function LocationInput(props: Props & InputProps, ref: Ref<any>) {
    const { getLocation, value, setValue, label, ...rest } = props;
    const [getSuggestions, { data, loading, error }] = useLazyQuery<GetSuggestionsQuery>(GetSuggestions);

    async function useCurrentLocation(): Promise<void> {
        props.setValue("Loading your location...");
       
        Location.setGoogleApiKey("AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI");

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            return alert("You must enable location to use this feature.");
        }

        const position = await Location.getCurrentPositionAsync({});
        const location = await Location.reverseGeocodeAsync({ latitude: position.coords.latitude, longitude: position.coords.longitude });

        let string;

        if (!location[0].name) {
            string = position.coords.latitude + ", "+ position.coords.longitude;
        }
        else {
            string = location[0].name + " " + location[0].street + " " + location[0].city + ", " + location[0].region + " " + location[0].postalCode;  
        }

        setValue(string);
    }

    const CurrentLocationIcon = (props: Props) => (
        <TouchableWithoutFeedback onPress={() => useCurrentLocation()}>
            <Icon {...props} name='pin'/>
        </TouchableWithoutFeedback>
    );

    const onSelect = (index: number) => {
        if (!data || !data.getLocationSuggestions) return;

        setValue(data.getLocationSuggestions[index].title);

        token = v4(); 
    };

    const onChangeText = (query: string) => {
        if (props.value.length == 0 && query.length > 0) {
            token = v4(); 
            console.log("Generated new token", token);
        }

        setValue(query);

        getSuggestions({ variables: {
            location: query,
            sessiontoken: token
        }});
    };
    
    const renderOption = (item: any, index: number) => (
        <AutocompleteItem
            key={index}
            title={item.title}
        />
    );

    return (
        <Layout style={{width:"85%"}}>
            <Autocomplete
                label={label}
                style={{width:"100%"}}
                placeholder='Location'
                accessoryRight={getLocation ? CurrentLocationIcon : undefined}
                value={value || ""}
                onSelect={onSelect}
                onChangeText={onChangeText}
                textStyle={{width:"100%"}}
                ref={ref}
                blurOnSubmit={false}
                {...rest}
            >
                {data?.getLocationSuggestions?.map(renderOption) || <AutocompleteItem key={0} title=""/>}
            </Autocomplete>
        </Layout>
    );
}

export default React.forwardRef(LocationInput);
