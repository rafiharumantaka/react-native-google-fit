/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {Text, View, ScrollView, Button, StyleSheet, Dimensions} from 'react-native';

import GoogleFit, {Scopes, BucketUnit} from 'react-native-google-fit';

const App: () => Node = () => {
  var [myText, setMyText] = useState('Click the above button');
  var [myHeight, setMyHeight] = useState(0);
  var [myWeight, setMyWeight] = useState(0);
  var [myStep, setMyStep] = useState(0);

  const checkGoogleFit = () => {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          setMyText('Auth Success');
        } else {
          console.log('AUTH_DENIED', authResult.message);
          setMyText('Auth Denied');
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  };

  const getHeight = () => {
    const opt = {
      startDate: '2017-01-01T00:00:17.971Z',
      endDate: new Date().toISOString(),
    };

    GoogleFit.getHeightSamples(opt).then(res => {
      console.log(res[0].value);
      setMyHeight(res[0].value * 100);
    });
  };

  const getWeight = () => {
    const opt = {
      unit: 'kg',
      startDate: '2017-01-01T00:00:17.971Z',
      endDate: new Date().toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1,
      ascending: false,
    };

    GoogleFit.getWeightSamples(opt).then(res => {
      console.log(res[0].value);
      setMyWeight(res[0].value);
    });
  };

  const getStep = () => {
    const opt = {
      startDate: '2017-01-01T00:00:17.971Z',
      endDate: new Date().toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1,
    };

    GoogleFit.getDailyStepCountSamples(opt)
      .then(res => {
        var totalSteps = 0;
        console.log(res[1].steps);
        res[1].steps.forEach(val => {
          totalSteps += val.value;
        });
        console.log('Daily steps >>> ', totalSteps);
        setMyStep(totalSteps);
      })
      .catch(err => {
        console.warn(err);
      });
  };

  const disconnect = () => {
    GoogleFit.disconnect();
    setMyText("Auth removed, Click the above button")
  };

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.btnContainer}>
          
          <Button
            onPress={checkGoogleFit}
            title="Check Google Fit Connection"
            color="#841584"
          />
          <Text style={{padding: 75}}>{myText}</Text>
          <Button onPress={getHeight} title="Get height" color="#841584" />
          <Text style={{padding: 20}}>{'Your height: ' + myHeight + ' cm'}</Text>
          <Button onPress={getWeight} title="Get weight" color="#841584" />
          <Text style={{padding: 20}}>{'Your weight: ' + myWeight + ' kg'}</Text>
          <Button onPress={getStep} title="Get step" color="#841584" />
          <Text style={{padding: 20}}>{'Your step: ' + myStep + ' steps'}</Text>
          <Button onPress={disconnect} title="Remove Authorization" color="#841584" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    padding: 16,
    backgroundColor: 'black',
    innerWidth: Dimensions.get("window").width,
    innerHeight: Dimensions.get("window").height,
  }
});

export default App;
