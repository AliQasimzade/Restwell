import React from 'react';
import {View} from 'react-native';
import Text from '../Text';
import styles from './styles';
 
import {useTranslation} from 'react-i18next';

function ProfilePerformance(props) {
  const {t} = useTranslation();
  const renderValue = (type, value) => {
    switch (type) {
      case 'primary':
        return (
          <Text title3 semibold primaryColor>
            {value}
          </Text>
        );
      case 'small':
        return (
          <Text body1 semibold>
            {value}
          </Text>
        );
      default:
        return (
          <Text headline semibold>
            {value}
          </Text>
        );
    }
  };

  const renderTitle = (type, value) => {
    switch (type) {
      case 'primary':
        return (
          <Text body2 grayColor>
            {t(value)}
          </Text>
        );
      case 'small':
        return (
          <Text caption1 grayColor>
            {t(value)}
          </Text>
        );
      default:
        return (
          <Text body2 grayColor>
            {t(value)}
          </Text>
        );
    }
  };

  const {
    style,
    contentLeft,
    contentCenter,
    contentRight,
    data,
    type,
    flexDirection,
  } = props;

  switch (flexDirection) {
    case 'row':
      return (
        <View style={[styles.contain, style]}>
          {data.map((item, index) => {
            if (index == 0) {
              return (
                <View style={[styles.contentLeft, contentLeft]} key={index}>
                  {renderValue(type, item.value)}
                  {renderTitle(type, item.title)}
                </View>
              );
            } else if (index == data.length - 1) {
              return (
                <View style={[styles.contentRight, contentRight]} key={index}>
                  {renderValue(type, item.value)}
                  {renderTitle(type, item.title)}
                </View>
              );
            } else {
              return (
                <View style={[styles.contentCenter, contentCenter]} key={index}>
                  {renderValue(type, item.value)}
                  {renderTitle(type, item.title)}
                </View>
              );
            }
          })}
        </View>
      );
    case 'column':
      return (
        <View style={[{justifyContent: 'space-between', flex: 1}, style]}>
          {data.map((item, index) => (
            <View style={styles.itemInfor} key={`ProfilePerformance ${index}`}>
              {renderTitle(type, item.title)}
              {renderValue(type, item.value)}
            </View>
          ))}
        </View>
      );
  }
}

export default ProfilePerformance