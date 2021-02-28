import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, Spinner } from '@ui-kitten/components';

interface Props {

}

const ThemeIcon = (props: Props) => (
  <Icon {...props} name='color-palette'/>
);

const LogoutIcon = (props: Props) => (
  <Icon {...props} name='log-out'/>
);

const ProfileIcon = (props: Props) => (
  <Icon {...props} name='person'/>
);

const PasswordIcon = (props: Props) => (
  <Icon {...props} name='lock'/>
);

const ForwardIcon = (props: Props) => (
  <Icon {...props} name='arrow-ios-forward'/>
);

const PhoneIcon = (props: Props) => (
  <Icon {...props} name='phone-call-outline'/>
);

const TextIcon = (props: Props) => (
  <Icon {...props} name='message-square-outline'/>
);

const VenmoIcon = (props: Props) => (
  <Icon {...props} name='credit-card-outline'/>
);

const LeaveIcon = (props: Props) => (
  <Icon {...props} name='person-remove-outline'/>
);

const BackIcon = (props: Props) => (
  <Icon {...props} name='arrow-back-outline'/>
);

const GetIcon = (props: Props) => (
  <Icon {...props} name='person-done-outline'/>
);

const FindIcon = (props: Props) => (
  <Icon {...props} name='search'/>
);

const AcceptIcon = (props: Props) => (
  <Icon {...props} name='checkmark-circle-outline'/>
);

const DenyIcon = (props: Props) => (
  <Icon {...props} name='close-circle-outline'/>
);

const MapIcon = (props: Props) => (
  <Icon {...props} name='map'/>
);

const MapsIcon = (props: Props) => (
  <Icon {...props} name='map-outline'/>
);

const CarIcon = (props: Props) => (
  <Icon {...props} name='car-outline'/>
);

const SettingsIcon = (props: Props) => (
  <Icon {...props} name='settings'/>
);

const DollarIcon = () => (
  <Text>$</Text>
);

const ShareIcon = (props: Props) => (
  <Icon {...props} name='share-outline'/>
);

const EditIcon = (props: Props) => (
  <Icon {...props} name='edit-outline'/>
);

const RefreshIcon = (props: Props) => (
  <Icon {...props} name='refresh-outline'/>
);
const LoginIcon = (props: Props) => (
  <Icon {...props} name='log-in-outline'/>
);

const SignUpIcon = (props: Props) => (
  <Icon {...props} name='person-add-outline'/>
);

const QuestionIcon = (props: Props) => (
  <Icon {...props} name='question-mark-outline'/>
);

const EmailIcon = (props: Props) => (
  <Icon {...props} name='email-outline'/>
);

const LogIcon = (props: Props) => (
  <Icon {...props} name='file-text-outline'/>
);

const ReportIcon = (props: Props) => (
  <Icon {...props} name='alert-triangle-outline'/>
);

const AcceptIndicator = () => (
  <View style={styles.indicator}>
    <Spinner status="success" size='small'/>
  </View>
);

const DenyIndicator = () => (
  <View style={styles.indicator}>
    <Spinner status="danger" size='small'/>
  </View>
);

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size='small'/>
  </View>
);

const PhotoIcon = (props: Props) => (
    <Icon {...props} name='camera-outline'/>
);

const StudentIcon = () => (
    <Text>🎓</Text>
);

export {
    ThemeIcon,
    LogoutIcon,
    ProfileIcon,
    PasswordIcon,
    ForwardIcon,
    PhoneIcon, 
    TextIcon, 
    VenmoIcon,
    LeaveIcon,
    BackIcon,
    GetIcon,
    FindIcon,
    AcceptIcon,
    DenyIcon,
    MapIcon,
    DollarIcon,
    ShareIcon,
    EditIcon,
    RefreshIcon,
    LoginIcon,
    SignUpIcon,
    QuestionIcon,
    EmailIcon,
    AcceptIndicator,
    DenyIndicator,
    LoadingIndicator,
    LogIcon,
    ReportIcon,
    SettingsIcon,
    CarIcon,
    MapsIcon,
    PhotoIcon,
    StudentIcon
};

const styles = StyleSheet.create({
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
