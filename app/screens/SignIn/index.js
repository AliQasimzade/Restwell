import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, TextInput } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { authActions } from '@actions';
import { designSelect } from '@selectors';
import { useEffect } from 'react';
import { loginUser } from '../../actions/user';

export default function SignIn({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const design = useSelector(designSelect);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState({ id: true, password: true });


  /**
   * call when action onLogin
   */
  const onLogin = async () => {

    try {
      if (email == '' || password == '') {
        setSuccess({
          ...success,
          id: false,
          password: false,
        });
        return;
      } else {
        const params = {
          email,
          password,
        };

        setLoading(true);
        const request = await fetch('https://restwell.az/api/loginuser', {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params)
        })


        if (!request.ok) {
          throw new Error('Request is failed !')
        } else {
          const response = await request.json()
          dispatch(loginUser(response.user))
          Alert.alert({ title: 'Login', message: "Successfuly login !" })
          navigation.navigate('Profile')
          setLoading(false)
        }
      }


    } catch (err) {
      Alert.alert({ title: t('sign_in'), message: t(err?.message) });
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('sign_in')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <View style={styles.contain}>
            <TextInput
              onChangeText={setEmail}
              onFocus={() => {
                setSuccess({
                  ...success,
                  id: true,
                });
              }}
              placeholder={t('Email')}
              success={success.id}
              value={email}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={setPassword}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
              placeholder={t('input_password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <Button
              style={{ marginTop: 20 }}
              full
              loading={loading}
              onPress={onLogin}>
              {t('sign_in')}
            </Button>
            <Button
              style={{ marginTop: 20 }}
              full
              loading={loading}
              disabled={!request}
             
            >
              {t('Sign in Google')}
            </Button>
            <Button
              style={{ marginTop: 20 }}
              full
              loading={loading}
            >
              {t('Sign in Facebook')}
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{ marginTop: 25 }}>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
