import React, {useState, useEffect} from 'react';
import {View, ScrollView, Animated, TouchableOpacity} from 'react-native';
import axios from 'axios';

import {API_URL} from '@env';

import {SafeAreaView} from 'react-native-safe-area-context';
import Events from '../../components/Events';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import ListItem from '../../components/ListItem';

import Banners from '../../components/Banners';
import Categories from '../../components/Categories';
import Locations from '../../components/Locations';
import NearByMe from '../../components/NearByMe';
import Status from '../../components/Status';
import {BaseStyle, useTheme} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';

const deltaY = new Animated.Value(0);

function Home({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(180);
  const marginTopBanner = heightImageBanner - heightHeader + 10;
  const [popularLocations, setPopularLocations] = useState([]);
  const [lastAdded, setLastAdded] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [listings, setListings] = useState([]);

  
  // bannerleri tapib yukleme basladi
  const [firstBanner, setFirstBanner] = useState(null);
  const [secondBanner, setSecondBanner] = useState(null);
  const [thirdBanner, setThirdBanner] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const listings = axios.get(`${API_URL}/api/listings`);
    const modalbanners = axios.get(`${API_URL}/api/modalbanners`);

    Promise.all([listings, modalbanners])
      .then(responses => {
        const [response1, response2] = responses;
        let mekanlar = response1.data
          .map(r => {
            if (r.verify) {
              return r;
            }
          })
          .filter(Boolean);
        const pop =
          mekanlar.length > 0
            ? mekanlar.filter(item => item.type == 'popular')
            : [];
        const lastadd =
          mekanlar.length > 0
            ? mekanlar.filter(item => item.type == 'lastadded')
            : [];
        const featureds =
          mekanlar.length > 0
            ? mekanlar.filter(item => item.type == 'featured')
            : [];

        setListings(mekanlar);
        setPopularLocations(pop.length == 0 ? null : pop);
        setLastAdded(lastadd.length == 0 ? null : lastadd);
        setFeatured(featureds.length == 0 ? null : featureds);

        response2.data.forEach(item => {
          if (item && item.sira === 1 && item.image) {
            setFirstBanner(item.image);
          } else if (item && item.sira === 2 && item.image) {
            setSecondBanner(item.image);
          } else if (item && item.sira === 3 && item.image) {
            setThirdBanner(item.image);
          }
        });
      })

      .catch(error => {
        // Handle error here
        console.error(error);
      });
  }, []);

  /**
   * render List popular
   * @returns
   */

  const renderPopular = () => {
    if (popularLocations == null) {
      return (
        <View style={styles.centerView}>
          <View style={{alignItems: 'center', paddingBottom: 8}}>
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      );
    } else if (popularLocations.length > 0) {
      return popularLocations.map(item => {
        return (
          <ListItem
            small
            key={`popular${item._id}`}
            image={item.splashscreen}
            title={item.listingTitle}
            subtitle={item.category}
            status={item.priceRelationShip}
            rate={item.rating_avg}
            style={{marginBottom: 15}}
            onPress={() => {
              navigation.navigate('ProductDetail', {
                item: item
              });
            }}
          />
        );
      });
    }

    return [1, 2, 3].map((item, index) => {
      return (
        <ListItem
          small
          loading={true}
          key={`recent${item}`}
          style={{marginBottom: 15}}
        />
      );
    });
  };
  /**
   * render List recent
   * @returns
   */
  const renderRecent = () => {
    if (lastAdded == null) {
      return (
        <View style={styles.centerView}>
          <View style={{alignItems: 'center', paddingBottom: 8}}>
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      );
    } else if (lastAdded.length > 0) {
      return lastAdded.map((item, index) => {
        return (
          <ListItem
            small
            key={`recent${item._id}`}
            image={item.splashscreen}
            title={item.listingTitle}
            subtitle={item.category}
            status={item.priceRelationShip}
            rate={item.rating_avg}
            style={{marginBottom: 15}}
            onPress={() => {
              navigation.navigate('ProductDetail', {
                item: item,
              });
            }}
          />
        );
      });
    }

    return [1, 2, 3].map((item, index) => {
      return (
        <ListItem
          small
          loading={true}
          key={`recent${item}`}
          style={{marginBottom: 15}}
        />
      );
    });
  };
  /**
   * render List recent
   * @returns
   */

  const renderFeatured = () => {
    if (featured == null) {
      return (
        <View style={styles.centerView}>
          <View style={{alignItems: 'center', paddingBottom: 8}}>
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      );
    } else if (featured.length > 0) {
      return featured.map((item, index) => {
        return (
          <ListItem
            small
            key={`featured${item._id}`}
            image={item.splashscreen}
            title={item.listingTitle}
            subtitle={item.category}
            status={item.priceRelationShip}
            rate={item.rating_avg}
            style={{marginBottom: 15, marginTop: 0}}
            onPress={() => {
              navigation.navigate('ProductDetail', {
                item: item,
              });
            }}
          />
        );
      });
    }

    return [1, 2, 3].map((item, index) => {
      return (
        <ListItem
          small
          loading={true}
          key={`recent${item}`}
          style={{marginBottom: 15}}
        />
      );
    });
  };

  /**
   * render List recent
   * @returns
   */

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(110),
                Utils.scaleWithPixel(110),
              ],
              outputRange: [heightImageBanner, heightHeader, 0],
            }),
          },
        ]}>
        <Banners />
      </Animated.View>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
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
          <View
            style={[
              styles.searchForm,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                shadowColor: colors.border,
              },
              {marginTop: marginTopBanner},
            ]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchHistory', {listings})}>
              <View
                style={[
                  BaseStyle.textInput,
                  {backgroundColor: colors.card, height: 48},
                ]}>
                <Text body1 grayColor style={{flex: 1}}>
                  {t('search_location')}
                </Text>
                <View style={{paddingVertical: 8}}>
                  <View
                    style={[styles.lineForm, {backgroundColor: colors.border}]}
                  />
                </View>
                <Icon
                  name="location-arrow"
                  size={18}
                  color={colors.primaryLight}
                  solid
                />
              </View>
            </TouchableOpacity>
          </View>
          <Status />
          <Categories />
          <View style={styles.contentPopular}>
            <Text title3 semibold>
              {t('location')}
            </Text>
            <Text body2 grayColor>
              {t('locationSubtitle')}
            </Text>
          </View>
          <Locations listings={listings} />
          {firstBanner ? (
            <View style={styles.firstBannerImageContainer}>
              <Image
                style={styles.bannerImageElement}
                source={{uri: firstBanner}}
              />
            </View>
          ) : null}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('popular_location')}
            </Text>
            <Text body2 grayColor style={{marginBottom: 15}}>
              {t('popularSubtitle')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderPopular()}
            </ScrollView>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('recent_location')}
            </Text>
            <Text body2 grayColor style={{marginBottom: 15}}>
              {t('recent_sologan')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderRecent()}
            </ScrollView>
          </View>
          {secondBanner ? (
            <View style={styles.secondBannerImageContainer}>
              <Image
                style={styles.bannerImageElement}
                source={{uri: secondBanner}}
              />
            </View>
          ) : null}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('nearByMe')}
            </Text>
            <Text body2 grayColor style={{marginBottom: 15}}>
              {t('nearByMeSubtitle')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {listings.length > 0 && <NearByMe listings={listings} />}
            </ScrollView>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('recommended_locations')}
            </Text>
            <Text body2 grayColor style={{marginBottom: 15}}>
              {t('recommended_locations_subtitle')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderFeatured()}
            </ScrollView>
          </View>
          {thirdBanner ? (
            <View style={styles.thirdBannerImageContainer}>
              <Image
                style={styles.bannerImageElement}
                source={{uri: thirdBanner}}
              />
            </View>
          ) : null}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('event')}
            </Text>
            <Text body2 grayColor style={{marginBottom: 15}}>
              {t('eventSubtitle')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Events />
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
export default Home