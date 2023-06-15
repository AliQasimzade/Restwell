import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { BaseColor, useTheme, BaseStyle } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import ListItem from '../../components/ListItem';
import StarRating from '../../components/StarRating';
import Tag from '../../components/Tag';
import Image from '../../components/Image';

import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Utils from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import { userInfo, wish } from '../../selectors';
import styles from './styles';
import { addWish, removeWish } from '../../actions/wish';
import axios from 'axios';
import { API_URL } from "@env";

function ProductDetail({ navigation, route }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wish);
  const item = route?.params?.item;
  const user = useSelector(userInfo);
  const deltaY = new Animated.Value(0);

  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [collapseHour, setCollapseHour] = useState(false);
  const [related, setRelated] = useState([])
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);

  const [week] = useState(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])

  const getAllListings = async () => {
    const request = await axios.get(`${API_URL}/api/listings`)
    const response = request.data  
    const filterByCategory = response.filter(listing => listing.category == item?.category)
    setRelated(filterByCategory)
    setLoading(false)
  }
  useEffect(() => {
   
    getAllListings()
  }, [])

  const isFavorite = item => {
    return wishlist.some(i => i._id === item._id);
  };

  /**
   * like action
   * @param {*} like
   */
  const onLike = like => {
    if (user) {
      const checkWish = isFavorite(item)
      if (checkWish) {
        const id = item._id
        dispatch(removeWish(id))
        setLike(null);
      } else {

        dispatch(addWish(item));
        setLike(like);
      }

    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            dispatch(addWish(item));
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
      navigation.navigate('Review', { item: item._id });
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
  const onOpen = (type, link) => {
    switch (type) {
      case 'web':
        Linking.openURL(link);
        break;
      case 'phone':
        Linking.openURL('tel://' + link);
        break;
      case 'email':
        Linking.openURL('mailto:' + link);
        break;
      case 'address':
        Linking.openURL(link);
        break;
      case 'whatsapp':
        Linking.openURL(link);
        break;

    }
  };

  /**
   * collapse open time
   */
  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  /**
   * render wishlist status
   *
   */
  const renderLike = () => {
    return (
      <TouchableOpacity onPress={() => onLike(!like)}>
        {wishlist.find(wi => wi._id == item._id) ? (
          <Icon name="heart" color={colors.primaryLight} solid size={18} />
        ) : (
          <Icon name="heart" color={colors.primaryLight} size={18} />
        )}
      </TouchableOpacity>
    );
  };
  /**
   * render Banner
   * @returns
   */
  const renderBanner = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
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
            <PlaceholderMedia style={{ width: '100%', height: '100%' }} />
          </Animated.View>
        </Placeholder>
      );
    }

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
          source={{ uri: item?.splashscreen }}
          style={{ width: '100%', height: '100%' }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 15,
            left: 20,
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}>
          <Image source={{ uri: item?.profileImage }} style={styles.userIcon} />
          <View>
            <Text headline semibold whiteColor>
              {item?.listingTitle}
            </Text>
            <Text footnote whiteColor>
              {item?.email}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  /**
   * render Content View
   * @returns
   */
  const renderContent = () => {
    if (loading) {
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
          <View style={{ height: 255 - heightHeader }} />
          <Placeholder Animation={Progressive}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              <PlaceholderLine style={{ width: '50%', marginTop: 10 }} />
              <PlaceholderLine style={{ width: '70%' }} />
              <PlaceholderLine style={{ width: '40%' }} />
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: '40%' }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: '40%' }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: '40%' }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: '40%' }} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{ marginLeft: 10, flex: 1, paddingTop: 10 }}>
                  <PlaceholderLine style={{ width: '40%' }} />
                </View>
              </View>
              <PlaceholderLine
                style={{ width: '100%', height: 250, marginTop: 20 }}
              />
            </View>
          </Placeholder>
        </ScrollView>
      );
    }
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
        <View style={{ height: 255 - heightHeader }} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
          <View style={styles.lineSpace}>
            <Text title1 semibold style={{ paddingRight: 15 }}>
              {item?.listingTitle}
            </Text>
            {renderLike()}
          </View>
          <View style={styles.lineSpace}>
            <View>
              <Text caption1 grayColor>
                {item?.category}
              </Text>
              <TouchableOpacity style={styles.rateLine} onPress={onReview}>
                <Tag rateSmall style={{ marginRight: 5 }} onPress={onReview}>
                  {item?.rating_avg}
                </Tag>
                <StarRating
                  disabled={true}
                  starSize={10}
                  maxStars={5}
                  rating={item?.rating_avg}
                  fullStarColor={BaseColor.yellowColor}
                  
                />
                <Text footnote grayColor style={{ marginLeft: 5 }}>
                  {item?.rating_avg}
                </Text>
              </TouchableOpacity>
            </View>
            <Tag status>{item?.priceRelationShip}</Tag>
          </View>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              const location = `${item?.locationCoords?.latitude},${item?.locationCoords?.longtitude}`;
              const url = Platform.select({
                ios: `maps:${item?.locationCoords?.latitude},${item?.locationCoords?.longtitude}?q=${location}`,
                android: `geo:${location}?center=${location}&q=${location}&z=16`,
              });
              onOpen('address', t('address'), url);
            }}>
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}>
              <Icon
                name="map-marker-alt"
                size={16}
                color={BaseColor.whiteColor}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text caption2 grayColor>
                {t('address')}
              </Text>
              <Text footnote semibold style={{ marginTop: 5 }}>
                {item?.address}
              </Text>
            </View>
          </TouchableOpacity>
          {/* telefon */}
          {item?.phone && item?.phone.length >= 5 && (
            <TouchableOpacity
              style={styles.line}
              onPress={() => {
                onOpen('phone', t('tel'), item?.phone);
              }}>
              <View
                style={[styles.contentIcon, { backgroundColor: colors.border }]}>
                <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text caption2 grayColor>
                  {t('tel')}
                </Text>
                <Text footnote semibold style={{ marginTop: 5 }}>
                  {item?.phone}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {/* whatsapp */}
          {item?.whatsapp && item?.whatsapp.length >= 5 && (
            <TouchableOpacity
              style={styles.line}
              onPress={() => {
                onOpen('whatsapp', t('whatsapp'),
                  Platform.select({
                    ios: `whatsapp://api.whatsapp.com/send?phone=${item?.whatsapp}`,
                    android: `https://api.whatsapp.com/send?phone=${item?.whatsapp}`,
                  }));
              }}>
              <View
                style={[styles.contentIcon, { backgroundColor: colors.border }]}>
                <Icon name="whatsapp" size={16} color={BaseColor.whiteColor} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text caption2 grayColor>
                  {t('Whatsapp')}
                </Text>
                <Text footnote semibold style={{ marginTop: 5 }}>
                  {item?.whatsapp}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {/* email */}
          {item?.email && item?.email.length >= 5 && (
            <TouchableOpacity
              style={styles.line}
              onPress={() => {
                onOpen('email', t('envelope'), item?.email);
              }}>
              <View
                style={[styles.contentIcon, { backgroundColor: colors.border }]}>
                <Icon name="envelope" size={16} color={BaseColor.whiteColor} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text caption2 grayColor>
                  {t('email')}
                </Text>
                <Text footnote semibold style={{ marginTop: 5 }}>
                  {item?.email}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {/* vebsayt */}
          {item?.website && item?.website.length >= 5 && (
            <TouchableOpacity
              style={styles.line}
              onPress={() => {
                onOpen('web', t('website'), item?.website);
              }}>
              <View
                style={[styles.contentIcon, { backgroundColor: colors.border }]}>
                <Icon name="globe" size={16} color={BaseColor.whiteColor} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text caption2 grayColor>
                  {t('website')}
                </Text>
                <Text footnote semibold style={{ marginTop: 5 }}>
                  {item?.website}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.line} onPress={onCollapse}>
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}>
              <Icon name="clock" size={18} color={BaseColor.whiteColor} />
            </View>
            <View style={styles.contentInforAction}>
              <View>
                <Text body2 grayColor>
                  {t('open_hour')}
                </Text>
              </View>
              <Icon
                name={collapseHour ? 'angle-up' : 'angle-down'}
                size={24}
                color={BaseColor.grayColor}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 20,
              marginTop: 5,
              height: collapseHour ? 0 : null,
              overflow: 'hidden',
            }}>
            {item?.timeschedule?.map((item, index) => {

              return (
                <View
                  style={[styles.lineWorkHours, { borderColor: colors.border }]}
                  key={index}>
                  <Text body1 grayColor>
                    {t(`${week[index]}`)}
                  </Text>
                  <Text body1 accentColor semibold>
                    {`${item?.openingTime} - ${item?.closingTime}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={[styles.contentDescription, { borderColor: colors.border }]}>
          {item?.description && item?.description.length >= 5 && (
            <Text body2 style={{ lineHeight: 20 }}>
              {item?.description}
            </Text>
          )}
          <View>
            <View style={{ flex: 1, marginTop: 20 }}>
              <Text caption1 grayColor>
                {t('date_established')}
              </Text>
              {item?.slogan && (
                <Text headline style={{ marginTop: 5 }}>
                  {item?.slogan}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start', marginVertical: 20 }}>
              <Text caption1 grayColor>
                {t('price_range')}
              </Text>
              <Text headline style={{ marginTop: 5 }}>
                {`${item?.previousprice ?? '-'}₼ - ${item?.price ?? '-'}₼`}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 180,
              paddingVertical: 20,
            }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: parseFloat(item?.locationCoords.latitude ?? 0.0),
                longitude: parseFloat(item?.locationCoords.longtitude ?? 0.0),
                latitudeDelta: 0.009,
                longitudeDelta: 0.004,
              }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(item?.locationCoords.latitude ?? 0.0),
                  longitude: parseFloat(item?.locationCoords.longtitude ?? 0.0),
                }}
              />
            </MapView>
          </View>
        </View>
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingBottom: 5,
            paddingTop: 15,
          }}>
          {t('Tags')}
        </Text>
        <View style={[styles.wrapContent, { borderColor: colors.border }]}>
          {item?.tags?.map(item => {
            return (
              <Tag
                key={item}
                chip
                style={{
                  marginTop: 8,
                  marginRight: 8,
                }}>
                {item}
              </Tag>
            );
          })}
        </View>
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          {t('Features')}
        </Text>
        <View style={[styles.wrapContent, { borderColor: colors.border }]}>
          {item?.features?.map(item => {
            return (
              <Tag
                key={item}
                chip
                style={{
                  marginTop: 8,
                  marginRight: 8,
                }}>
                {item}
              </Tag>
            );
          })}
        </View>
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          {t('related')}
        </Text>
        <View style={{ paddingHorizontal: 20 }}>
          {related.length > 0 && related.map((it,index) => {
            return (
              <ListItem
                key={index}
                small
                image={it.profileImage}
                title={it.listingTitle}
                subtitle={it.category}
                rate={it.rating_avg}
                status={it.priceRelationShip}
                style={{ marginBottom: 15 }}
                onPress={() => onProductDetail(it)}
                onPressTag={onReview}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderBanner()}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon name="arrow-left" size={20} color={colors.primary} />
          );
        }}
        renderRight={() => {
          return <Icon name="images" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('PreviewImage', {
            gallery: item?.gallery,
          });
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
export default ProductDetail