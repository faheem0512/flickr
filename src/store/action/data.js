import {INIT_DATA,FETCH_DATA,REMOVE_DATA} from "./types"

const initData = payload => ({
    type:INIT_DATA,
    payload
});

const fetchData = payload => ({
    type:FETCH_DATA,
    payload
});


const removeData = payload => ({
    type:REMOVE_DATA,
    payload
});




module.exports = {
    initData,
    fetchData,
    removeData
};
