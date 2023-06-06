import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import Text from '../Text';

import styles from './styles';
 
function ProfileDescription(props) {
  const {style, image, styleThumb, onPress, name, subName, description} = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={{uri: image}} style={[styles.thumb, styleThumb]} />
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <Text headline semibold numberOfLines={1}>
          {name}
        </Text>
        <Text
          body2
          primaryColor
          style={{marginTop: 3, marginBottom: 3}}
          numberOfLines={1}>
          {subName}
        </Text>
        <Text footnote grayColor numberOfLines={2} style={{paddingRight: 20}}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}


export default ProfileDescription