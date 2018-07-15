import React,{Component} from "react";
import {View, Text,TouchableOpacity,Image,ActivityIndicator} from "react-native";
import Grid from "../components/Grid";
import {connect} from "react-redux";
import {initData,fetchData,removeData} from "../store/action";
import uuid from "uuid";


class GridView extends Component {
    constructor(props){
        super(props);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onAppendData = this.onAppendData.bind(this);
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
        console.log("dataToReturn",dataToReturn);
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
        const {data={},showFooterLoading,error} = dataProps;
        const {photos} = data;
        if(error){
            return <Text>{error}</Text>;
        }
        if(!photos){
            return <View style={{justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator
                    size={"large"}
                    color={"blue"}
                />
            </View>
        }
        return <View style={{flex:1,padding:20}}>
            {showFooterLoading && <Text>Foooterr loading</Text>}
            <Grid
                style={{flex:1}}
                data={photos.photo}
                renderItem={(row={})=>{
                    const {farm,server,id,secret} = row;
                    const uri = `http://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg`;
                    return <TouchableOpacity
                        style={{flex:1,borderWidth:1,borderColor:"#7c55a8"}}
                        onPress={_=>this.onImageSelect(uri)}
                    >
                        <Image
                            resizeMode={"contain"}
                            style={{width: 50, height: 50}}
                            source={{uri}} />
                    </TouchableOpacity>;
                }}
                gutter={20}
                noOfCardPerRow={2}
                loadMoreData={this.loadMoreData}
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