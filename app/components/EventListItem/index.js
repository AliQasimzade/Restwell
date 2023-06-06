import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Image from '../Image';
import Text from '../Text';
import Icon from '../Icon';
import Tag from '../Tag'
import { BaseColor, useTheme } from '@config';
 
import styles from './styles';
import { useTranslation } from 'react-i18next';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
export default function ListItem(props) {

  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    loading,
    grid,
    block,
    small,
    favorite,
    style,
    image,
    title,
    subtitle,
    location,
    phone,
    rate,
    status,
    numReviews,
    enableAction,
    onPress,
    onPressTag,
    omPressMore,
    locationAddress,
    startDate,
    endDate,
  } = props;

  /**
   * Display place item as block
   */
  const renderBlock = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={style}>
            <PlaceholderMedia style={styles.blockImage} />
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}>
              <PlaceholderLine style={{ width: '50%' }} />
              <PlaceholderLine style={{ width: '80%' }} />
              <View style={styles.blockLineMap}>
                <PlaceholderLine style={{ width: '25%' }} />
              </View>
              <View style={styles.blockLinePhone}>
                <PlaceholderLine style={{ width: '50%' }} />
              </View>
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress}>
          <Image source={{ uri: image }} style={styles.blockImage} />
          <Tag status style={styles.tagStatus}>
            {t(status)}
          </Tag>
          {favorite ? (
            <Icon
              solid
              name="heart"
              color={BaseColor.whiteColor}
              size={18}
              style={styles.iconLike}
            />
          ) : (
            <Icon
              name="heart"
              color={BaseColor.whiteColor}
              size={18}
              style={styles.iconLike}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          <Text headline semibold grayColor>
            {subtitle}
          </Text>
          <Text title2 semibold style={{ marginTop: 4 }} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.blockLineMap}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {location}
            </Text>
          </View>
          <View style={styles.blockLinePhone}>
            <Icon name="phone" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {phone}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Display place item as list
   */
  const renderList = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={[styles.listContent, style]}>
            <PlaceholderMedia style={styles.listImage} />
            <View style={styles.listContentRight}>
              <PlaceholderLine style={{ width: '50%' }} />
              <PlaceholderLine style={{ width: '70%' }} />
              <View style={styles.lineRate}>
                <PlaceholderLine style={{ width: '20%' }} />
              </View>
              <PlaceholderLine style={{ width: '50%' }} />
              <PlaceholderLine style={{ width: '50%' }} />
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <TouchableOpacity style={[styles.listContent, style]} onPress={onPress}>
        <View onPress={onPress}>
          <Image source={{ uri: image }} style={styles.listImage} />
          <Tag status style={styles.listTagStatus}>
            {t(status)}
          </Tag>
        </View>
        <View style={styles.listContentRight}>
          <Text headline semibold grayColor numberOfLines={1}>
            {subtitle}
          </Text>
          <Text title2 semibold style={{ marginTop: 5 }} numberOfLines={1}>
            {title}
          </Text>
          <Text caption1 grayColor style={{ marginTop: 10 }}>
            {location}
          </Text>
          <Text caption1 grayColor style={{ marginTop: 5 }}>
            {phone}
          </Text>
          
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Display place item as grid
   */
  const renderGrid = () => {
    if (loading) {
      return (
        <View style={[styles.girdContent, style]}>
          <Placeholder Animation={Progressive}>
            <View style={[styles.girdContent, style]}>
              <PlaceholderMedia style={styles.girdImage} />
              <PlaceholderLine style={{ width: '30%', marginTop: 8 }} />
              <PlaceholderLine style={{ width: '50%' }} />
              <View>
                <PlaceholderLine style={{ width: '20%' }} />
              </View>
              <PlaceholderLine style={{ width: '30%' }} />
            </View>
          </Placeholder>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[styles.girdContent, style]} onPress={onPress}>
        <View>
          <Image source={{ uri: image }} style={styles.girdImage} />
          <Tag status style={styles.tagGirdStatus}>
            {t(status)}
          </Tag>
          {favorite ? (
            <Icon
              name="heart"
              color={colors.primaryLight}
              solid
              size={18}
              style={styles.iconGirdLike}
            />
          ) : (
            <Icon
              name="heart"
              color={colors.primaryLight}
              size={18}
              style={styles.iconGirdLike}
            />
          )}
        </View>
        <Text
          footnote
          semibold
          grayColor
          style={{ marginTop: 5 }}
          numberOfLines={1}>
          {subtitle}
        </Text>
        <Text subhead semibold style={{ marginTop: 5 }} numberOfLines={1}>
          {title}
        </Text>
       
        <Text caption2 grayColor style={{ marginTop: 10 }} numberOfLines={1}>
          {location}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSmall = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={[styles.contain, style]}>
            <PlaceholderMedia style={styles.smallImage} />
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'center',
                flex: 1,
              }}>
              <PlaceholderLine style={{ width: '80%' }} />
              <PlaceholderLine style={{ width: '55%' }} />
              <PlaceholderLine style={{ width: '75%' }} />
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <TouchableOpacity style={[styles.contain, style]} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.smallImage} />
        <Tag status style={styles.tagGirdStatus}>
          {t(status)}
        </Tag>
        <View
          style={{ paddingHorizontal: 10, justifyContent: 'center', flex: 1 }}>
          <Text headline semibold numberOfLines={1}>
            {title}
          </Text>
          <Text footnote semibold grayColor style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
          
        </View>
        {enableAction && (
          <TouchableOpacity onPress={omPressMore} style={styles.moreButton}>
            <Icon name="ellipsis-v" color={colors.text} size={16} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (grid) return renderGrid();
  else if (block) return renderBlock();
  else if (small) return renderSmall();
  else return renderList();
}


