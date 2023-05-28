import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, View, TouchableOpacity, Alert, Text } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';

import Header from '../../components/Header';
import Icon from '../../components/Icon';
import CategoryFull from '../../components/CategoryFull';
import CategoryIcon from '../../components/CategoryIcon';
import TextInput from '../../components/TextInput';

import * as Utils from '@utils';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';

function Category({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('full');
  const [listings, setListings] = useState([])
  const [result, setResult] = useState([])
  const [filter, setFilter] = useState([])


  useEffect(() => {
    const categories = axios.get(`${API_URL}/api/categories`)
    const allistings = axios.get(`${API_URL}/api/listings`)

    Promise.all([categories, allistings])
      .then(responses => {
        const [response1, response2] = responses;
        setFilter(response1.data)
        const verifiedListings = response2.data.map(re => {
          if (re.verify) {
            return re
          }
        }).filter(Boolean)
        setListings(response1.data)
        setResult(verifiedListings)
      })
      .catch(error => {
        // Handle error here
        console.error(error);
      });

  }, [])
  /**
   * on Refresh category
   */


  /**
   * call when change mode view
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'full':
        setModeView('icon');
        break;
      case 'icon':
        setModeView('full');
        break;
    }
  };

  /**
   * call when search category
   */
  const onSearch = search => {

    if (!search) {
      setFilter(listings)

    } else {
      const res = listings.filter(item => {
        return item.name.toUpperCase().includes(search.toUpperCase());
      })

      setFilter(res)
    }
  };

  /**
   * render Item category
   * @param {*} item
   * @param {*} index
   * @returns
   */
  const renderItem = (item, index) => {
    switch (modeView) {
      case 'icon':
        return (
          <CategoryIcon
            icon={Utils.iconConvert(item.icon)}
            color={item.color}
            title={item.name}
            subtitle={item.email}
            onPress={() => {
              navigation.navigate('List', { item: item.name });
            }}
            style={[styles.itemIcon, { borderColor: colors.border }]}
          />
        );
      case 'full':
        return (
          <CategoryFull
            image={item.image}
            color={item.color}
            icon={Utils.iconConvert(item.icon)}
            title={item.name}
            subtitle={item.email}
            count={(result.filter(it => it.category == item.name).length)}
            onPress={() => {
              navigation.navigate('List', { item: item.name });
            }}
            style={{
              marginBottom: 15,
            }}
          />
        );
      default:
        break;
    }
  };

  /**
   * render content
   * @returns
   */
  const renderContent = () => {
    let list = (
      <View >
        <View style={{ alignItems: 'center' }}>
          <Icon
            name="frown-open"
            size={18}
            color={colors.text}
            style={{ marginBottom: 4 }}
          />
          <Text style={{ color: 'white' }}>{t('data_not_found')}</Text>
        </View>
      </View>
    );
    if (filter.length > 0) {
      list = (

        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
            />
          }
          data={filter}
          keyExtractor={(item, index) => `Category ${index}`}
          renderItem={({ item, index }) => renderItem(item, index)}
        />
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <TextInput
            onChangeText={text => {
              setSearch(text)
              onSearch(text)
            }}
            placeholder={t('search')}
            value={search}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                  onSearch('');
                }}>
                <Icon name="times" size={16} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
          />
        </View>
        {list}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('category')}
        renderRight={() => {
          return (
            <Icon
              name={modeView == 'full' ? 'th-large' : 'th-list'}
              size={20}
              color={BaseColor.grayColor}
            />
          );
        }}
        onPressRight={onChangeView}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
export default Category