import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Text,
  ListItem,
} from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { ProductModel } from '@models';
import { BaseCollection } from '../../api/response/collection';
import { useSelector } from 'react-redux';
import { wishlistSelect } from '@selectors';

let timeout;

export default function SearchHistory({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const wishlist = useSelector(wishlistSelect);
  console.log(route?.params, "SearchHistory Page");
  const [history, setHistory] = useState(['bar,Qara']);
  const [result, setResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState([])
  const [loading, setLoading] = useState(false);

  /**
   * check wishlist state
   * only UI kit
   */
  const isFavorite = item => {
    return wishlist.list?.some(i => i.id == item.id);
  };

  /**
   * call when search data
   * @param {*} keyword
   */
  const onSearch = keyword => {
    setKeyword(keyword);
    if (keyword != '') {
      console.log(keyword);
      setLoading(true);
      setHistory([...history, keyword])
      setFilter(
        route?.params.listings.filter(item => {
          return item.roadorstate.toUpperCase().includes(keyword.toUpperCase());
        }),
      );
      setLoading(false);
      setShowResult(true);
    } else {
      setShowResult(false);
      setFilter([])
    }
  };

  /**
   * on load detail and save history
   * @param {*} item
   */
  const onDetail = item => {
    navigation.navigate('ProductDetail', {
      item: item,
    });
  };

  /**
   * on clear
   */
  const onClear = () => {
    setHistory([]);
  };

  /**
   * render content
   *
   */
  const renderContent = () => {
    if (filter.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={filter}
          keyExtractor={(item, index) => `history ${index}`}
          renderItem={({ item, index }) => (
            <ListItem
              small
              image={item.splashscreen}
              title={item.listingTitle}
              subtitle={item.category}
              location={item.address}
              phone={item.phone}
              rate={item.rate_avg}
              status={item.slogan}
              favorite={isFavorite(item)}
              style={{
                marginBottom: 15,
              }}
              onPress={() => onDetail(item)}
            />
          )}
        />
      );
    }
    else {
      return (
        <View style={styles.loadingContent}>
          <View style={{ alignItems: 'center' }}>
            <Icon
              name="frown-open"
              size={18}
              color={colors.text}
              style={{ marginBottom: 4 }}
            />
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
        <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
          <View style={styles.rowTitle}>
            <Text headline>{t('search_history').toUpperCase()}</Text>
            <TouchableOpacity onPress={onClear}>
              <Text caption1 accentColor>
                {t('clear')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {history.length > 0 && history.map((item, index) => (
              <TouchableOpacity
                style={[styles.itemHistory, { backgroundColor: colors.card }]}
                onPress={() => onDetail(item)}
                key={`search ${index}`}>
                <Text caption2>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('search')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
            <TextInput
              placeholder={t('search')}
              value={keyword}
              onChangeText={onSearch}
              icon={
                <TouchableOpacity
                  onPress={() => {
                    onSearch('');
                  }}
                  style={styles.btnClearSearch}>
                  <Icon name="times" size={18} color={BaseColor.grayColor} />
                </TouchableOpacity>
              }
            />
          </View>
          {renderContent()}
        </View>
      </SafeAreaView>
    </View>
  );
}
