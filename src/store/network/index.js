import axios from "axios";
import {NETWORK_URL} from "../../Config";


const defaultHeader = {};

export default ({method = "get", headers = defaultHeader, url = NETWORK_URL, uri = "", params = {} }) => {

    return axios({
        method,
        url: url + uri,
        headers,
        [method === "post" ? "data" : "params"]: params
    }).then(result => {
        return result;
    }).catch(err => {
        console.log("error in network call ", err);
        throw err;

    });


}