import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';


import Header from '../../components/Header';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import { StarRating } from '../../components/StarRating';




import {API_URL} from "@env"
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { userInfo } from '../../selectors';
import { Alert } from 'react-native';

function Feedback({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const item = route?.params.item.reviews
  const user = useSelector(userInfo);
 
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState([5,5,5,5]);
  const [reviews, setReviews] = useState(['','','','']);
  const [state] = useState(["according_to_the_service","for_the_price", "general","according_to_the_portion"])
  const [success, setSuccess] = useState({
    title: true,
    reviews: true,
  });

  /**
   * @description Called when user sumitted form
   * @author RG Agency <rgagency.org>
   * @date 2019-08-03
   */
  const onSubmit = async () => {
    try {
      if (reviews[0] == '' || reviews[1] == '' || reviews[2] == '' || reviews[3] == '') {
        setSuccess({
          ...success,
          reviews:  false,
        });
      } else {
        setLoading(true);
        const newReview = {
          messages: [{
            message: reviews[0],
            rating_count: rates[0]
          },
          {
            message: reviews[1],
            rating_count: rates[1]
          },
          {
            message: reviews[2],
            rating_count: rates[2]
          },
          {
            message: reviews[3],
            rating_count: rates[3]
          }
        ],
          user_name: user.name,
          user_image: user.image,  
          publish_date: new Date().toLocaleDateString()
        }
        const request = await fetch(`${API_URL}/api/newreview/${item._id}`, {
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
          Alert.alert({type:'success',title:'Gözləmədədir', message: 'Rəyiniz idarəçilər tərəfindən yoxlandıqdan sonra hamıya açıq olacaq '})
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
              size={26}
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
         {state.map((et, index) => (
           <ScrollView
           contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
            <Text style={{fontSize:22}}>{t(et)}</Text>
           <View style={{ width: 160 }}>
             
             <StarRating
               starSize={26}
               maxStars={5}
               rating={rates[index]}
               selectedStar={rating => {
                 setRates(rates => rates.map((ra, i) => {
                   if(i === index) {
                    ra = rating
                   }
                   return ra
                 }));
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
             onChangeText={text => setReviews(reviews => reviews.map((rev, i) => {
               if(index === i) {
                rev = text
               }
               return rev
             }))}
             textAlignVertical="top"
             multiline={true}
             success={success.reviews}
             placeholder={t('input')}
             value={reviews[index]}
           />
         </ScrollView>
         ))}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
export default Feedback