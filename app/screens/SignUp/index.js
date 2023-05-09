import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput } from '@components';
import styles from './styles';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/user';
import { API_URL,API_EXPO_CLIENT_ID,API_ANDROID_CLIENT_ID,API_IOS_CLIENT_ID,API_GOOGLE_AUTH_URL } from "@env";

WebBrowser.maybeCompleteAuthSession();

export default function SignUp({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    username: true,
    email: true,
    password: true,
    surname: true,
  });
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

        const usEr = { email: res.email, name: res.given_name, surname: res.family_name, image: res.picture }
        const request = await fetch(`${API_URL}/api/createuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usEr),
        });


        if (!request.ok) {
          throw new Error('Request failed !')
        } else {
          const response = await request.json()
          if (response == "This user already exsist") {
            Alert.alert({ title: "Error", message: response })
          } if (response.message === "User added succesfully") {
            Alert.alert({ title: "Success", message: response.message })
            dispatch(loginUser(response.data))
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
   * call when action signup
   *
   */

  const onSignUp = async () => {
    if (username == '' || email == '' || password == '' || surname == '') {
      setSuccess({
        ...success,
        username: username != '' ? true : false,
        email: email != '' ? true : false,
        password: password != '' ? true : false,
        surname: surname != '' ? true : false,
      });
    } else {
      setLoading(true);
      try {
        const params = {
          name: username,
          password,
          email,
          surname,
          image: "https://firebasestorage.googleapis.com/v0/b/adminpanel-da8aa.appspot.com/o/images%2FuserImageRestwell.jpg?alt=media&token=df0483ee-b298-41b0-94ea-cd5b3e973217"
        };
        const req = await fetch(
          `${API_URL}/api/createuser`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          },
        );


        if (!req.ok) {
          throw new Error('Request failed !');
        } else {
          const res = await req.json();
          if (res == "This user already exsist") {
            Alert.alert({ type: "error", title: "Warning", message: res })
          } else {
            Alert.alert({ type: "success", title: "Sign Up", message: res.message })
            dispatch(loginUser(res.data));
            navigation.navigate('Profile')
          }


        }
      } catch (error) {
        Alert.alert({
          title: t('sign_up'),
          message: error.message,
        });
      }
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('sign_up')}
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
              onChangeText={text => setUsername(text)}
              placeholder={t('Name')}
              success={success.username}
              value={username}
              onFocus={() => {
                setSuccess({
                  ...success,
                  username: true,
                });
              }}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setSurname(text)}
              placeholder={t('Surname')}
              success={success.surname}
              value={surname}
              onFocus={() => {
                setSuccess({
                  ...success,
                  surname: true,
                });
              }}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setEmail(text)}
              placeholder={t('input_email')}
              keyboardType="email-address"
              success={success.email}
              value={email}
              onFocus={() => {
                setSuccess({
                  ...success,
                  email: true,
                });
              }}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
              placeholder={t('input_password')}
              success={success.password}
              value={password}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
            />
            <Button
              full
              style={{ marginTop: 20 }}
              loading={loading}
              onPress={() => onSignUp()}>
              {t('sign_up')}
            </Button>
            {Platform.OS == "android" && <Button
              full
              style={{ marginTop: 20 }}
              loading={loading}
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}
            >
              {t('Sign up with Google')}
            </Button>}

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}