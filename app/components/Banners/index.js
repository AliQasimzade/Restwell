import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Alert } from 'react-native';
import {
    Placeholder,
    PlaceholderLine,
    Loader
} from 'rn-placeholder';
import {API_URL} from '@env';
import Swiper from 'react-native-swiper';
import { useTheme } from '@config';
import Image from "../Image"
import styles from '../../screens/Home/styles';
function Banners (){
    const [banners, setBanners] = useState([]);
    const { colors } = useTheme();
    const getBanners = async () => {
        try {
            const request = await axios.get(`${API_URL}/api/banners`);
            if (request.status !== 200) {
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


export default Banners

