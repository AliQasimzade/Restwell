import React, {useState, useEffect} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {loginUser} from '../../actions/user';
import {designSelect,userInfo} from '@selectors';

export default function SignIn({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const design = useSelector(designSelect);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState({id: true, password: true});
  const [token, setToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '747668855049-sjgvub8ldim9dejbckikd4h4f4vjafj7.apps.googleusercontent.com',
    iosClientId:
      '747668855049-057av763rn321utna14c7n0gc8pn5mfq.apps.googleusercontent.com',
    androidClientId:
      '747668855049-dbmjgst1esegrhl06abf6n7m3q4plj2g.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const {authentication} = response;
      fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + authentication?.accessToken)
      .then(res => res.json())
      .then(res => {
       const user = {
         name: res.given_name,
         surname: res.family_name,
         image: res.picture,
         email: res.email
       }
      console.log(user)
      dispatch(loginUser(user))
      });
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
        const request = await fetch('https://restwell.az/api/loginuser', {
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
          dispatch(loginUser(response.user));
          Alert.alert({title: 'Login', message: 'Successfuly login !'});
          navigation.navigate('Profile');
          setLoading(false);
        }
      }
    } catch (err) {
      Alert.alert({title: t('sign_in'), message: t(err?.message)});
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <View style={{flex: 1}}>
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
          style={{flex: 1}}>
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
              style={{marginTop: 10}}
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
              style={{marginTop: 20}}
              full
              loading={loading}
              onPress={onLogin}>
              {t('sign_in')}
            </Button>
            <Button
              style={{marginTop: 20}}
              full
              loading={loading}
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}>
              {t('Sign in Google')}
            </Button>
            <Button style={{marginTop: 20}} full loading={loading}>
              {t('Sign in Facebook')}
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{marginTop: 25}}>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
