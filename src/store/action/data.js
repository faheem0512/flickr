import {FETCH_DATA,REMOVE_DATA} from "./types"

const fetchData = payload => ({
    type:FETCH_DATA,
    payload
});


const removeData = payload => ({
    type:REMOVE_DATA,
    payload
});


module.exports = {
    fetchData,
    removeData
};
