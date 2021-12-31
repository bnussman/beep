import React, { Component } from "react";
import { Alert } from "react-native";
import { QueueEntry } from "../generated/graphql";
import { isMobile } from "../utils/config";
import { client } from "../utils/Apollo";
import { gql } from "@apollo/client";
import { Button } from "native-base";

interface Props {
  item: QueueEntry;
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
        return "I'm done beeping this rider";
      default:
        return "Yikes";
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
    try {
      await client.mutate({
        mutation: UpdateBeeperQueue,
        variables: {
          queueId: id,
          riderId: riderId,
          value: value,
        },
      });
    } catch (error) {
      alert(error);
    }
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
          isLoading={props.isLoading}
          colorScheme="blue"
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
        <ActionButton isLoading={this.state.isActionLoading} />
        <CancelButton isLoading={this.state.isCancelLoading} />
      </>
    );
  }
}

export default React.memo(ActionButton);
