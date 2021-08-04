import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, Spinner } from '@ui-kitten/components';

export const ThemeIcon = (props) => (
  <Icon {...props} name='color-palette'/>
);

export const LogoutIcon = (props) => (
  <Icon {...props} name='log-out'/>
);

export const ProfileIcon = (props) => (
  <Icon {...props} name='person'/>
);

export const PasswordIcon = (props) => (
  <Icon {...props} name='lock'/>
);

export const ForwardIcon = (props) => (
  <Icon {...props} name='arrow-ios-forward'/>
);

export const PhoneIcon = (props) => (
  <Icon {...props} name='phone-call-outline'/>
);

export const TextIcon = (props) => (
  <Icon {...props} name='message-square-outline'/>
);

export const VenmoIcon = (props) => (
  <Icon {...props} name='credit-card-outline'/>
);

export const LeaveIcon = (props) => (
  <Icon {...props} name='person-remove-outline'/>
);

export const BackIcon = (props) => (
  <Icon {...props} name='arrow-back-outline'/>
);

export const GetIcon = (props) => (
  <Icon {...props} name='person-done-outline'/>
);

export const FindIcon = (props) => (
  <Icon {...props} name='search'/>
);

export const AcceptIcon = (props) => (
  <Icon {...props} name='checkmark-circle-outline'/>
);

export const DenyIcon = (props) => (
  <Icon {...props} name='close-circle-outline'/>
);

export const MapIcon = (props) => (
  <Icon {...props} name='map'/>
);

export const MapsIcon = (props) => (
  <Icon {...props} name='map-outline'/>
);

export const CarIcon = (props) => (
  <Icon {...props} name='car-outline'/>
);

export const SettingsIcon = (props) => (
  <Icon {...props} name='settings'/>
);

export const DollarIcon = (props) => (
  <Text>$</Text>
);

export const ShareIcon = (props) => (
  <Icon {...props} name='share-outline'/>
);

export const EditIcon = (props) => (
  <Icon {...props} name='edit-outline'/>
);

export const RefreshIcon = (props) => (
  <Icon {...props} name='refresh-outline'/>
);

export const LoginIcon = (props) => (
  <Icon {...props} name='log-in-outline'/>
);

export const SignUpIcon = (props) => (
  <Icon {...props} name='person-add-outline'/>
);

export const QuestionIcon = (props) => (
  <Icon {...props} name='question-mark-outline'/>
);

export const EmailIcon = (props) => (
  <Icon {...props} name='email-outline'/>
);

export const LogIcon = (props) => (
  <Icon {...props} name='file-text-outline'/>
);

export const ReportIcon = (props) => (
  <Icon {...props} name='alert-triangle-outline'/>
);

export const RateIcon = (props) => (
  <Icon {...props} name='star-outline'/>
);

export const AcceptIndicator = () => (
  <View style={styles.indicator}>
    <Spinner status="success" size='small'/>
  </View>
);

export const DenyIndicator = () => (
  <View style={styles.indicator}>
    <Spinner status="danger" size='small'/>
  </View>
);

export const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size='small'/>
  </View>
);

export const UserIcon = (props) => (
  <Icon {...props} name='person' />
);

export const PhotoIcon = (props) => (
    <Icon {...props} name='camera-outline'/>
);

export const StarIcon = (props) => (
    <Icon {...props} name='star'/>
);

const styles = StyleSheet.create({
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
