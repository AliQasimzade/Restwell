import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Entypo';
import styles from './styles';

function SeeMoreIcon(props) {
  const {style, enableRTL, ...rest} = props;
  const layoutStyle = enableRTL ? styles.styleRTL : {};
  return <Icon style={StyleSheet.flatten([style, layoutStyle])} {...rest} />;
}

SeeMoreIcon.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enableRTL: PropTypes.bool,
};

SeeMoreIcon.defaultProps = {
  style: {},
  enableRTL: false,
};
export default SeeMoreIcon