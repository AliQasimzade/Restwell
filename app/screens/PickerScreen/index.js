import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import Button  from '../../components/Button';
import styles from './styles';
import {useTranslation} from 'react-i18next';

function PickerScreen({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [search, setSearch] = useState('');
  const [data, setData] = useState(route.params.data ?? []);
  const [selected, setSelected] = useState(route.params.selected);

  /**
   * @description Called when apply
   * @author RG Agency <rgagency.org>
   * @date 2019-08-03
   * @param {object} select
   */
  const onApply = selected => {
    navigation.goBack();
    route.params?.onApply(selected);
  };

  /**
   * on change keyword
   *
   * @param {*} keyword
   */
  const onSearch = keyword => {
    setSearch(keyword);
    if (!keyword) {
      setData(route.params.data ?? []);
    } else {
      setData(
        data.filter(item => {
          return item.name.toUpperCase().includes(keyword.toUpperCase());
        }),
      );
    }
  };

  /**
   * @description Called when item is selected
   * @author RG Agency <rgagency.org>
   * @date 2019-08-03
   * @param {object} select
   */
  const onChange = select => {
    setSelected(select);
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={route.params?.title ?? t('location')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <View style={styles.contain}>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <TextInput
              onChangeText={text => onSearch(text)}
              placeholder={t('search')}
              value={search}
              icon={
                <TouchableOpacity onPress={() => onSearch('')}>
                  <Icon name="times" size={16} color={BaseColor.grayColor} />
                </TouchableOpacity>
              }
            />
          </View>
          <FlatList
            style={{paddingHorizontal: 20, flex: 1}}
            data={data}
            keyExtractor={(item, index) => `Picker ${index}`}
            renderItem={({item}) => {
              const checked = item._id == selected?._id;
              return (
                <TouchableOpacity
                  style={[styles.item, {borderBottomColor: colors.border}]}
                  onPress={() => onChange(item)}>
                  <Text
                    body1
                    style={
                      checked
                        ? {
                            color: colors.primary,
                          }
                        : {}
                    }>
                    {item.name}
                  </Text>
                  {checked && (
                    <Icon name="check" size={14} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Button full onPress={() => onApply(selected)}>
              {t('apply')}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
export default PickerScreen