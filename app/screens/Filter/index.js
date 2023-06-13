import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import Tag from '../../components/Tag';
import RangeSlider from '../../components/RangeSlider';
import * as Utils from '@utils';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from "@env"

function Filter({ navigation }) {
  const { colors } = useTheme();
  console.log(colors);
  const { t } = useTranslation();
  function searchProperties(res, c, l, t, priceBegin, priceEnd, f) {
    return res.filter(property => {

      if (c && !c.some(cat => property.category.includes(cat))) {
        return false;
      }

      if (l && property.rayon.includes(l) != true) {
        return false;
      }
      if (priceBegin && property.previousprice < priceBegin) {
        return false;
      }
      if (priceEnd && property.price > priceEnd) {
        return false;
      }
      if (f && !f.some(it => property.features.includes(it))) {
        return false;
      }
      if (t && !t.some(it => property.tags.includes(it))) {
        return false;
      }


      return true;
    });
  }
  const [priceBegin, setPriceBegin] = useState(0);
  const [priceEnd, setPriceEnd] = useState(0);
  const [selectedCategory, setCategory] = useState([]);
  const [categories, setCategories] = useState([])
  const [features, setFeatures] = useState([])
  const [tags, setTags] = useState([])

  const [selectedFacilities, setFacilities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [location, setLocation] = useState([]);
  const [locations, setLocations] = useState([])
  const [scrollEnabled, setScrollEnabled] = useState(true);
  useEffect(() => {
    const cats = axios.get(`${API_URL}/api/categories`)
    const locs = axios.get(`${API_URL}/api/locations`)
    const feat = axios.get(`${API_URL}/api/properties`)
    const tagss = axios.get(`${API_URL}/api/tags`)

    Promise.all([cats, locs, feat, tagss])
      .then(responses => {
        const [response1, response2, response3, response4] = responses;
        setCategories(response1.data)
        setLocations(response2.data)
        setFeatures(response3.data)
        setTags(response4.data)

      })

      .catch(error => {
        console.error(error);
      });

  }, [])
  /**
   * on Apply filter
   *
   */


  const onApply = async () => {
    try {
      const request = await axios.get(`${API_URL}/api/listings`)
      if (request.status !== 200) {
        throw new Error("Request is failed !")
      } else {
        const response = request.data;
        const verifiedListings = response.map(res => {
          if (res.verify) {
            return res
          }
        }).filter(Boolean)
        const c = selectedCategory.length > 0 ? selectedCategory : null
        const f = selectedFacilities.length > 0 ? selectedFacilities : null
        const l = location.length > 0 ? location : null
        const t = selectedTags.length > 0 ? selectedTags : null
        const results = searchProperties(verifiedListings, c, l, t, priceBegin, priceEnd, f);
        navigation.navigate('FilterSearchList', { results })

      }
    } catch (err) {
      Alert.alert({ title: "Error", message: err.message })
    }
  };

  /**
   * @description Called when filtering option > location
   * @author RG Agency <rgagency.org>
   * @date 2020-02-01
   * @param {*} select
   */
  const onNavigateLocation = () => {
    navigation.navigate('PickerScreen', {
      onApply: async location => {
        setLocation(location.name);
      },
      selected: location,
      data: locations,
    });
  };

  /**
   * @description Called when filtering option > category
   * @author RG Agency <rgagency.org>
   * @date 2019-09-01
   * @param {*} select
   */

  const onSelectCategory = select => {
    const exist = selectedCategory.some(item => item === select.name);
    if (exist) {
      setCategory(selectedCategory.filter(item => item != select.name));
    } else {
      setCategory([...selectedCategory, select.name])
    }
  };

  /**
   * on select Feature
   * @param {*} select
   */
  const onSelectFeature = select => {
    const exist = selectedFacilities.some(item => item === select.name);
    if (exist) {
      setFacilities(selectedFacilities.filter(item => item != select.name));
    } else {
      setFacilities([...selectedFacilities, select.name]);
    }
  };

  const onSelectTag = select => {
    const exist = selectedTags.some(item => item === select.name);
    if (exist) {
      setSelectedTags(selectedTags.filter(item => item != select.name));
    } else {
      setSelectedTags([...selectedTags, select.name]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => onApply()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(contentWidth, contentHeight) =>
            setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
          }>
          <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
            <Text headline semibold>
              {t('categories').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {categories.length > 0 && categories.map(item => {
                const selected = selectedCategory.some(i => i === item.name);
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    key={item._id}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}
                    onPress={() => onSelectCategory(item)}>
                    {item.name}
                  </Tag>
                );
              })}
            </View>
            <Text headline semibold style={{ marginTop: 20, height: 45 }}>
              {t('facilities').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {features.length > 0 && features.map(item => {
                const selected = selectedFacilities.some(i => i === item.name);
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    onPress={() => onSelectFeature(item)}
                    icon={
                      <Icon
                        name={Utils.iconConvert(item.icon)}
                        size={12}

                        solid
                        style={{ marginRight: 5, color: selected ? "white" : colors.primary }}
                      />
                    }

                    key={item._id}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                    }}>
                    {item.name}
                  </Tag>
                );
              })}
            </View>


            <Text headline semibold style={{ marginTop: 20, height: 45 }}>
              {t('tags').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {tags.length > 0 && tags.map(item => {
                const selected = selectedTags.some(i => i === item.name);
                return (
                  <Tag
                    primary={selected}
                    outline={!selected}
                    onPress={() => onSelectTag(item)}
                    key={item._id}
                    style={{
                      marginTop: 8,
                      marginRight: 8

                    }}>
                    {item.name}
                  </Tag>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.locationContent}
              onPress={() => onNavigateLocation()}>
              <View>
                <Text headline semibold>
                  {t('location').toUpperCase()}
                </Text>
              </View>
              <Icon name="angle-right" size={18} color={BaseColor.grayColor} />
            </TouchableOpacity>
            <Text headline semibold style={{ marginTop: 20, height: 45 }}>
              {t('price').toUpperCase()}
            </Text>
            <View style={styles.contentRange}>
              <Text caption1 grayColor>
                0
              </Text>
              <Text caption1 grayColor>
            100
              </Text>
            </View>
            {/* <RangeSlider
              color={colors.border}
              selectionColor={colors.primary}
              max={priceEnd}
              min={priceBegin}
              onValueChanged={(low, high) => {
                setPriceBegin(low);
                setPriceEnd(high);
              }}
            /> */}
            <View style={styles.contentResultRange}>
              <Text caption1>{t('avg_price')}</Text>
              <Text caption1>
                0 - 100
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
export default Filter