import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, Alert } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import RateDetail from '../../components/RateDetail';
import CommentItem from '../../components/CommentItem';
import Text from '../../components/Text';
import Icon from '../../components/Icon'
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from "@env"
function Review({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [totalStars, setTotalStars] = useState([])
  const [reviews, setReviews] = useState([])


  useEffect(() => {
    const getListings = async () => {
      try {
        const req = await axios.get(`${API_URL}/api/listings`)
        if (req.status !== 200) {
          throw new Error('Request failed !')
        } else {
          const res = req.data
          const findByid = res.find(re => re._id === route?.params.item)
          setReviews(findByid)

          const oneStarsCounts = findByid.reviews.map(r => {
            if (r.verify) {
              return r
            }

          }).filter(Boolean).map(review => review.messages).flat(Infinity).map(message => {
            if (message.rating_count === 1) {
              return message.rating_count
            }
          }).filter(Boolean)
          const twoStarsCounts = findByid.reviews.map(r => {
            if (r.verify) {
              return r
            }

          }).filter(Boolean).map(review => review.messages).flat(Infinity).map(message => {
            if (message.rating_count === 2) {
              return message.rating_count
            }
          }).filter(Boolean)
          const threeStarsCounts = findByid.reviews.map(r => {
            if (r.verify) {
              return r
            }

          }).filter(Boolean).map(review => review.messages).flat(Infinity).map(message => {
            if (message.rating_count === 3) {
              return message.rating_count
            }
          }).filter(Boolean)
          const fourStarsCounts = findByid.reviews.map(r => {
            if (r.verify) {
              return r
            }

          }).filter(Boolean).map(review => review.messages).flat(Infinity).map(message => {
            if (message.rating_count === 4) {
              return message.rating_count
            }
          }).filter(Boolean)
          const fiveStarsCounts = findByid.reviews.map(r => {
            if (r.verify) {
              return r
            }

          }).filter(Boolean).map(review => review.messages).flat(Infinity).map(message => {
            if (message.rating_count === 5) {
              return message.rating_count
            }
          }).filter(Boolean)

          const total = [oneStarsCounts.length, twoStarsCounts.length, threeStarsCounts.length, fourStarsCounts.length, fiveStarsCounts.length]

          setTotalStars(total)
          setLoading(false)
        }

      } catch (err) {
        Alert.alert({ type: "Warning", title: "Error", message: err.message })
      }
    }
    getListings()

  }, [])
  /**
   * on Load data
   *
   */

  /**
   * on Refresh commemt
   */
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 1000);
  };

  /**
   * render content
   * @returns
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerView}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={reviews?.reviews.map(r => {
          if (r.verify) {
            return r
          }
        }).filter(Boolean) ?? []}
        keyExtractor={(item, index) => `review ${index}`}
        ListHeaderComponent={() => (
          <RateDetail
            point={reviews.rating_avg ?? 0}
            maxPoint={5}
            totalRating={reviews.reviews.map(r => {
              if (r.verify) {
                return r.messages
              }
            }).filter(Boolean).length ?? 0}
            data={totalStars}
          />
        )}
        renderItem={({ item }) => (
          <CommentItem
            style={{ marginTop: 10 }}
            image={item.user_image}
            name={item.user_name}
            rate={item.rating_count}
            date={item.publish_date}
            comments={item.messages}
          />
        )}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('reviews')}
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
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('write')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('Feedback', { item: reviews  });
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
export default Review