import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  RateDetail,
  CommentItem,
} from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { userInfo } from '@selectors';
import { useDispatch } from 'react-redux';
import { productActions } from '@actions';

export default function Review({ navigation, route }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let rew = route?.params
  console.log(rew, "Review Page")

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [totalStars, setTotalStars] = useState([])

  useEffect(() => {
    dispatch(
      productActions.onLoadReview({}, item => {
        setData(item);
        setLoading(false);
        setRefreshing(false);
      }),
    );
  }, [dispatch]);

  
  useEffect(() => {
    const oneStarsCounts = rew?.item.reviews.map(review => {
      if (review.rating_count == 1) {
        return review.rating_count
      }
    }).filter(Boolean)
    // console.log(oneStarsCounts, "Review Page");
    const twoStarsCounts = rew?.item.reviews.map(review => {
      if (review.rating_count == 2) {
        return review.rating_count
      }
    }).filter(Boolean)
    const threeStarsCounts = rew?.item.reviews.map(review => {
      if (review.rating_count == 3) {
        return review.rating_count
      }
    }).filter(Boolean)
    const fourStarsCounts = rew?.item.reviews.map(review => {
      if (review.rating_count == 4) {
        return review.rating_count
      }
    }).filter(Boolean)
    const fiveStarsCounts = rew?.item.reviews.map(review => {
      if (review.rating_count == 5) {
        return review.rating_count
      }
    }).filter(Boolean)
    const total = [oneStarsCounts.length, twoStarsCounts.length, threeStarsCounts.length, fourStarsCounts.length, fiveStarsCounts.length]

    setTotalStars(total)

  }, [])
  /**
   * on Load data
   *
   */
  const loadData = () => {
    dispatch(
      productActions.onLoadReview({}, item => {
        setData(item);
        setLoading(false);
        setRefreshing(false);
      }),
    );
  };

  /**
   * on Refresh commemt
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
        data={rew?.item.reviews ?? []}
        keyExtractor={(item, index) => `review ${index}`}
        ListHeaderComponent={() => (
          <RateDetail
            point={rew?.item.rating_avg ?? 0}
            maxPoint={5}
            totalRating={rew?.item.reviews.length ?? 0}
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
            comment={item.message}
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
              size={20}
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
          navigation.navigate('Feedback', { item: rew });
        }}
      />
     <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
