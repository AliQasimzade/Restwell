import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TouchableOpacity, Alert } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import Text from '../../components/Text'
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { userInfo } from "../../selectors"
import axios from 'axios';
import { API_URL } from "@env";
import { logOutUSer } from '../../actions/user';
import { removeAllWish } from "../../actions/wish";

function DeleteAccount({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const user = useSelector(userInfo)

  const handleDeleteUser = async () => {
    try {
      const request = await axios.delete(`${API_URL}/api/deleteuser/${user?._id}`);
      if (request.status != 200) {
        throw new Error('Sorğuda xəta baş verdi')
      } else {
        Alert.alert({ title: 'success', message: 'İstifadəci uğurla silindi' })
        dispatch(logOutUSer())
        dispatch(removeAllWish())
        setTimeout(() => {
          navigation.navigate('Walkthrough')
        }, 1000)
      }
    } catch (error) {
      alert(error.message)
      Alert.alert({ title: 'error', message: error.message })
    }
  }
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
      <View style={styles.contain}>
        <View style={[styles.contentModal, { backgroundColor: colors.card }]}>
          <Text style={{ textAlign: 'center', fontSize: 22 }}>{t('are_you_sure')}</Text>
          <View style={styles.contentAction}>
            <TouchableOpacity
              style={{ padding: 8, marginHorizontal: 24 }}
              onPress={() => navigation.goBack()}>
              <Text body1 grayColor>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={handleDeleteUser}
            >
              <Text body1 primaryColor>
                {t('apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default DeleteAccount