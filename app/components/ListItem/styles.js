import {StyleSheet} from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  //block css
  blockImage: {
    height: Utils.scaleWithPixel(300),
    width: '100%',
  },
  tagStatus: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  iconLike: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  blockContentRate: {
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
  blockLineMap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  blockLinePhone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  //list css
  listImage: {
    height: Utils.scaleWithPixel(140),
    width: Utils.scaleWithPixel(120),
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  listContent: {
    flexDirection: 'row',
  },
  listContentRight: {paddingLeft: 10, paddingVertical: 5, flex: 1},
  lineRate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  listTagStatus: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  iconListLike: {
    position: 'absolute',
    bottom: 5,
    right: 0,
  },
  //gird css
  girdImage: {
    borderRadius: 8,
    height: Utils.scaleWithPixel(120),
    width: '100%',
  },
  girdContent: {
    flex: 1,
  },
  tagGirdStatus: {
    position: 'absolute',
    top: 5,
    left: 5,
    width:'25%',
    height:35,
  },
  iconGirdLike: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding:15
  },
  contain: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 8,
    marginRight: 15,
  },
  smallContentRate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  smallImage: {
    width: Utils.scaleWithPixel(270),
    height: Utils.scaleWithPixel(210),
    borderRadius: 8,
    marginBottom: 10,
  },
  moreButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});
