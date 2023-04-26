import {BaseColor} from '@config';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {flexDirection: 'row'},
  contentLeft: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumb: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginRight: 10,
  },
  contentRight: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  point: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 9,
    bottom: 0,
  },
});
