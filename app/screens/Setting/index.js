import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import  Text from '../../components/Text';
import { useTranslation } from 'react-i18next';
import * as Utils from '@utils';
import styles from './styles';

export default function Setting({ navigation }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const forceDark = useSelector(state => state.application.force_dark);

  /**
   * @description Call when reminder option switch on/off
   */


  const darkOption = forceDark
    ? t('Dark')
    : forceDark != null
      ? t('Light')
      : t('dynamic_system');

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('setting')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={26}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <ScrollView contentContainerStyle={styles.contain}>
          <TouchableOpacity
            style={[
              styles.profileItem,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
            onPress={() => {
              navigation.navigate('ChangeLanguage');
            }}>
            <Text body1>{t('language')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                {Utils.languageFromCode(i18n.language)}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
            onPress={() => {
              navigation.navigate('ThemeSetting');
            }}>
            <Text body1>{t('theme')}</Text>
            <View
              style={[styles.themeIcon, { backgroundColor: colors.primary }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.profileItem,
              { borderBottomColor: colors.border, borderBottomWidth: 1 },
            ]}
            onPress={() => {
              navigation.navigate('SelectDarkOption');
            }}>
            <Text body1>{t('dark_theme')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                {darkOption}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
