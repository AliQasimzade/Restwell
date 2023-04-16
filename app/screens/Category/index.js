import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, View, TouchableOpacity,Alert,Text } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CategoryFull,
  CategoryIcon,
  TextInput,
} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { productActions } from '@actions';


export default function Category({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('full');
  const [category, setCategory] = useState([]);
  const [listings, setListings] = useState([])
  const [result, setResult] = useState([])
 const [filterBy, setByFilter] = useState(0)
  const [filter, setFilter] = useState([])
  const [origin, setOrigin] = useState([]);

  useEffect(() => {
    dispatch(
      productActions.onFetchCategory(null, data => {
        setCategory(data);
        setOrigin(data);
        setRefreshing(false);
      }),
    );
  }, [dispatch]);

  useEffect(() => {
        const categories =  fetch('http://192.168.31.124:3001/api/categories').then(res => res.json())
        const allistings =  fetch('http://192.168.31.124:3001/api/listings').then(res => res.json())

        Promise.all([categories,allistings])
        .then(responses => {
          const [response1, response2] = responses;
          setFilter(response1)
        setListings(response1)
        setResult(response2)
        setByFilter(response2.filter(it => it.category == "Bar").length)
        })
        .catch(error => {
          // Handle error here
          console.error(error);
        });
    
  }, [])
  /**
   * on Refresh category
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      productActions.onFetchCategory(null, data => {
        setCategory(data);
        setOrigin(data);
        setRefreshing(false);
      }),
    );
  };

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
      setCategory(origin);
    } else {
      const result = listings.filter(item => {
        return item.name.toUpperCase().includes(search.toUpperCase());
      })
      console.log(result);
       setFilter(result)
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

              navigation.navigate('List', { item:item.name });
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
              navigation.navigate('List', { item:item.name });
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
          <View style={{alignItems: 'center'}}>
            <Icon
              name="frown-open"
              size={18}
              color={colors.text}
              style={{marginBottom: 4}}
            />
            <Text style={{color:'white'}}>{t('data_not_found')}</Text>
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
              onRefresh={onRefresh}
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
            onChangeText={text => setSearch(text)}
            placeholder={t('search')}
            value={search}
            onSubmitEditing={() => onSearch(search)}
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
