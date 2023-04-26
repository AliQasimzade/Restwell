import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: BaseColor.grayColor,
  },
  thumb: {
    width: 400,
    height: 400,
    borderRadius: 50,
    marginBottom: 20,
  },
  editIconWrapper: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
  },
  
});
