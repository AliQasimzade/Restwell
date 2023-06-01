import React from 'react';
import {Image, View} from 'react-native';
import styles from './styles';
function Index(props) {
  const {style} = props;
  return (
    <View style={[styles.contaner, style]}>
      <Image {...props} style={styles.content} />
    </View>
  );
}
export default Index