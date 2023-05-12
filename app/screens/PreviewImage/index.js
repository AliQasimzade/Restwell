import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import Swiper from 'react-native-swiper';
import {Image, Header, SafeAreaView, Icon, Text} from '@components';
import styles from './styles';

export default function PreviewImage({navigation, route}) {
  const {colors} = useTheme();

  let flatListRef = null;
  let swiperRef = null;

  const [images, setImages] = useState(route.params?.gallery ?? []);
  console.log(images, "Gallery Page !")
  const [indexSelected, setIndexSelected] = useState(0);


  /**
   * call when select image
   *
   * @param {*} indexSelected
   */
  const onSelect = indexSelected => {
    setIndexSelected(indexSelected);
   
    flatListRef.scrollToIndex({
      animated: true,
      index: indexSelected,
    });
  };

  /**
   * @description Called when image item is selected or activated
   * @author Passion UI <rgagency.org>
   * @date 2019-08-03
   * @param {*} touched
   * @returns
   */
  const onTouchImage = touched => {
    if (touched == indexSelected) return;
    swiperRef.scrollBy(touched - indexSelected, false);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        barStyle="light-content"
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <Swiper
          ref={ref => {
            swiperRef = ref;
          }}
          dotStyle={{
            backgroundColor: BaseColor.dividerColor,
          }}
          paginationStyle={{bottom: 0}}
          loop={false}
          activeDotColor={colors.primary}
          removeClippedSubviews={false}
          onIndexChanged={index => onSelect(index)}>
          {images.map((item, index) => {
            return (
              <Image
                key={`image${index}`}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
                source={{uri: item}}
              />
            );
          })}
        </Swiper>
        <View
          style={{
            paddingVertical: 10,
          }}>
          <View style={styles.lineText}>
            <Text body2 whiteColor>
              {indexSelected + 1}/{route?.params.gallery.length}
            </Text>
          </View>
          <FlatList
            ref={ref => {
              flatListRef = ref;
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={images}
            keyExtractor={(item, index) => `PreviewImage ${index}`}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  onTouchImage(index);
                }}
                activeOpacity={0.9}>
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    marginLeft: 20,
                    borderRadius: 8,
                    borderColor:
                      index == indexSelected
                        ? colors.primaryLight
                        : BaseColor.grayColor,
                    borderWidth: 1,
                  }}
                  source={{uri: item}}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
