import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  TextInput,
} from '@components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { userInfo } from '@selectors';
import { Alert } from 'react-native';

export default function Feedback({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const item = route?.params.item.reviews
  const user = useSelector(userInfo);
 
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(5);
  const [review, setReview] = useState('');
  const [success, setSuccess] = useState({
    title: true,
    review: true,
  });

  /**
   * @description Called when user sumitted form
   * @author Passion UI <rgagency.org>
   * @date 2019-08-03
   */
  const onSubmit = async () => {
    try {
      if (review == '') {
        setSuccess({
          ...success,
          review: review != '' ? true : false,
        });
      } else {
        setLoading(true);
        const newReview = {
          message: review,
          rating_count: rate,
          user_name: user.name,
          user_image: user.image,  
          publish_date: new Date().toLocaleDateString()
        }
        const request = await fetch(`https://restwell.az/api/newreview/${item._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview)
        })
        if (!request.ok) {
          throw new Error("Request is failed !")
        } else {
          const response = await request.json()
          route?.params.item.setReviews(response.listing)
          Alert.alert({title:'Success', message: 'Added Successfuly '})
          setLoading(false)
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }

      }
    }catch(err) {
      Alert.alert({title:'Xeta', message: err.message})
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('feedback')}
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
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('save')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          onSubmit();
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
            {/* <Image
              source={user.image}
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
              }}
            /> */}
            <View style={{ width: 160 }}>
              <StarRating
                starSize={26}
                maxStars={5}
                rating={rate}
                selectedStar={rating => {
                  setRate(rating);
                }}
                fullStarColor={BaseColor.yellowColor}
                containerStyle={{ padding: 5 }}
              />
              <Text caption1 grayColor style={{ textAlign: 'center' }}>
                {t('tap_to_rate')}
              </Text>
            </View>
            <TextInput
              style={{ marginTop: 10, height: 150 }}
              onChangeText={text => setReview(text)}
              textAlignVertical="top"
              multiline={true}
              success={success.review}
              placeholder={t('input')}
              value={review}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
