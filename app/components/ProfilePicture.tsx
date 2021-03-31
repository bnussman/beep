import React, { Component } from "react";
import { View, Image } from "react-native";
import { LoadingIndicator } from "../utils/Icons";

interface Props {
    url: string;
    size: number;
    style?: any;
}

interface State {
    isLoading: boolean;
    isError: boolean;
}

export default class ProfilePicture extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false
        };
    }

    render() {
        if (this.state.isError) {
            return null;
        }

        return (
            <>
                <Image
                    style={{...this.props.style, width: (this.state.isLoading ? 1 : this.props.size), height: (this.state.isLoading ? 1 : this.props.size), borderRadius: this.props.size/ 2 }}
                    source={{uri: this.props.url}}
                    onLoadEnd={() => this.setState({ isLoading: false })}
                    onError={(error) => {
                        console.error(error)
                        this.setState({ isError: true });
                    }}
                />
                {this.state.isLoading &&
                <View style={{width: this.props.size, height: this.props.size, alignItems: "center", justifyContent: "center"}}>
                    <LoadingIndicator/>
                </View>
                }
            </>
        );
    }
}
