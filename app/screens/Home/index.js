import React, { useState, useEffect } from 'react';
import * as Location from "expo-location"
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  Loader,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import { Image, Text, Icon, Card, SafeAreaView, ListItem } from '@components';
import { BaseStyle, BaseColor, useTheme } from '@config';
import * as Utils from '@utils';
import styles from './styles';
import Swiper from 'react-native-swiper';
import { useSelector } from 'react-redux';
import { homeSelect } from '@selectors';
import { useTranslation } from 'react-i18next';
import Story from '../../components/Story';
import { FilterModel } from '@models';
import { pointerEvents } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';

const deltaY = new Animated.Value(0);

export default function Home({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const home = useSelector(homeSelect);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(180);
  const marginTopBanner = heightImageBanner - heightHeader + 10;

  const [poularLocations, setPoularLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState([]);
  const [locations, setLocations] = useState([]);
  const [lastAdded, setLastAdded] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [event, setEvent] = useState([]);
  const [status, setStatus] = useState([])
  const [listings, setListings] = useState([])
  const [nearByMe, setNearByMe] = useState([])
  const [loc, setLoc] = useState()

  useEffect(() => {
    // Fetch data from API

    const listings = fetch(
      'https://restwell.az/api/listings',
    ).then(res => res.json());
    const categories = fetch(
      'https://restwell.az/api/categories',
    ).then(res => res.json());
    const banners = fetch(
      'https://restwell.az/api/banners',
    ).then(res => res.json());
    const events = fetch('https://restwell.az/api/events').then(
      res => res.json(),
    );
    const statuses = fetch(
      'https://restwell.az/api/status',
    ).then(res => res.json());
    const locs = fetch(
      'https://restwell.az/api/locations',
    ).then(res => res.json());

    Promise.all([listings, categories, banners, events, statuses, locs])
      .then(responses => {
        const [response1, response2, response3, response4, response5, response6] = responses;
        setCategories(response2);
        setLocations(response6)
        const pop = response1.filter(item => item.type == 'popular');
        const lastadd = response1.filter(item => item.type == 'lastadded');
        const featureds = response1.filter(item => item.type == 'featured');
       console.log(featureds, "Home Page !")
        setListings(response1)
        setPoularLocations(pop);
        setLastAdded(lastadd);
        setFeatured(featureds);
        setBanner(response3);
        setEvent(response4);
        setStatus(response5)


        const getPermissions = async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('====================================');
            console.log("Please grant location permissions");
            console.log('====================================');
          } else {
            let currentLocation = await Location.getCurrentPositionAsync({})
            setLoc(currentLocation)
            console.log('====================================');
            console.log(currentLocation, 'Home Page');
            console.log('====================================');
            const RADIUS = 6371;

            const latitude = currentLocation.coords.latitude
            const longitude = currentLocation.coords.longitude
            // Radius in km
            const radius = 5000;

            // Haversine formula
            function haversine(lat1, lon1, lat2, lon2) {
              const dLat = toRadians(lat2 - lat1);
              const dLon = toRadians(lon2 - lon1);
              const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) ** 2;
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const d = RADIUS * c;
              return d;
            }

            function toRadians(degrees) {
              return degrees * (Math.PI / 180);
            }

            // List of restaurants with their latitude and longitude coordinates
            const restaurants = response1;

            // Find nearby restaurants within 5km radius

            restaurants.forEach((restaurant) => {
              const dist = haversine(latitude, longitude, restaurant.locationCoords.latitude, restaurant.locationCoords.longtitude);
              if (dist <= radius) {
                setNearByMe([...nearByMe, restaurant]);
              }
            });
          }
        }

        getPermissions()

      }
      )

      .catch(error => {
        // Handle error here
        console.error(error);
      });
  }, []);



  /**
   *
   * onOpen ChooseBusiness
   */
  const onChooseBusiness = () => {
    navigation.navigate('ChooseBusiness');
  };

  /**
   * render banner
   */
  const renderBanner = () => {
    if (banner.length > 0) {
      return (
        <Swiper
          dotStyle={{
            backgroundColor: colors.text,
          }}
          activeDotColor={colors.primary}
          paginationStyle={styles.contentPage}
          removeClippedSubviews={false}
          autoplay={true}
          autoplayTimeout={2}>
          {banner.map((item, index) => {
            return (
              <Image
                key={`slider${index}`}
                source={{ uri: item.image }}
                style={{ width: '100%', height: '100%' }}
              />
            );
          })}
        </Swiper>
      );
    }

    return (
      <Placeholder Animation={Loader}>
        <PlaceholderLine style={{ height: '98%' }} />
      </Placeholder>
    );
  };
  /**
   * render Category list
   *
   * @returns
   */
  const renderCategory = () => {
    if (categories.length > 0) {
      return (
        <View style={styles.serviceContent}>
          {categories.map((item, index) => {
            return (
              <TouchableOpacity
                key={`category${item._id}`}
                style={[
                  styles.serviceItem,
                  { width: Utils.getWidthDevice() * 0.24 },
                ]}
                onPress={() => {
                  navigation.navigate('List', { item: item.name });
                }}>
                <View
                  style={[
                    styles.serviceCircleIcon,
                    { backgroundColor: item.color },
                  ]}>
                  <Icon
                    name={Utils.iconConvert(item.icon)}
                    size={20}
                    color={BaseColor.whiteColor}
                    solid
                  />
                </View>
                <Text footnote numberOfLines={1}>
                  {t(item.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return (
      <View style={styles.serviceContent}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
          return (
            <View
              style={{
                width: (Utils.getWidthDevice() - 40) * 0.25,
                marginBottom: 8,
              }}
              key={`category${item}`}>
              <Placeholder Animation={Progressive}>
                <View style={{ alignItems: 'center' }}>
                  <PlaceholderMedia style={styles.serviceCircleIcon} />
                  <PlaceholderLine
                    style={{ width: '50%', height: 8, marginTop: 2 }}
                  />
                </View>
              </Placeholder>
            </View>
          );
        })}
      </View>
    );
  };

  /**
   * render Popular list
   * @returns
   */
  const renderPopular = () => {
    if (locations.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={locations}
          keyExtractor={(item, index) => `locations ${index}`}
          renderItem={({ item, index }) => {
            return (
              <Card
                style={[styles.popularItem, { marginLeft: 15 }]}
                image={item.image}
                onPress={() => {

                  navigation.navigate('LocationList', { item: item.name });
                }}>
                <Text headline semibold style={{ color: 'red' }}>
                  {item.name}
                </Text>
              </Card>
            );
          }}
        />
      );
    }

    return (
      <FlatList
        contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5]}
        keyExtractor={(item, index) => `Popular ${index}`}
        renderItem={({ item, index }) => {
          return (
            <View style={[styles.popularItem, { marginLeft: 15 }]}>
              <Placeholder Animation={Progressive}>
                <PlaceholderMedia
                  style={{ width: '100%', height: '100%', borderRadius: 8 }}
                />
              </Placeholder>
            </View>
          );
        }}
      />
    );
  };

  /**
   * render List recent
   * @returns
   */
  const renderRecent = () => {
    if (lastAdded.length > 0) {
      return lastAdded.map((item, index) => {
        return (
          <ListItem
            small
            key={`recent${item._id}`}
            image={item.splashscreen}
            title={item.listingTitle}
            subtitle={item.category}
            status={item.slogan}
            rate={item.rating_avg}
            style={{ marginBottom: 15 }}
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
          style={{ marginBottom: 15 }}
        />
      );
    });
  };
  /**
   * render List recent
   * @returns
   */

  const renderFeatured = () => {
    if (featured.length > 0) {
      return featured.map((item, index) => {
        return (
          <ListItem
            small
            key={`featured${item._id}`}
            image={item.splashscreen}
            title={item.listingTitle}
            subtitle={item.category}
            status={item.slogan}
            rate={item.rating_avg}
            style={{ marginBottom: 15 }}
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
          style={{ marginBottom: 15 }}
        />
      );
    });
  };

  const renderNearByMe = () => {
    if (nearByMe.length > 0) {
      return nearByMe.map((item, index) => {
        return (
          <ListItem
            small
            key={`nearbyme ${item._id}`}
            image={item.splashscreen}
            title={item.listingTitle}
            subtitle={item.category}
            rate={item.rating_avg}
            status={item.slogan}
            style={{ marginBottom: 15 }}
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
          style={{ marginBottom: 15 }}
        />
      );
    });
  };
  /**
   * render List recent
   * @returns
   */
  const renderEvents = () => {
    if (event.length > 0) {
      return event.map((item, index) => {
        return (
          <ListItem
            small
            key={`event${item._id}`}
            image={item.image}
            title={item.name}
            status={item.locationName}
            style={{ marginBottom: 15 }}
            onPress={() => {
              navigation.navigate('EventDetail', {
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
          style={{ marginBottom: 15 }}
        />
      );
    });
  };
  /**
 * render List recent
 * @returns
 */


  return (
    <View style={{ flex: 1 }}>
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
        {renderBanner()}
      </Animated.View>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
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
          <View
            style={[
              styles.searchForm,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                shadowColor: colors.border,
              },
              { marginTop: marginTopBanner },
            ]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchHistory', { listings })}>
              <View
                style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>
                <Text body1 grayColor style={{ flex: 1 }}>
                  {t('search_location')}
                </Text>
                <View style={{ paddingVertical: 8 }}>
                  <View
                    style={[styles.lineForm, { backgroundColor: colors.border }]}
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
          <View style={{ paddingLeft: 5 }}>
            {status.length > 0 && (
              <Story
                data={status.map((item, index) => {
                  return {
                    user_id: index,
                    user_image: item.userProfilePicture,
                    user_name: item.sharedBy,
                    stories: [
                      {
                        story_id: index,
                        story_image: item.image,
                        swipeText: item.content,
                        onPress: () => console.log('success'),
                      },
                    ],
                  };
                })}
              />
            )}
          </View>
          {renderCategory()}
          <View style={styles.contentPopular}>
            <Text title3 semibold>
              {t('popular_location')}
            </Text>
            <Text body2 grayColor>
              {t('popular_lologan')}
            </Text>
          </View>
          {renderPopular()}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('recent_location')}
            </Text>
            <Text body2 grayColor style={{ marginBottom: 15 }}>
              {t('recent_sologan')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderRecent()}
            </ScrollView>
          </View>








          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('Near by Me')}
            </Text>
            <Text body2 grayColor style={{ marginBottom: 15 }}>
              {t('recent_sologan')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderNearByMe()}
            </ScrollView>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('Recommended Locations')}
            </Text>
            <Text body2 grayColor style={{ marginBottom: 15 }}>
              {t('recent_sologan')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderFeatured()}
            </ScrollView>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15,
            }}>
            <Text title3 semibold>
              {t('Events')}
            </Text>
            <Text body2 grayColor style={{ marginBottom: 15 }}>
              {t('All Events')}
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {renderEvents()}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}