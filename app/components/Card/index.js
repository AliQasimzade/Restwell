import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import Image from '../Image';
import { useTheme} from '@config';

function Card(props) {
  const {colors} = useTheme();
  const {style, children, styleContent, image, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={{uri: image}} style={styles.card} />
      <View style={[styles.content, styleContent]}>{children}</View>
    </TouchableOpacity>
  );
}

export default Card