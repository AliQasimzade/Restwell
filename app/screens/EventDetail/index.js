import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { BaseColor, useTheme, BaseStyle } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Tag,
  Image,
  ListItem,
} from '@components';
import { useTranslation } from 'react-i18next';

import * as Utils from '@utils';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import styles from './styles';

export default function EventDetail({ navigation, route }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const item = route.params?.item;
  console.log(item, 'Event Detail Page');
  const deltaY = new Animated.Value(0);

  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [product, setProduct] = useState(null);
  const [collapseHour, setCollapseHour] = useState(false);
  const [related, setRelated] = useState([])
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);


  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id === item.id);
  };

  /**
   * like action
   * @param {*} like
   */
  const onLike = like => {
    if (user) {
      setLike(null);
      dispatch(wishListActions.onUpdate(item));
      setLike(like);
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            dispatch(wishListActions.onUpdate(item));
            setLike(like);
          },
        },
      });
    }
  };

  /**
   * on Review action
   */
  const onReview = () => {
    if (user) {
      navigation.navigate({
        name: 'Review',
      });
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            navigation.navigate({
              name: 'Review',
            });
          },
        },
      });
    }
  };

  /**
   * go product detail
   * @param {*} item
   */
  const onProductDetail = item => {
    navigation.replace('ProductDetail', { item: item });
  };

  /**
   * Open action
   * @param {*} item
   */
  const onOpen = ( link) => {
    Linking.openURL('tel://' + link);
  };

  /**
   * collapse open time
   */
  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  /**
   * render Banner
   * @returns
   */
  const renderBanner = () => {


    return (
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Image
          source={{ uri: item?.image }}
          style={{ width: '100%', height: '100%' }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 15,
            left: 20,
            flexDirection: 'row',
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}>
        </Animated.View>
      </Animated.View>
    );
  };

  /**
   * render Content View
   * @returns
   */
  const renderContent = () => {

    return (
      <ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: deltaY },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        onContentSizeChange={() => {
          setHeightHeader(Utils.heightHeader());
        }}
        scrollEventThrottle={8}>
        <View style={{ height: 210 + heightHeader }} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
          <View style={styles.lineSpace}>
            <Text title1 semibold style={{ paddingRight: 15, marginBottom: 10 }}>
              {item?.name}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}>
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}>
              <Icon
                name="map-marker-alt"
                size={16}
                color={BaseColor.whiteColor}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text footnote semibold style={{ marginTop: 5 }}>
                {item?.locationAddress}
              </Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}>
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}>
              <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
            </View>
            <TouchableOpacity onPress={() => onOpen(item?.contactInfo)}>
            <View style={{ marginLeft: 10 }}>
              <Text footnote semibold style={{ marginTop: 5 }}>
                {item.contactInfo}
              </Text>
            </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 20,
              marginTop: 5,
              height: collapseHour ? 0 : null,
              overflow: 'hidden',
            }}>
          </View>
        </View>
        <View style={[styles.contentDescription, { borderColor: colors.border }]}>
          <Text body2 style={{ lineHeight: 20 }}>
            {item?.description}
          </Text>
          <View
            style={{
              paddingVertical: 20,
              flexDirection: 'row',
            }}>
            <View style={{ flex: 1 }}>
              <Text caption1 grayColor>
                {t('Start Date - End Date')}
              </Text>
              <Text style={{ marginTop: 5, fontSize: 13 }}>
                {item?.startDate} - {item?.endDate}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text caption1 grayColor>
                {t('Entry Price')}
              </Text>
              <View style={{display:'flex', flexDirection:'row',marginTop: 5,alignItems:'center', flex: 1, justifyContent: 'center' }}>
                <Text headline style={{marginRight: 5}}>
                  {item?.entryPrice} ₼
                
                </Text>
                <Icon
                  name="dollar-sign"
                  size={16}
                  color={BaseColor.whiteColor}
                />
              </View>
            </View>
          </View>
       
        </View>
     <View style={{paddingLeft: 20,marginTop: 20}}>
      <Text>Details: {item?.details}</Text>
     </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderBanner()}
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}