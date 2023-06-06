import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import Text from '../Text';
import Icon from '../Icon'
 
import styles from './styles';
import {useTheme} from '@config';

function Index(props) {
  const {colors} = useTheme();
  const {style, image, title, subtitle, onPressMessenger, onPressPhone} = props;
  return (
    <View style={[styles.content, style]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={styles.icon} source={image} />
        <View style={{marginLeft: 8}}>
          <Text body1>{title}</Text>
          <Text footnote style={{marginTop: 4}}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={onPressMessenger}
          style={[
            styles.icon,
            {marginHorizontal: 16, backgroundColor: colors.primaryLight},
          ]}>
          <Icon name="facebook-messenger" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressPhone}
          style={[styles.icon, {backgroundColor: colors.primaryLight}]}>
          <Icon name="mobile-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Index