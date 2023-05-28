import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Alert, TouchableOpacity } from 'react-native';
import styles from "../../screens/Home/styles";

import { useTranslation } from 'react-i18next';
import * as Utils from '@utils';
import {
    Placeholder,
    PlaceholderLine,
    Progressive,
    PlaceholderMedia
} from 'rn-placeholder';

import SeeMoreIcon from '../SeeMoreIcon';
import Icon from '../Icon';
import Text from '../Text'
import { BaseColor, useTheme } from '@config';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const navigation = useNavigation()
    const { colors } = useTheme();
    const { t } = useTranslation();
    const getAllCategories = async () => {
        try {
            const request = await axios.get('https://restwell.az/api/categories');
            if (request.status !== 200) {
                throw new Error('Request is failed !')
            }
            const response = request.data;
            setCategories(response);
        } catch (err) {
            Alert.alert({ type: 'error', title: "Error", message: err.message })
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [])
    return (
        <>
            {categories.length > 0 ? <View style={styles.serviceContent}>
                {categories.filter((_, index) => index < 7).map(item => {
                    return (
                        <TouchableOpacity
                            key={`category${item._id}`}
                            style={[
                                styles.serviceItem,
                                { width: Utils.getWidthDevice() * 0.24 },
                            ]}
                            onPress={() => {
                                navigation.navigate('List', { item: item.name })

                            }}>
                            <View
                                style={[
                                    styles.serviceCircleIcon,
                                    { backgroundColor: item.color },
                                ]}>
                                <Icon
                                    name={Utils.iconConvert(item.icon)}
                                    size={32}
                                    color={BaseColor.whiteColor}
                                    solid
                                />
                            </View>
                            <Text footnote numberOfLines={1} >
                                {t(item.name)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity
                    key={`category_all`}
                    style={[
                        styles.serviceItem,
                        { width: Utils.getWidthDevice() * 0.24 },
                    ]}
                    onPress={() => {
                        navigation.navigate('Category');
                    }}>
                    <View
                        style={[
                            styles.serviceCircleIcon,
                            { backgroundColor: "red" },
                        ]}>
                        <SeeMoreIcon
                            name={Utils.iconConvert("dots-three-vertical")}
                            size={20}
                            color={BaseColor.whiteColor}
                            solid
                        />
                    </View>
                    <Text footnote numberOfLines={1}>
                        {t('Daha çox')}
                    </Text>
                </TouchableOpacity>
            </View> : <View style={styles.serviceContent}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                    return (
                        <View
                            style={{
                                width: (Utils.getWidthDevice() - 40) * 0.25,
                                marginBottom: 8,
                            }}
                            key={`category${item}`}>
                            <Placeholder Animation={Progressive}>
                                <View style={{ alignItems: 'center' }}>
                                    <PlaceholderMedia style={styles.serviceCircleIcon} />
                                    <PlaceholderLine
                                        style={{ width: '50%', height: 8, marginTop: 2 }}
                                    />
                                </View>
                            </Placeholder>
                        </View>
                    );
                })}
            </View>}
        </>
    )
}
