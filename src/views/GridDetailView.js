import React from "react";
import {View, Text,WebView} from "react-native";

export default class GridDetailView extends React.Component {
    render() {
        const uri = this.props.navigation.getParam("uri");
        const html = `<html><body style="display: flex;justify-content: center;align-items: center;"><img src="${uri}" alt="NA" style="width: 100%"></body></html>`;
        return <WebView
            source={{html}}
        />
    }
}