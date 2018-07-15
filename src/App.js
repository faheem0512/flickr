import React, {Component} from 'react';
import {TextInput, StyleSheet, Image, View,TouchableOpacity,ActivityIndicator} from 'react-native';
import {SearchIcon} from "./assets";
import {fetchData,removeData} from "./store/action";
import {connect} from "react-redux";
import uuid from "uuid";



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {inputValue: ""};
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
    }
    onChangeText(inputValue){
        this.setState({inputValue})
    }

    onSubmitEditing(){
        const {inputValue} = this.state;
        const {fetchData,uniqueId,navigation} = this.props;
        if(!inputValue){
            alert("enter text to search");
            return;
        }
        fetchData({
            uniqueId,
            uri:"/services/rest/",
            params:{
                method:"flickr.photos.search",
                api_key:"3e7cc266ae2b0e0d78e279ce8e361736",
                format:"json",
                nojsoncallback:"1",
                safe_search:"1",
                text:inputValue
            },
            onSuccess:data=>{
                navigation.push("GridView",{data,inputValue});
            }
        });
    }
    componentWillUnmount(){
        const {removeData,uniqueId} = this.props;
        removeData({
            uniqueId
        });
    }

    render() {
        const {inputValue} = this.state;
        const {dataProps={}} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputValue}
                        placeholder={"Search Images"}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitEditing}
                    />
                    <TouchableOpacity style={styles.serIconContainer} onPress={this.onSubmitEditing}>
                        <Image source={SearchIcon} style={styles.searchIcon}/>
                    </TouchableOpacity>
                </View>
                {dataProps.showLoading && <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        size={"large"}
                        color={"green"}
                    />
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    input: {
        flex:1,
        borderBottomWidth: 1,
    },
    innerContainer: {
        flexDirection:"row",
        paddingHorizontal:20,
    },
    serIconContainer:{
        marginLeft:10,
        justifyContent:"center"
    },
    searchIcon: {
        height: 20,
        width: 20
    },
    loaderContainer:{
        position:"absolute",
        top:0,
        right:0,
        bottom:0,
        left:0,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'rgba(0,0,0,0.4)'
    }
});


App = connect((state,ownProps)=>{
    let mapStateToProps = {};
    if (state.data && state.data[ownProps.uniqueId]) {
        mapStateToProps.dataProps = state.data[ownProps.uniqueId];
    }
    return mapStateToProps;
},{
    fetchData,
    removeData
})(App);

export default class AppWrapper extends Component {
    componentWillMount(){
        this.uniqueId = uuid.v4();
    }
    render(){
        return <App uniqueId={this.uniqueId} {...this.props} />
    }
}