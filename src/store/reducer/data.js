import Types, {INIT_DATA} from "../action/types";

export default function (state = {}, action = {}) {
    switch (action.type){
        case Types.INIT_DATA:{
            const {uniqueId,data} = action.payload;
            return {
                ...state,
                [uniqueId]:{data}
            }
        }

        case Types.FETCH_DATA:{
            const {uniqueId,error,showLoading,append,showFooterLoading} = action.payload;
            var {data} = action.payload;
            let _currentState = state[uniqueId] || {};
            const oldData = _currentState.data;
            if(append && !data){
                /*as first next for loading make data undefined this handles scenario for that to retain old data*/
                data = oldData;
            }
            if(append && data && oldData){
                if(typeof append === "function"){
                    console.log(oldData,data);
                    data = append(oldData,data);
                } else {
                    if(Array.isArray(oldData)){
                        data = [...oldData, ...data];
                    } else {
                        const previousData = oldData[append];
                        data = {...data,[append]:{...previousData,...data[append]}};
                    }
                }
            }
            return {...state,
                [uniqueId]: {..._currentState, data, showLoading, showFooterLoading, error}
            };
        }
        case Types.REMOVE_DATA:{
            const {uniqueId} = action.payload;
            let newState = {...state};
            delete newState[uniqueId];
            return newState;
        }

        default:
            return state
    }
}


