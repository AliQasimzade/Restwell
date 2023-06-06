import React from 'react';
import {StyleSheet} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

function Index(props) {
  const {style, enableRTL, ...rest} = props;
  const layoutStyle = enableRTL ? styles.styleRTL : {};
  return <Icon style={StyleSheet.flatten([style, layoutStyle])} {...rest} />;
}
export default Index