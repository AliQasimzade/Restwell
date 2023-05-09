
import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, TextInput } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../../actions/user';
import { designSelect } from '@selectors';
import { API_URL,API_EXPO_CLIENT_ID,API_ANDROID_CLIENT_ID,API_IOS_CLIENT_ID,API_GOOGLE_AUTH_URL } from "@env";

export default function SignIn({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const design = useSelector(designSelect);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState({ id: true, password: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
    API_EXPO_CLIENT_ID,
    iosClientId:
    API_IOS_CLIENT_ID,
    androidClientId:
    API_ANDROID_CLIENT_ID,
  });

  const getUserInfo = async (tok) => {
    try {
      const req = await fetch(`${API_GOOGLE_AUTH_URL}` + tok);
      if (!req.ok) {
        throw new Error("Request is failed");
      } else {
        const res = await req.json();

        const usEr = { email: res.email }
        const request = await fetch(`${API_URL}/api/loginuser`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usEr),
        });
        if (request.status === 404) {
          throw new Error('Request failed !')
        } else {
          const response = await request.json()
          if (response.message == "This user is not registered") {
            Alert.alert({ title: "Error", message: response.message })
          } if (response.message === "User logged in succesfully") {
            Alert.alert({ title: "Success", message: response.message })
            dispatch(loginUser(response.user))
            navigation.navigate('Profile')
          }

        }
      }
    } catch (err) {
      Alert.alert({ title: "Error", message: err.message })
    }
  }
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getUserInfo(authentication?.accessToken)
    }
  }, [response]);

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
        const request = await fetch(`${API_URL}/api/loginuser`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!request.ok) {
          throw new Error('Request is failed !');
        } else {
          const response = await request.json();
          if (response.message == "This user is not registered") {
            Alert.alert({ title: "Warning", message: response.message })
            setLoading(false);
          } else {
            Alert.alert({ title: "Login", message: response.message })
            navigation.navigate('Profile');
            dispatch(loginUser(response.user));
            setLoading(false);
          }
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
            {Platform.OS == "android" && <Button
              style={{ marginTop: 20 }}
              full
              loading={loading}
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}>
              {t('Sign in Google')}
            </Button>}
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