import React, { Component } from "react";
import { Alert } from "react-native";
import { GetInitialQueueQuery } from "../generated/graphql";
import { isMobile, Unpacked } from "../utils/config";
import { client } from "../utils/Apollo";
import { ApolloError, gql } from "@apollo/client";
import { Button } from "native-base";

interface Props {
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
  index: number;
}

interface State {
  isActionLoading: boolean;
  isCancelLoading: boolean;
}

const UpdateBeeperQueue = gql`
  mutation UpdateBeeperQueue(
    $queueId: String!
    $riderId: String!
    $value: String!
  ) {
    setBeeperQueue(
      input: { queueId: $queueId, riderId: $riderId, value: $value }
    )
  }
`;

const CancelBeep = gql`
  mutation CancelBeep($id: String!) {
    cancelBeep(id: $id)
  }
`;

class ActionButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isActionLoading: false,
      isCancelLoading: false,
    };
  }

  getMessage(): string {
    switch (this.props.item.state) {
      case 0:
        return "I'm on the way";
      case 1:
        return "I'm here";
      case 2:
        return "I'm now beeping this rider";
      case 3:
        return "Done beeping this rider";
      default:
        return "Yikes";
    }
  }

  getColor(): string | undefined {
    switch (this.props.item.state) {
      case 3:
        return "green";
      default:
        return "blue";
    }
  }

  cancelBeepWrapper(id: string) {
    if (isMobile) {
      Alert.alert(
        "Cancel Beep?",
        "Are you sure you want to cancel this beep?",
        [
          {
            text: "No",
            onPress: () => {
              this.setState({
                isCancelLoading: false,
              });
            },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () =>
              client.mutate({ mutation: CancelBeep, variables: { id } }),
          },
        ],
        { cancelable: true }
      );
    } else {
      client.mutate({ mutation: CancelBeep, variables: { id } });
    }
  }

  async updateStatus(
    id: string,
    riderId: string,
    value: string | boolean
  ): Promise<void> {
    client
      .mutate({
        mutation: UpdateBeeperQueue,
        variables: {
          queueId: id,
          riderId: riderId,
          value: value,
        },
      })
      .catch((error: ApolloError) => alert(error.message));
  }

  cancel(): void {
    this.setState({
      isCancelLoading: true,
    });
    this.cancelBeepWrapper(this.props.item.id);
  }

  update(): void {
    this.setState({
      isActionLoading: true,
    });
    this.updateStatus(
      this.props.item.id,
      this.props.item.rider.id,
      this.props.item.state < 3 ? "next" : "complete"
    );
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      isActionLoading: false,
      isCancelLoading: false,
    });
  }

  render() {
    const CancelButton = (props: { isLoading: boolean }) => {
      return (
        <Button
          mb={2}
          size="xs"
          isLoading={props.isLoading}
          colorScheme="red"
          onPress={() => this.cancel()}
        >
          Cancel Beep
        </Button>
      );
    };

    const ActionButton = (props: { isLoading: boolean }) => {
      return (
        <Button
          size="lg"
          h={50}
          isLoading={props.isLoading}
          colorScheme={this.getColor()}
          onPress={() => this.update()}
        >
          {this.getMessage()}
        </Button>
      );
    };

    if (this.props.index != 0) {
      return <CancelButton isLoading={this.state.isCancelLoading} />;
    }

    return (
      <>
        {this.props.item.state < 2 ? (
          <CancelButton isLoading={this.state.isCancelLoading} />
        ) : null}
        <ActionButton isLoading={this.state.isActionLoading} />
      </>
    );
  }
}

export default React.memo(ActionButton);
