import React, {useState} from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Autocomplete, AutocompleteItem, Icon } from '@ui-kitten/components';
import * as Location from 'expo-location';

interface Props {
    getLocation: boolean;
}

const data = [
  { title: 'Star Wars' },
  { title: 'Back to the Future' },
  { title: 'The Matrix' },
  { title: 'Inception' },
  { title: 'Interstellar' },
]; 

export function LocationInput(props: Props) {
    const [value, setValue] = useState<string>("");
    const [locations, setLocations] = useState<any[]>(data);

    async function useCurrentLocation(): Promise<void> {
        setValue("Loading your location...");
       
        Location.setGoogleApiKey("AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI");

        const { status } = await Location.requestPermissionsAsync();

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

    const filter = (item: any, query: string) => item.title.toLowerCase().includes(query.toLowerCase());

    const onSelect = (index: number) => {
        setValue(data[index].title);
    };

    const onChangeText = (query: string) => {
        setValue(query);
        setLocations(data.filter(item => filter(item, query)));
    };

    
    const renderOption = (item: any, index: number) => (
        <AutocompleteItem
            key={index}
            title={item.title}
        />
    );

    return (
        <Autocomplete
            label='Pick-up Location'
            style={styles.input}
            placeholder='Pickup Location'
            accessoryRight={props.getLocation ? CurrentLocationIcon : undefined}
            value={value}
            onSelect={onSelect}
            onChangeText={onChangeText}
        >
            {locations.map(renderOption)}
        </Autocomplete>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 5,
        width: "100%"
    },
});
