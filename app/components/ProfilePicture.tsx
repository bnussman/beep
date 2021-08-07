import React, { PureComponent } from "react";
import { Image } from "react-native";
import logo from "../assets/userImage.png";

interface Props {
    url?: string | null;
    size: number;
    style?: any;
}

interface State {
    isLoading: boolean;
    isError: boolean;
}

export default class ProfilePicture extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Image
                style={{...this.props.style, width: this.props.size, height: this.props.size, borderRadius: this.props.size / 2 }}
                source={this.props.url ? { uri: this.props.url } : logo}
            />
        );
    }
}
