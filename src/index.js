import React, {Component} from 'react';
import {Provider, connect} from "react-redux"
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {reducers, middlewares} from "./store";
import Navigation from "./Navigation";

export default class AppContainer extends Component {

    componentWillMount(){
        let initialState = {};
        this.store = createStore(
            combineReducers({
                ...reducers
            }),
            initialState,
            applyMiddleware(...middlewares)
        );
    }
    render(){
        return <Provider store={this.store}>
                <Navigation />
        </Provider>
    }



}