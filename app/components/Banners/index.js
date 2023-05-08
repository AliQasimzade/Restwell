import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Alert } from 'react-native';
import {
    Placeholder,
    PlaceholderLine,
    Loader
} from 'rn-placeholder';
import Swiper from 'react-native-swiper';
import { useTheme } from '@config';
import { Image } from "@components"
import styles from '../../screens/Home/styles';
export const Banners = () => {
    const [banners, setBanners] = useState([]);
    const { colors } = useTheme();
    const getBanners = async () => {
        try {
            const request = await axios.get('http://192.168.0.123:3001/api/banners');
            if(request.status !== 200) {
                throw new Error('Request is failed !')
            }
            const response = request.data;
            setBanners(response)

        } catch (err) {
            Alert.alert({ type: 'error', title: "Error", message: err.message })
        }
    }
    useEffect(() => {
        getBanners();
    }, [])
    return (
        <>
            <Swiper
                dotStyle={{
                    backgroundColor: colors.text,
                }}
                activeDotColor={colors.primary}
                paginationStyle={styles.contentPage}
                removeClippedSubviews={false}
                autoplay={true}
                loop={true}
            >
                {banners.length > 0 ? banners.map((item, index) => {
                    return (
                        <Image
                            key={`slider${index}`}
                            source={{ uri: item.image }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    );
                }) : <Placeholder Animation={Loader}>
                    <PlaceholderLine style={{ height: '98%' }} />
                </Placeholder>}
            </Swiper>
        </>
    )
}

