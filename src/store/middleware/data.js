import {FETCH_DATA} from "../action/types";
import networkFetch from "../network";

export default function (store) {
    return function (next) {
        return function (action) {
            switch (action.type) {
                case FETCH_DATA: {
                    const {append,onSuccess} = action.payload;
                        next({
                            ...action,
                            payload: {...action.payload, showLoading: true,showFooterLoading:append}
                        });
                    return networkFetch({
                        ...action.payload

                    }).then(_ => {
                        // console.log("fetched data",_);
                        const data = _.data;
                        if(onSuccess && typeof onSuccess === "function"){
                            onSuccess(data);
                        }
                        return next({
                            ...action,
                            payload: {...action.payload, data, showLoading:false,showFooterLoading:false}
                        });

                    }).catch(e => {
                        next({
                            ...action,
                            payload: {...action.payload,showLoading:false,showFooterLoading:false}
                        });
                        console.log("error in fetch data", e);
                    });


                    break;
                }

                default :
                    return next(action)
            }
        }
    }
};



