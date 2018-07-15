import React from "react";
import {View} from "react-native";
import List from "./List";

export class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gridData: this.getGridFormatData(props)
        };
    }
    getGridFormatData(props) {
        const { data, noOfCardPerRow } = props;
        const _gridData = [];
        for (var i = 0; i < data.length / noOfCardPerRow; i++) {
            _gridData.push(data.slice(i * noOfCardPerRow, (i + 1) * noOfCardPerRow));
        }
        return _gridData;
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.data !== nextProps.data) || (this.props.noOfCardPerRow !== nextProps.noOfCardPerRow)) {
            this.setState({ gridData: this.getGridFormatData(nextProps) });
        }
    }

    render() {
        const { renderItem, gutter,noOfCardPerRow, ...rest } = this.props;
        let rowCount = 0;
        return (<List
                    {...rest}
                    data={this.state.gridData}
                    renderItem={({item}) => {
                        const resultRow = [];
                        for (var i = 0; i < noOfCardPerRow; i++) {
                            if (item[i]) {
                                resultRow.push(
                                    <View style={[{flex:1},i && {marginLeft:gutter}]} key={`${item[i].id || i+"__grid_card_row"}`}>
                                        {renderItem &&
                                        renderItem(item[i])}
                                    </View>
                                );
                            } else {
                                resultRow.push(<View style={[{flex:1,flexShrink:0},i && {marginLeft:gutter}]} />);
                            }
                        }
                        rowCount++;
                        return (
                            <View style={[{flexDirection:"row"},{marginTop:gutter}]}>
                                {resultRow}
                            </View>
                        );
                    }}
                />);
    }
}

Grid.defaultProps = {
    noOfCardPerRow: 2,
    gutter:10,
    data: []
};
export default Grid;
