import React, {useState,useEffect} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView, Text, Button, Image} from '@components';
import styles from './styles';
import Swiper from 'react-native-swiper';
import {BaseColor, BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';

export default function Walkthrough({navigation}) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [slide,setSlide] = useState([]);
const getAllBanners = async () => {
   try {
    const request = await fetch('https://restwell.az/api/banners');
    if(!request.ok) {
      throw new Error("Request is failed !")
    }else {
       const response = await request.json();
       const filterRes = response.filter((_, index) => index < 4).map(re => {
         return {
           key: re._id,
           image: re.image
         }
       })
       setSlide(filterRes)
    }
   }catch(err) {
    Alert.alert({type:"error", title:"Error", message: err.message})
   }
}
  useEffect(() => {
    getAllBanners()
  } ,[])
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <ScrollView
        contentContainerStyle={styles.contain}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={styles.wrapper}>
          {/* Images Swiper */}
          <Swiper
            dotStyle={{
              backgroundColor: BaseColor.dividerColor,
            }}
            activeDotColor={colors.primary}
            paginationStyle={styles.contentPage}
            removeClippedSubviews={false}>
            {slide.length > 0 && slide.map((item, index) => {
              return (
                <View style={styles.slide} key={item.key}>
                  <Image source={{uri: item.image}} style={styles.img} />
                  <Text body1 style={styles.textSlide}>
                    {t('pick_your_destication')}
                  </Text>
                </View>
              );
            })}
          </Swiper>
        </View>
        <View style={{width: '100%'}}>
          <Button
            full
            style={{marginTop: 20}}
            onPress={() => navigation.navigate('SignIn')}>
            {t('sign_in')}
          </Button>
          <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text body1 grayColor>
                {t('not_have_account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
