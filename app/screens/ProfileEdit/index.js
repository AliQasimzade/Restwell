
import React, { useState } from 'react';
import UserImage from '../../../assets/userimage.png'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Image from '../../components/Image';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import { Button } from '../../components/Button';
import TextInput from '../../components/TextInput'
import styles from './styles';
import { userInfo } from '../../selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeUserInfo } from '../../actions/user';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { API_URL, API_GOOGLE_KEY, APP_MEASUREMENT_ID, API_AUTH_DOMAIN, API_PROJECT_ID, API_STORAGE_BUCKET, API_MESSAGING_SENDER_ID, API_APP_ID } from "@env";



function ProfileEdit({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
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
  const [profileImage, setProfileImage] = useState(user.image)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    surname: true,
    password: true,
    profileImage: true
  });

  /**
   * on Update Profile
   **/


  const firebaseConfig = {
    apiKey: API_GOOGLE_KEY,
    authDomain: API_AUTH_DOMAIN,
    projectId: API_PROJECT_ID,
    storageBucket: API_STORAGE_BUCKET,
    messagingSenderId: API_MESSAGING_SENDER_ID,
    appId: API_APP_ID,
    measurementId: APP_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);


  async function pickAndUploadProfileImage() {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [1, 1],
        quality: 1,
      });

      const response = await fetch(result.uri);

      const blob = await response.blob();
      const fileName = result.uri.substring(result.uri.lastIndexOf("/") + 1);
      const fileExtension = fileName.split(".").pop();

      const fileRef = ref(storage, `images/${fileName}.${fileExtension}`);

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error("Upload error: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileImage(downloadURL);
        }
      );

    } else {
      console.log('Media Library permission not granted');
    }
  }




  const onUpdate = async () => {
    setLoading(true);
    try {
      if (name == '' || email == '' || password == '' || surname == '' || profileImage.length == 0) {
        setSuccess({
          ...success,
          name: name != '' ? true : false,
          email: email != '' ? true : false,
          surname: surname != '' ? true : false,
          password: password != '' ? true : false,
          profileImage: profileImage != '' ? true : false,
        });
        setLoading(false)
        return;
      } else if (name == user.name && surname == user.surname && email == user.email && password == user.password && profileImage == user.image) {
        Alert.alert({ title: "Warning", message: "Hec bir deyisiklik olmayib" })
        setLoading(false)
        return;
      } else {
        const params = {
          name,
          email,
          surname,
          password,
          image: profileImage,
          isAdmin: false
        };
        const request = await fetch(`${API_URL}/api/updateuser/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(params)
        })
        if (!request.ok) {
          throw new Error('Request is failed !')
        } else {
          const response = await request.json()
          dispatch(changeUserInfo(response.user))
          Alert.alert({ title: "Success", message: "User is successfully updated" })
          navigation.goBack()
          setLoading(false)
        }
      }
    }
    catch (err) {
      Alert.alert({ title: "Error", message: err.message })
      setLoading(false)
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('edit_profile')}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.contain}>
            {user?.image ? <Image source={{ uri: user?.image }} style={styles.thumb} /> : <Image source={UserImage} style={styles.thumb} />}
            <View style={styles.editIconWrapper}>
              <TouchableOpacity onPress={pickAndUploadProfileImage}>
                <Icon name="pen" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

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
              placeholder={t('surname')}
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
            {user?.password && <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('password')}
              </Text>
            </View>}
            {user?.password && <TextInput
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
            />}
          </ScrollView>
          <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
            <Button loading={loading} full onPress={onUpdate}>
              {t('confirm')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export default ProfileEdit