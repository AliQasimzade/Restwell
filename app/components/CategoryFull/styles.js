import { StyleSheet } from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(115),
    borderRadius: 8,
  },
  contentIcon: {
    position: 'absolute',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placehoder: { width: '100%', height: '100%', borderRadius: 8 },
  contentTitle: { paddingLeft: 10 },

  gradient: {
    width: '100%',
    height: '100%',
    position:'absolute'
  }
});
