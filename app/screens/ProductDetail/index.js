import React, {useState, useEffect} from 'react';
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
import {BaseColor, useTheme, BaseStyle} from '@config';
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
import {useTranslation} from 'react-i18next';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Utils from '@utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import {productActions, wishListActions} from '@actions';
import {userSelect, wishlistSelect, designSelect} from '@selectors';
import styles from './styles';

export default function ProductDetail({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelect);
  const design = useSelector(designSelect);
  const item = route?.params.item;
  const user = useSelector(userSelect);
  const deltaY = new Animated.Value(0);

  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [product, setProduct] = useState(null);
  const [collapseHour, setCollapseHour] = useState(false);
  const [related, setRelated] = useState([])
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);

  useEffect(() => {
    dispatch(
      productActions.onLoadProduct(item.id, design, item => {
        setLoading(false);
        setProduct(item);
        setLike(item.favorite);
      }),
    );
  }, [design, dispatch, item.id]);

  useEffect(() => {
  const getAllListings = async () => {
    const request = await fetch('https://adminpanelback.onrender.com/api/listings')
    const response = await request.json()

     const filterByCategory = response.filter(listing => listing.category == item?.category)
     console.log(filterByCategory);
    setRelated(filterByCategory)

  }
  getAllListings()
  },[])

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
    navigation.replace('ProductDetail', {item: item});
  };

  /**
   * Open action
   * @param {*} item
   */
  const onOpen = (type, title, link) => {
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
        {like ? (
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
            <PlaceholderMedia style={{width: '100%', height: '100%'}} />
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
          source={{uri: item?.splashscreen}}
          style={{width: '100%', height: '100%'}}
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
          <Image source={{uri: item?.profileImage}} style={styles.userIcon} />
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
                  contentOffset: {y: deltaY},
                },
              },
            ],
            {useNativeDriver: false},
          )}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          <View style={{height: 255 - heightHeader}} />
          <Placeholder Animation={Progressive}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              <PlaceholderLine style={{width: '50%', marginTop: 10}} />
              <PlaceholderLine style={{width: '70%'}} />
              <PlaceholderLine style={{width: '40%'}} />
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <PlaceholderLine
                style={{width: '100%', height: 250, marginTop: 20}}
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
                contentOffset: {y: deltaY},
              },
            },
          ],
          {useNativeDriver: false},
        )}
        onContentSizeChange={() => {
          setHeightHeader(Utils.heightHeader());
        }}
        scrollEventThrottle={8}>
        <View style={{height: 255 - heightHeader}} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
          <View style={styles.lineSpace}>
            <Text title1 semibold style={{paddingRight: 15}}>
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
                <Tag rateSmall style={{marginRight: 5}} onPress={onReview}>
                  {3}
                </Tag>
                <StarRating
                  disabled={true}
                  starSize={10}
                  maxStars={5}
                  rating={3}
                  fullStarColor={BaseColor.yellowColor}
                  on
                />
                <Text footnote grayColor style={{marginLeft: 5}}>
                  (3)
                </Text>
              </TouchableOpacity>
            </View>
            <Tag status>{item?.slogan}</Tag>
          </View>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              const location = `${item?.locationCoords.latitude}, ${item?.locationCoords.longtitude}`;
              const url = Platform.select({
                ios: `maps:${location}`,
                android: `geo:${location}?center=${location}&q=${location}&z=16`,
              });
              onOpen('address', t('address'), url);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon
                name="map-marker-alt"
                size={16}
                color={BaseColor.whiteColor}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('address')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {item?.address}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('phone', t('tel'), item?.phone);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="mobile-alt" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('tel')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {item.phone}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('email', t('envelope'), item?.email);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="envelope" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('email')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {item?.email}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('web', t('website'), item?.website);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="globe" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 grayColor>
                {t('website')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {item?.website}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.line} onPress={onCollapse}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="clock" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={styles.contentInforAction}>
              <View>
                <Text caption2 grayColor>
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
            {item?.timeschedule.map((item, index) => {
              return (
                <View
                  style={[styles.lineWorkHours, {borderColor: colors.border}]}
                  key={index}>
                  <Text body2 grayColor>
                    {t(index + 1)}
                  </Text>
                  <Text body2 accentColor semibold>
                    {`${item.openingTime} - ${item.closingtime}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={[styles.contentDescription, {borderColor: colors.border}]}>
          <Text body2 style={{lineHeight: 20}}>
            {item?.description}
          </Text>
          <View>
            <View style={{flex: 1}}>
              <Text caption1 grayColor>
                {t('date_established')}
              </Text>
              <Text headline style={{marginTop: 5}}>
                {item?.slogan}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text caption1 grayColor>
                {t('price_range')}
              </Text>
              <Text headline style={{marginTop: 5}}>
                {`${item?.previousprice ?? '-'}$ - ${item?.price ?? '-'}$`}
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
        <View style={[styles.wrapContent, {borderColor: colors.border}]}>
          {item?.tags.map(item => {
            return (
              <Tag
                key={item._id}
                icon={
                  <Icon
                    name={Utils.iconConvert(item.icon)}
                    size={12}
                    color={colors.accent}
                    solid
                    style={{marginRight: 5}}
                  />
                }
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
        <View style={[styles.wrapContent, {borderColor: colors.border}]}>
          {item?.features.map(item => {
            return (
              <Tag
                key={item._id}
                icon={
                  <Icon
                    name={Utils.iconConvert(item.icon)}
                    size={12}
                    color={colors.accent}
                    solid
                    style={{marginRight: 5}}
                  />
                }
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
        <View style={{paddingHorizontal: 20}}>
          {related.length > 0 && related.map(item => {
            return (
              <ListItem
                key={item._id}
                small
                image={item.profileImage}
                title={item.listingTitle}
                subtitle={item.category}
                rate={3}
                style={{marginBottom: 15}}
                onPress={() => onProductDetail(item)}
                onPressTag={onReview}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderBanner()}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
          );
        }}
        renderRight={() => {
          return <Icon name="images" size={20} color={BaseColor.whiteColor} />;
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
