import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";
export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
    }

    renderItem(row) {
        return this.props.renderItem(row);
    }
    _keyExtractor = (item, index) => {
        return Array.isArray(item) ? index + "__flat_list" :(item.id || item.key || index + "__flat_list");
    };

    render() {
        const {
            onScroll,
            data,
            loadMoreData,
            style
        } = this.props;
        return (<FlatList
                    onEndReached={_ => {
                        loadMoreData && loadMoreData(data);
                    }}
                    onEndReachedThreshold={100}
                    onScroll={onScroll}
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    style={{flex:1,...style}}
                />);
    }
}

List.propTypes = {
    data: PropTypes.array.isRequired,
    renderItem:PropTypes.func.isRequired
};

List.defaultProps = {
};
