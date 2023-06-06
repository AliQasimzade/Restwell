import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import Image from '../../components/Image';
import Icon from '../../components/Icon';
import Text from '../../components/Text';

import styles from './styles';
 
import {BaseColor, useTheme} from '@config';

function ProfileDetail(props) {
  const {colors} = useTheme();
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    textFirst,
    textSecond,
    textThird,
    icon,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.contentLeft, styleLeft]}>
        <View>
          <Image source={{uri: image}} style={[styles.thumb, styleThumb]} />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text header semibold numberOfLines={1} style={{textAlign: 'center'}}>
            {textFirst} {textSecond}
          </Text>
          <Text title3 grayColor numberOfLines={1} style={{textAlign: 'center'}}>
            {textThird}
          </Text>
        </View>
      </View>
      {icon && (
        <View style={[styles.contentRight, styleRight]}>
          <Icon
            name="angle-right"
            size={18}
            color={BaseColor.grayColor}
            enableRTL={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}


export default ProfileDetail