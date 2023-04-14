import React, {useState} from 'react';
import UserImage from '../../../assets/userimage.png'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import {userInfo} from '@selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {changeUserInfo} from '../../actions/user';

export default function ProfileEdit({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    surname: true,
    password: true,
  });

  /**
   * on Update Profile
   *
   */
  const onUpdate = async () => {
    setLoading(true);
   try {
    if (name == '' || email == '' || password == '' || surname == '' ) {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        surname: surname != '' ? true : false,
        password: password != '' ? true : false,
      });
      setLoading(false)
      return;
    }else if(name == user.name && surname == user.surname && email == user.email && password == user.password) {
      Alert.alert({title:"Warning", message:"Please change any input value"})
      setLoading(false)
      return;
    }else {
      const params = {
        name,
        email,
        surname,
        password,
        isAdmin: false
      };
      const request = await fetch(`http://192.168.0.170:3001/api/updateuser/${user._id}`, {
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(params)
      })
      if(!request.ok) {
        throw new Error('Request is failed !')
      }else {
        const response = await request.json()
        console.log(response);
        dispatch(changeUserInfo(response.user))
        Alert.alert({title:"Success",message:"User is successfully updated"})
        navigation.goBack()
        setLoading(false)
      }
    }
   }
   catch(err) {
    Alert.alert({title:"Error", message:err.message})
    setLoading(false)
   }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('edit_profile')}
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
          <ScrollView contentContainerStyle={styles.contain}>
            <Image source={ UserImage} style={styles.thumb} />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('name')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setName(text)}
              placeholder={t('Name')}
              value={name}
              success={success.name}
              onFocus={() => {
                setSuccess({
                  ...success,
                  name: true,
                });
              }}
            />
              <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('Surname')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setSurname(text)}
              placeholder={t('Surname')}
              value={surname}
              success={success.surname}
              onFocus={() => {
                setSuccess({
                  ...success,
                  surname: true,
                });
              }}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('email')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setEmail(text)}
              placeholder={t('Email')}
              value={email}
              success={success.email}
              onFocus={() => {
                setSuccess({
                  ...success,
                  email: true,
                });
              }}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setPassword(text)}
              placeholder={t('password')}
              value={password}
              success={success.password}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
            />
          </ScrollView>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button loading={loading} full onPress={onUpdate}>
              {t('confirm')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
