import React from "react";
import {View, Text,TouchableOpacity,Image} from "react-native";
import Grid from "../components/Grid";

export default class GridView extends React.Component {
    constructor(props){
        super(props);
    }
    onImageSelect(uri){
        console.warn("uri in grid", uri);
        this.props.navigation.push("GridDetailView",{uri});
    }
    render() {
        const data = this.props.navigation.getParam("data");
        // console.log("Data",data);
        const {photos} = data;
        return <View style={{flex:1,padding:20}}>
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
            />
        </View>
    }
}