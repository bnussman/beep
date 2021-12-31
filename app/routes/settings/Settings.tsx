import React, { useContext } from "react";
import * as Location from "expo-location";
import { StyleSheet } from "react-native";
import { Layout, Button, Card, Text } from "@ui-kitten/components";
import { ThemeContext } from "../../utils/ThemeContext";
import { UserContext } from "../../utils/UserContext";
import {
  LogIcon,
  ThemeIcon,
  LogoutIcon,
  ProfileIcon,
  PasswordIcon,
  ForwardIcon,
} from "../../utils/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResendButton from "../../components/ResendVarificationEmailButton";
import { gql, useMutation } from "@apollo/client";
import { LogoutMutation } from "../../generated/graphql";
import { client } from "../../utils/Apollo";
import { GetUserData } from "../../utils/UserQueries";
import { LOCATION_TRACKING } from "../beep/StartBeeping";
import { UserHeader } from "../../components/UserHeader";
import { Navigation } from "../../utils/Navigation";

const Logout = gql`
  mutation Logout {
    logout(isApp: true)
  }
`;

interface Props {
  navigation: Navigation;
}

export function MainSettingsScreen(props: Props): JSX.Element {
  const { navigation } = props;
  const themeContext = useContext(ThemeContext);
  const user = useContext(UserContext);
  const [logout, { loading }] = useMutation<LogoutMutation>(Logout);

  async function doLogout() {
    await logout({
      variables: {
        isApp: true,
      },
    });

    AsyncStorage.clear();

    if (!__DEV__) {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }

    await navigation.reset(
      {
        index: 0,
        routes: [{ name: "Login" }],
        key: null,
      },
      () => {
        client.writeQuery({
          query: GetUserData,
          data: {
            getUser: null,
          },
        });
      }
    );
  }

  return (
    <Layout style={styles.wrapper}>
      <Layout style={styles.container}>
        <Card
          style={{ width: "80%", marginBottom: 20 }}
          onPress={() => navigation.navigate("Profile", { id: user.id })}
        >
          <UserHeader user={user} />
        </Card>
        {!user.isEmailVerified && (
          <Card status="danger" style={{ maxWidth: 400, marginBottom: 6 }}>
            <Text category="h6">Your email is not verified!</Text>
          </Card>
        )}
        {!user.isEmailVerified && <ResendButton />}
        <Button
          onPress={themeContext?.toggleTheme}
          accessoryLeft={ThemeIcon}
          style={styles.button}
          appearance="ghost"
        >
          {themeContext?.theme == "light" ? "Dark Mode" : "Light Mode"}
        </Button>
        <Button
          onPress={() => navigation.navigate("EditProfileScreen")}
          accessoryLeft={ProfileIcon}
          accessoryRight={ForwardIcon}
          style={styles.button}
          appearance="ghost"
        >
          Edit Profile
        </Button>
        <Button
          onPress={() => navigation.navigate("ChangePasswordScreen")}
          accessoryLeft={PasswordIcon}
          accessoryRight={ForwardIcon}
          style={styles.button}
          appearance="ghost"
        >
          Change Password
        </Button>
        <Button
          onPress={() => navigation.navigate("BeepsScreen")}
          accessoryLeft={LogIcon}
          accessoryRight={ForwardIcon}
          style={styles.button}
          appearance="ghost"
        >
          Ride Log
        </Button>
        <Button
          onPress={() => navigation.navigate("RatingsScreen")}
          accessoryLeft={LogIcon}
          accessoryRight={ForwardIcon}
          style={styles.button}
          appearance="ghost"
        >
          Ratings
        </Button>
        <Button
          onPress={() => doLogout()}
          accessoryLeft={LogoutIcon}
          style={styles.button}
          appearance="ghost"
        >
          {loading ? "Logging you out..." : "Logout"}
        </Button>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "35%",
    marginTop: 20,
  },
  container: {
    flex: 1,
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  button: {
    marginBottom: 10,
  },
});
