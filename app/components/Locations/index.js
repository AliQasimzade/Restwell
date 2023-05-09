import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FlatList, View } from 'react-native';
import { Card, Text } from '@components';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
    Placeholder,
    Progressive,
    PlaceholderMedia,
} from 'rn-placeholder';

import styles from '@screens/Home/styles'
export default function Locations({ listings }) {
    const [locations, setLocations] = useState([]);
    const navigation = useNavigation();

    const getAllLocations = async () => {
        try {
            const request = await axios.get('https://restwell.az/api/locations');

            if (request.status !== 200) {
                throw new Error('Request is failed !')
            } else {
                const response = request.data;
                setLocations(response);
            }
        } catch (err) {

        }
    }

    useEffect(() => {
        getAllLocations();
    }, [])
    return (
        <>
            {locations.length > 0 ? <FlatList
                contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={locations}
                keyExtractor={(item, index) => `locations ${index}`}
                renderItem={({ item, index }) => {
                    return (
                        <Card
                            style={[styles.popularItem, { marginLeft: 15 }]}
                            image={item.image}
                            onPress={() => {

                                navigation.navigate('LocationList', { item: item.name, listings: listings });
                            }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#000000a8', 'transparent']}
                                style={styles.gradient}
                            >
                                <Text headline semibold style={{ color: 'white' }}>
                                    {item.name}
                                </Text>
                            </LinearGradient>
                        </Card>
                    );
                }}
            /> : <FlatList
                contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={[1, 2, 3, 4, 5]}
                keyExtractor={(item, index) => `Popular ${index}`}
                renderItem={({ item, index }) => {
                    return (
                        <View style={[styles.popularItem, { marginLeft: 15 }]}>
                            <Placeholder Animation={Progressive}>
                                <PlaceholderMedia
                                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                />
                            </Placeholder>
                        </View>
                    );
                }}
            />}
        </>
    )
}
