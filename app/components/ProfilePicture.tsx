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
    }

    render() {
        return (
                <Image
                    style={{...this.props.style, width: this.props.size, height: this.props.size, borderRadius: this.props.size / 2 }}
                    source={{uri: this.props.url}}
                />
        );
    }
}
