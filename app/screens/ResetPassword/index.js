import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, TextInput, Button } from '@components';
import { useTranslation } from 'react-i18next';

export default function ResetPassword({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ email: true });
  const [successPassword, setSuccessPassword] = useState({ password: true })
  const [isEmail, setIsEmail] = useState(false);
  const [userId, setUserId] = useState(null);


  const onReset = async () => {
    setLoading(true);
    try {
      if (email == '') {
        setSuccess({
          ...success,
          email: false
        });
        setLoading(false);
      } else {

        setIsEmail(true);
        const request = await fetch(`http://192.168.31.124:3001/api/useremail/${email}`);

        if (request.status === 404) {
          throw new Error('Request failed !');
        } else {
          const response = await request.json();
          setLoading(false)

          Alert.alert({ type: 'success', title: "Success", message: "User finded ! Please new password" })

          console.log('====================================');
          console.log(response);
          console.log('====================================');
          setUserId(response.user._id)

        }

      }

    } catch (err) {
      Alert.alert({ type: 'error', title: 'Error', message: err.message });
    }
  };


  const changePassword = async () => {
    setLoading(true);
    try {
      if (password == '') {
        setSuccessPassword({
          ...successPassword,
          password: false
        });
        setLoading(false);
      } else {
        const passwordUser = { password }

        const request = await fetch(`https://restwell.az/api/updateuser/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordUser),
        })

        if (!request.ok) {
          throw new Error('Request failed !')
        } else {
          const response = await request.json()
          setLoading(false);
          setTimeout(() => {
            navigation.goBack();
          }, 500)

          console.log('====================================');
          console.log(response);
          console.log('====================================');
        }
      }
    } catch (err) {
      Alert.alert({ type: 'error', title: 'Error', message: err.message });
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('reset_password')}
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
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              onChangeText={text => setEmail(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  email: true,
                });
              }}
              placeholder={t('email_address')}
              success={success.email}
              value={email}
              selectionColor={colors.primary}
            />

            {isEmail && <TextInput
              style={{ marginTop: 20 }}
              onChangeText={text => setPassword(text)}
              onFocus={() => {
                setSuccessPassword({
                  ...successPassword,
                  password: true,
                });
              }}
              placeholder={t('input_password')}
              secureTextEntry={true}
              success={successPassword.password}
              value={password}
              selectionColor={colors.primary}
            />}
            {isEmail ? <Button
              style={{ marginTop: 20 }}
              full
              onPress={() => changePassword()}
              loading={loading}>
              {t('reset_password')}
            </Button> : <Button
              style={{ marginTop: 20 }}
              full
              onPress={() => onReset()}
              loading={loading}>
              {t('Type Password')}
            </Button>}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
