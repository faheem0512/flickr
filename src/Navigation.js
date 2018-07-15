import {
    createStackNavigator
} from 'react-navigation';
import App from "./App";
import GridView from "./views/GridView";
import GridDetailView from "./views/GridDetailView";

const Navigation = createStackNavigator({
    Home: { screen: App },
    GridView: { screen: GridView},
    GridDetailView: { screen: GridDetailView }
},{
    initialRouteName:"Home",
    navigationOptions:{
        header:null
    }
});

export default Navigation;