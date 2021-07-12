import React from "react";
import { StyleSheet } from "react-native"
import { Button, Spinner, Text, Layout, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { BackIcon, RateIcon, ReportIcon } from "../../utils/Icons";
import ProfilePicture from "../../components/ProfilePicture";
import { UserContext } from '../../utils/UserContext';
import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { GetUserProfileQuery, User } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";

interface Props {
  route: any;
  navigation: Navigation;
}

const GetUser = gql`
    query GetUserProfile ($id: String!) {
        getUser(id: $id) {
            id
            name
            username
            name
            isBeeping
            isStudent
            role
            venmo
            cashapp
            singlesRate
            groupRate
            capacity
            masksRequired
            photoUrl
            queueSize
            rating
        }
    }
`;

export function ProfileScreen(props: Props): JSX.Element {
  const user = useContext(UserContext);
  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, { variables: { id: props.route.params.id }, fetchPolicy: "no-cache" });

  function handleReport() {
    props.navigation.navigate("Report", {
      id: props.route.params.id,
      name: data?.getUser.name || '',
      beep: props.route.params.beep
    });
  }

  function handleRate() {
    if (props.route.params.beep) {
      props.navigation.navigate("Rate", {
        user: data!.getUser as User,
        beep: props.route.params.beep
      });
    }
    else {
      alert("You can only leave a rating when you've interacted with this user.");
    }
  }

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()} />
  );

  if (loading) {
    return (
      <>
        <TopNavigation title='User Profile' alignment='center' accessoryLeft={BackAction} />
        <Layout style={styles.spinnerContainer}>
          <Spinner size='large' />
        </Layout>
      </>
    );
  }

  if (error || !data?.getUser) {
    return (
      <>
        <TopNavigation title='User Profile' alignment='center' accessoryLeft={BackAction} />
        <Layout style={styles.container}>
          <Text appearance="hint">User not found</Text>
        </Layout>
      </>
    );
  }
  else {
    return (
      <>
        <TopNavigation title='User Profile' alignment='center' accessoryLeft={BackAction} />
        <Layout style={styles.container}>
          {data.getUser.photoUrl &&
            <ProfilePicture
              style={{ marginHorizontal: 8 }}
              size={150}
              url={data.getUser.photoUrl}
            />
          }
          <Text style={styles.item} category="h1">{data.getUser.name}</Text>

          <Layout style={styles.row}>
            {data.getUser.isBeeping && <Button size='tiny' status='primary' style={styles.tag}>Currently Beeping 🚗</Button>}
            {data.getUser.masksRequired && <Button status="info" size='tiny' style={styles.tag}>Masks Required</Button>}
            {data.getUser.role == "ADMIN" && <Button size='tiny' status='danger' style={styles.tag}>Founder</Button>}
            {data.getUser.isStudent && <Button status="basic" size='tiny' style={styles.tag}>Student</Button>}
          </Layout>

          {(props.route.params.id !== user.id) &&
            <Layout style={styles.row}>
              <Button
                onPress={() => handleReport()}
                accessoryRight={ReportIcon}
                appearance='ghost'
              >
                Report User
              </Button>
              <Button
                onPress={() => handleRate()}
                accessoryRight={RateIcon}
                appearance='ghost'
              >
                Rate User
              </Button>
            </Layout>
          }

          <Layout style={styles.data}>
            {data.getUser.isBeeping &&
              <Layout style={styles.group}>
                <Text category="h6" style={styles.groupLabel}>Queue Size</Text>
                <Text>{data.getUser.queueSize}</Text>
              </Layout>
            }

            {data.getUser.venmo &&
              <Layout style={styles.group}>
                <Text category="h6" style={styles.groupLabel}>Venmo</Text>
                <Text>@{data.getUser.venmo}</Text>
              </Layout>
            }

            {data.getUser.cashapp &&
              <Layout style={styles.group}>
                <Text category="h6" style={styles.groupLabel}>Cash App</Text>
                <Text>@{data.getUser.cashapp}</Text>
              </Layout>
            }

            <Layout style={styles.group}>
              <Text category="h6" style={styles.groupLabel}>Capacity</Text>
              <Text>{data.getUser.capacity}</Text>
            </Layout>

            <Layout style={styles.group}>
              <Text category="h6" style={styles.groupLabel}>Singles Rate</Text>
              <Text>${data.getUser.singlesRate}</Text>
            </Layout>

            <Layout style={styles.group}>
              <Text category="h6" style={styles.groupLabel}>Group Rate</Text>
              <Text>${data.getUser.groupRate}</Text>
            </Layout>
            {data.getUser.rating &&
              <Layout style={styles.group}>
                <Text category="h6" style={styles.groupLabel}>Rating</Text>
                <Text>{printStars(data.getUser.rating)}</Text>
              </Layout>
            }
          </Layout>
        </Layout>
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
