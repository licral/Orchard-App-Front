import React, { Component } from 'react';
import styles from '../styles/style.js';
import {Table, Rows} from 'react-native-table-component';
import {
    AsyncStorage,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

var STORAGE_KEY = 'id-token';

var activityView = class ActivityView extends Component{
    constructor(){
        super();
        this.state = {
            retrieved: "",
            activityInfo: {}
        }
    }

    async getActivityInfo(){
        const {state} = this.props.navigation;
        try{
            var TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
            fetch('https://orchard-app-java-tomcat.herokuapp.com/get/activity/' + state.params.activity_id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': TOKEN
                }
            })
            .then((response) => {
                if(response.ok){
                    response.json().then((responseData) => {
                        this.setState({activityInfo: responseData});
                        this.setState({retrieved: "Done"});
                    });
                }
            })
            .done();
        } catch (error) {
            console.log("AsyncStorage error: " + error.message);
        }
    }

    processActivity(){
        var rawData = this.state.activityInfo;
        var activityInfo = [];
        Object.keys(rawData).map(function(i){
            activityInfo.push([i, rawData[i]]);
        });
        return activityInfo;
    }

    render () {
        if(this.state.retrieved === ""){
            this.getActivityInfo();
        }
        if(this.state.retrieved === ""){
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: 80}}
                    size="large"
                  />
            );
        } else {
            var activityInfo = this.processActivity();
            return (
                <View style={styles.pageContent}>
                    <Table
                        style={styles.table}
                        borderStyle={{borderWidth: 1, borderColor: '#e7e4e4'}}
                        >
                        <Rows data={activityInfo} textStyle={styles.rowText} />
                    </Table>
                </View>
            );
        }
    }
}

export default activityView;