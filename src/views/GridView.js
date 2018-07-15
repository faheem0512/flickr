import React,{Component} from "react";
import {View, Text,TouchableOpacity,Image,ActivityIndicator,Picker} from "react-native";
import Grid from "../components/Grid";
import {connect} from "react-redux";
import {initData,fetchData,removeData} from "../store/action";
import uuid from "uuid";



class GridItem extends Component {
    state = {};
    render(){
        const {row,onImageSelect} = this.props;
        const {imageWidth,imageHeight} = this.state;
        const {farm,server,id,secret} = row;
        const uri = `http://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg`;
        return <TouchableOpacity
            style={{flex:1,borderWidth:1,borderColor:"#7c55a8"}}
            onPress={_=>onImageSelect(uri)}
            onLayout={_=>{
                const {nativeEvent: {layout: {width}}} = _;
                this.setState({
                    imageWidth:width,
                    imageHeight:width
                });
            }}
        >
            <Image
                resizeMode={"cover"}
                style={{width: imageWidth, height: imageHeight}}
                source={{uri}} />
        </TouchableOpacity>;
    }
}


class GridView extends Component {
    constructor(props){
        super(props);
        this.state = {
            noOfCardPerRow:2
        };
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onAppendData = this.onAppendData.bind(this);
        this.onImageSelect = this.onImageSelect.bind(this);
    }
    componentWillMount() {
        const {navigation, initData,uniqueId} = this.props;
        const data = navigation.getParam("data");
        this.inputValue = navigation.getParam("inputValue");
        initData({uniqueId,data});
    }
    componentWillUnmount(){
        const {removeData,uniqueId} = this.props;
        removeData({
            uniqueId
        });
    }
    onAppendData(oldData,newData){
        const _mergedData = [...oldData["photos"]["photo"], ...newData["photos"]["photo"]];
        let dataToReturn = {...oldData, ...newData};
        dataToReturn["photos"]["photo"] = _mergedData;
        return dataToReturn;
    }
    loadMoreData(){
        const {fetchData,uniqueId,dataProps} = this.props;
        if(!dataProps || !dataProps.data){
            return;
        }
        const {data:{photos:{page,pages}}} = dataProps;
        if(page >= pages){
            return;
        }
        fetchData({
            uniqueId,
            append:this.onAppendData,
            uri:"/services/rest/",
            params:{
                method:"flickr.photos.search",
                api_key:"3e7cc266ae2b0e0d78e279ce8e361736",
                format:"json",
                nojsoncallback:"1",
                safe_search:"1",
                text:this.inputValue,
                page:page+1
            }
        });
    }

    onImageSelect(uri){
        this.props.navigation.push("GridDetailView",{uri});
    }
    render() {
        const {dataProps={}} = this.props;
        const {noOfCardPerRow} = this.state;
        const {data={},showFooterLoading,error} = dataProps;
        const {photos} = data;
        if(error){
            return <Text>{error}</Text>;
        }
        if(!photos){
            return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator
                    size={"large"}
                    color={"blue"}
                />
            </View>
        }
        return <View style={{flex:1,padding:20}}>
            <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                <Text>Number Of Columns : </Text>
                <Picker
                    selectedValue={noOfCardPerRow}
                    style={{ height: 20, width: 80 }}
                    onValueChange={(noOfCardPerRow) => this.setState({noOfCardPerRow})}>
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                </Picker>
            </View>
            <Grid
                style={{flex:1}}
                data={photos.photo}
                renderItem={(row={})=>{
                    return <GridItem row={row} onImageSelect={this.onImageSelect} />
                }}
                gutter={20}
                noOfCardPerRow={noOfCardPerRow}
                loadMoreData={this.loadMoreData}
                ListFooterComponent={_=>{
                    return showFooterLoading?<View style={{justifyContent:"center",alignItems:"center"}}>
                            <ActivityIndicator
                                size={"small"}
                                color={"blue"}
                            />
                        </View>:null;
                }}
            />
        </View>
    }
}

GridView = connect((state,ownProps) => {
    let mapStateToProps = {};
    if (state.data && state.data[ownProps.uniqueId]) {
        mapStateToProps.dataProps = state.data[ownProps.uniqueId];
    }
    return mapStateToProps;
},{
    initData,
    fetchData,
    removeData
})(GridView);

export default class GridViewWrapper extends Component {
    componentWillMount(){
        this.uniqueId = uuid.v4();
    }
    render(){
        return <GridView uniqueId={this.uniqueId} {...this.props} />
    }

}