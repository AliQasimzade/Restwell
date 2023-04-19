import React, { useState, useEffect } from 'react';
import { View, ScrollView, ImageBackground, FlatList, Alert, Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, Images, useTheme } from '@config';
import * as Utils from '@utils';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [ourTeam, setOurTeam] = useState([]);
  const onOpen = (type, link) => {
    switch (type) {
      case 'social':
        Linking.openURL(link)
        break;
      case 'phone':
        Linking.openURL('tel://' + link);
        break;
        case 'email':
          Linking.openURL('mailto:' + link)
    }
  };
  useEffect(() => {
    const getCompany = async () => {
      try {
        const request = await fetch('https://restwell.az/api/company')
        if (!request.ok) {
          throw new Error('Request is Failed !')
        } else {
          const response = await request.json()
          setOurTeam(response)
          console.log(response, "About Page !");
        }
      } catch (err) {
        Alert.alert({ title: "Error", message: err.message })
      }

    }
    getCompany()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('about_us')}
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
        {ourTeam.length > 0 && <ScrollView style={{ flex: 1 }}>
          <ImageBackground source={{ uri: ourTeam[0].splashScreen }} style={styles.banner}>
            <Text title1 semibold whiteColor>
              {t('about_us')}
            </Text>
            <Text subhead whiteColor>
              {t('sologan_about_us')}
            </Text>
          </ImageBackground>
          <View style={styles.content}>
            <Text headline semibold>
              {t('Name').toUpperCase()}
            </Text>
            <Text body2 style={{ marginTop: 5 }}>
              {ourTeam[0].name}
            </Text>
            <TouchableOpacity onPress={() => onOpen('email', ourTeam[0].email)}>
            <Text headline semibold style={{ marginTop: 20, marginBottom: 10 }}>
              {t('Email').toUpperCase()}
            </Text>
            <Text>{ourTeam[0].email}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => onOpen('phone', ourTeam[0].phone)}>
              <Text headline semibold style={{ marginTop: 20, marginBottom: 10 }} >
                {t('phone').toUpperCase()}
              </Text>
              <ScrollView horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <Icon name="mobile-alt" size={16} style={{ marginRight: 5 }} />
                <Text>{ourTeam[0].phone}</Text>
              </ScrollView>

            </TouchableOpacity>
          </View>
          <Text headline semibold style={styles.title}>
            {t('Social Links').toUpperCase()}
          </Text>
          <ScrollView
            horizontal={true}
            style={{ paddingLeft: 13 }}
            showsHorizontalScrollIndicator={false}>
            {ourTeam[0].socialLinks.map((link, index) => (
              <Icon
                key={index}
                name={Utils.iconConvert(link.name)}
                size={30}
                color={link.color}
                onPress={() => onOpen('social', link.link)}
                style={{ margin: 4 }}
                solid
              />
            ))}
          </ScrollView>
            <View >
              <Text headline semibold style={{ marginTop: 20, marginBottom: 10,marginLeft: 15 }}>
                {t('address').toUpperCase()}
              </Text>
              <ScrollView horizontal={true}
                style={{ paddingLeft: 13 }}
                showsHorizontalScrollIndicator={false}>
                  <Icon
                    name="map-marker-alt"
                    size={16}
                    style={{marginTop: 5,marginRight: 5}}
                  />
                <Text footnote semibold style={{ marginTop: 5 }}>
                  {ourTeam[0].address}
                </Text>
              </ScrollView>
            </View>

            <View >
              <Text headline semibold style={{ marginTop: 20, marginBottom: 10,marginLeft: 15 }}>
                {t('Terms and Conditions').toUpperCase()}
              </Text>

                <Text footnote semibold style={{ marginTop: 5,marginLeft: 15 }}>
                  {ourTeam[0].termsAndConditions}
                </Text>

            </View>

            <View >
              <Text headline semibold style={{ marginTop: 20, marginBottom: 10,marginLeft: 15 }}>
                {t('Privacy Policy').toUpperCase()}
              </Text>

                <Text footnote semibold style={{ marginTop: 5,marginLeft: 15 }}>
                  {ourTeam[0].privacyPolicy}
                </Text>

            </View>
        </ScrollView>}
      </SafeAreaView>
    </View>
  );
}
