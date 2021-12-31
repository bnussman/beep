import React from "react";
import ProfilePicture from "../../components/ProfilePicture";
import { UserContext } from "../../utils/UserContext";
import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { GetUserProfileQuery, User } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { Spinner, Text, Button, Avatar } from "native-base";
import { LocalWrapper } from "../../components/Container";

interface Props {
  route: any;
  navigation: Navigation;
}

const GetUser = gql`
  query GetUserProfile($id: String!) {
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
  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: props.route.params.id },
    fetchPolicy: "no-cache",
  });

  function handleReport() {
    props.navigation.navigate("Report", {
      id: props.route.params.id,
      name: data?.getUser.name || "",
      beep: props.route.params.beep,
    });
  }

  function handleRate() {
    if (props.route.params.beep) {
      props.navigation.navigate("Rate", {
        user: data?.getUser as User,
        beep: props.route.params.beep,
      });
    } else {
      alert(
        "You can only leave a rating when you've interacted with this user."
      );
    }
  }

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !data?.getUser) {
    return <Text>User not found</Text>;
  }

  return (
    <LocalWrapper>
      <Avatar
        size={150}
        source={{
          uri: data.getUser.photoUrl ? data.getUser.photoUrl : undefined,
        }}
      />
      <Text>{data.getUser.name}</Text>
      {props.route.params.id !== user.id ? (
        <>
          <Button onPress={() => handleReport()}>Report User</Button>
          <Button onPress={() => handleRate()}>Rate User</Button>
        </>
      ) : null}
      {data.getUser.isBeeping ? (
        <>
          <Text>Queue Size</Text>
          <Text>{data.getUser.queueSize}</Text>
        </>
      ) : null}
      {data?.getUser.venmo ? (
        <>
          <Text>Venmo</Text>
          <Text>@{data.getUser.venmo}</Text>
        </>
      ) : null}
      {data?.getUser.cashapp ? (
        <>
          <Text>Cash App</Text>
          <Text>@{data.getUser.cashapp}</Text>
        </>
      ) : null}
      <Text>Capacity</Text>
      <Text>{data.getUser.capacity}</Text>
      <Text>Singles Rate</Text>
      <Text>${data.getUser.singlesRate}</Text>
      <Text>Group Rate</Text>
      <Text>${data.getUser.groupRate}</Text>
      {data.getUser.rating ? (
        <>
          <Text>Rating</Text>
          <Text>{printStars(data.getUser.rating)}</Text>
        </>
      ) : null}
    </LocalWrapper>
  );
}
