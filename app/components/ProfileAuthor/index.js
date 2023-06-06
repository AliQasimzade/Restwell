import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import Text from '../Text';


import styles from './styles';
 

function ProfileAuthor(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    name,
    description,
    textRight,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.contentLeft, styleLeft]}>
        <Image source={image} style={[styles.thumb, styleThumb]} />
        <View>
          <Text headline semibold numberOfLines={1}>
            {name}
          </Text>
          <Text footnote grayColor numberOfLines={1}>
            {description}
          </Text>
        </View>
      </View>
      <View style={[styles.contentRight, styleRight]}>
        <Text caption2 grayColor numberOfLines={1}>
          {textRight}
        </Text>
      </View>
    </TouchableOpacity>
  );
}


export default ProfileAuthor