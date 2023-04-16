import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag, RangeSlider } from '@components';
import * as Utils from '@utils';
import styles from './styles';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';



export default function Filter({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  function searchProperties(res, c, l, priceBegin, priceEnd, f) {
    return res.filter(property => {

      if (c && !c.some(cat => property.category.includes(cat))) {
        return false;
      }

      if (l && property.address.includes(l) != true) {
        return false;
      }
      if (priceBegin && property.previousprice < priceBegin) {
        return false;
      }
      if (priceEnd && property.price > priceEnd) {
        return false;
      }
      if (f && !f.some(feature => feature.includes(feature))) {
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
  const [selectedFacilities, setFacilities] = useState([]);
  const [businessColor, setBusinessColor] = useState('');
  const [location, setLocation] = useState([]);
  const [locations, setLocations] = useState([])
  const [scrollEnabled, setScrollEnabled] = useState(true);

  console.log(location, "Filter Page")
  useEffect(() => {
    const cats = fetch('http://192.168.31.124:3001/api/categories').then(res => res.json())
    const locs = fetch('http://192.168.31.124:3001/api/locations').then(res => res.json())
    const feat = fetch('http://192.168.31.124:3001/api/properties').then(res => res.json())


    Promise.all([cats, locs, feat])
      .then(responses => {
        const [response1, response2, response3] = responses;
        setCategories(response1)
        setLocations(response2)
        setFeatures(response3)

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
      const request = await fetch('http://192.168.31.124:3001/api/listings')
      if (!request.ok) {
        throw new Error("Request is failed !")
      } else {
        const response = await request.json()
        const c = selectedCategory.length > 0 ? selectedCategory : null
        const f = selectedFacilities.length > 0 ? selectedFacilities : null
        const l = location.length > 0 ? location : null

        const results = searchProperties(response, c, l, priceBegin, priceEnd, f);
        navigation.navigate('FilterSearchList', { results })

      }
    } catch (err) {
      Alert.alert({ title: "Error", message: err.message })
    }
  };

  /**
   * @description Called when filtering option > location
   * @author Passion UI <passionui.com>
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
   * @author Passion UI <passionui.com>
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
              {t('category').toUpperCase()}
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
            <Text headline semibold style={{ marginTop: 20 }}>
              {t('facilities').toUpperCase()}
            </Text>
            <View style={styles.wrapContent}>
              {features.length > 0 && features.map(item => {
                const selected = selectedFacilities.some(i => i === item.name);
                return (
                  <Tag
                    onPress={() => onSelectFeature(item)}
                    icon={
                      <Icon
                        name={Utils.iconConvert(item.icon)}
                        size={12}
                        color={colors.accent}
                        solid
                        style={{ marginRight: 5 }}
                      />
                    }
                    chip
                    key={item._id}
                    style={{
                      marginTop: 8,
                      marginRight: 8,
                      borderColor: selected ? colors.primary : colors.accent,
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
            <Text headline semibold style={{ marginTop: 20 }}>
              {t('price').toUpperCase()}
            </Text>
            <View style={styles.contentRange}>
              <Text caption1 grayColor>
                {priceBegin}
              </Text>
              <Text caption1 grayColor>
                {priceEnd}
              </Text>
            </View>
            <RangeSlider
              color={colors.border}
              selectionColor={colors.primary}
              onValueChanged={(low, high) => {
                setPriceBegin(low);
                setPriceEnd(high);
              }}
            />
            <View style={styles.contentResultRange}>
              <Text caption1>{t('avg_price')}</Text>
              <Text caption1>
                ${priceBegin} - ${priceEnd}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
