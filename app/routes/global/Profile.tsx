import React, { Component } from "react";
import { StyleSheet } from "react-native"
import { Button, Spinner, Text, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { BackIcon, ReportIcon } from "../../utils/Icons";
import { config } from "../../utils/config";
import ProfilePicture from "../../components/ProfilePicture";
import { handleFetchError } from "../../utils/Errors";
import { UserContext } from '../../utils/UserContext';

interface Props {
    route: any; 
    navigation: any;
}

interface State {
    isLoading: boolean;
    user: any;
}

export class ProfileScreen extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            user: {}
        };
    }

    async getUser() {
        try {
            const result = await fetch(config.apiUrl + "/users/" + this.props.route.params.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await result.json();

            this.setState({isLoading: false, user: data.user});
        }
        catch(error) {
            this.setState({isLoading: handleFetchError(error)});
        }
    }
    
    handleReport() {
        this.props.navigation.navigate("Report", {
            id: this.props.route.params.id,
            first: this.state.user.first,
            last: this.state.user.last,
            beepEventId: this.props.route.params.beepEventId
        });
    }
    
    componentDidMount() {
        this.getUser();
    }

    render () {
        const BackAction = () => (
            <TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
        );

        if (this.state.isLoading) {
            return (
                <>
                    <TopNavigation title='User Profile' alignment='center' accessoryLeft={BackAction}/>
                    <Layout style={styles.spinnerContainer}>            
                        <Spinner size='large' />
                    </Layout>
                </>
            );
        }
        else if (this.state.user?.first == null) {
            return (
                <>
                    <TopNavigation title='User Profile' alignment='center' accessoryLeft={BackAction}/>
                    <Layout style={styles.container}>            
                        <Text appearance="hint">User not found</Text>
                    </Layout>
                </>
            );
        }
        else {
            const user = this.state.user;

            return (
                <>
                    <TopNavigation title='User Profile' alignment='center' accessoryLeft={BackAction}/>
                    <Layout style={styles.container}>            
                        {user.photoUrl &&
                            <ProfilePicture
                                style={{marginHorizontal: 8}}
                                size={150}
                                url={user.photoUrl}
                            />
                        }
                        <Text style={styles.item} category="h1">{user.first} {user.last}</Text>

                        <Layout style={styles.row}>
                            {user.isBeeping && <Button size='tiny' status='primary' style={styles.tag}>Currently Beeping 🚗</Button>}
                            {user.masksRequired && <Button status="info" size='tiny' style={styles.tag}>Masks Required</Button>}
                            {user.userLevel > 0 && <Button size='tiny' status='danger' style={styles.tag}>Founder</Button>}
                            {user.isStudent && <Button status="basic" size='tiny' style={styles.tag}>Student</Button>}
                        </Layout>
                        
                        <Layout style={styles.data}>
                            {user.isBeeping && 
                                <Layout style={styles.group}>
                                    <Text category="h6" style={styles.groupLabel}>Queue Size</Text>
                                    <Text>{user.queueSize}</Text>
                                </Layout>
                            }

                            <Layout style={styles.group}>
                                <Text category="h6" style={styles.groupLabel}>Venmo</Text>
                                <Text>@{user.venmo}</Text>
                            </Layout>

                            <Layout style={styles.group}>
                                <Text category="h6" style={styles.groupLabel}>Capacity</Text>
                                <Text>{user.capacity}</Text>
                            </Layout>

                            <Layout style={styles.group}>
                                <Text category="h6" style={styles.groupLabel}>Singles Rate</Text>
                                <Text>${user.singlesRate}</Text>
                            </Layout>

                            <Layout style={styles.group}>
                                <Text category="h6" style={styles.groupLabel}>Group Rate</Text>
                                <Text>${user.groupRate}</Text>
                            </Layout>
                        </Layout>
                        {(this.props.route.params.id != this.context.user.id) &&
                            <Button onPress={() => this.handleReport()} accessoryRight={ReportIcon} style={styles.button}>Report User</Button>
                        }
                    </Layout>
                </>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1 ,
        alignItems: "center",
    },
    spinnerContainer: {
        height: '100%',
        width: '100%',
        alignItems: "center",
        justifyContent: 'center'
    },
    group: {
        flexDirection: "row",
        marginBottom: 6
    },
    groupLabel: {
        width: 150
    },
    data: {
        width: 250,
    },
    item: {
        marginBottom: 10
    },
    button: {
        width: "80%",
        marginTop: 20
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
        width: "80%",
        justifyContent: "center"
    },
    tag: {
        margin: 4 
    }
});
