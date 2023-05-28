import React, { useState, useEffect } from 'react';
import * as Location from "expo-location";
import ListItem  from "../ListItem";
import { useNavigation } from '@react-navigation/native';

function NearByMe({ listings }) {
    const [nearByMe, setNearByMe] = useState([]);
    const navigation = useNavigation();
    const getPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
        } else {
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            })

            const RADIUS = 6371;

            const latitude = currentLocation.coords.latitude
            const longitude = currentLocation.coords.longitude
            // Radius in km
            const radius = 5;

            // Haversine formula
            function haversine(lat1, lon1, lat2, lon2) {
                const dLat = toRadians(lat2 - lat1);
                const dLon = toRadians(lon2 - lon1);
                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRadians(lat1)) *
                    Math.cos(toRadians(lat2)) *
                    Math.sin(dLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = RADIUS * c;
                return d;
            }

            function toRadians(degrees) {
                return degrees * (Math.PI / 180);
            }
            const restaurants = listings;
            let nearbyRestaurants = [];

            restaurants.forEach((restaurant) => {
                const dist = haversine(latitude, longitude, restaurant.locationCoords.latitude, restaurant.locationCoords.longtitude);
                if (dist <= radius) {
                    nearbyRestaurants.push(restaurant);
                }
            });
            setNearByMe(nearbyRestaurants);
        }
    }

    useEffect(() => {
        getPermissions()
    }, [])
    return (
        <>
            {nearByMe.length > 0 ? nearByMe.map((item, index) => {
                return (
                    <ListItem
                        small
                        key={`nearbyme ${item._id}`}
                        image={item.splashscreen}
                        title={item.listingTitle}
                        subtitle={item.category}
                        rate={item.rating_avg}
                        status={item.priceRelationShip}
                        style={{ marginBottom: 15 }}
                        onPress={() => {
                            navigation.navigate('ProductDetail', {
                                item: item,
                            });
                        }}
                    />
                );
            }) : [1, 2, 3].map((item, index) => {
                return (
                    <ListItem
                        small
                        loading={true}
                        key={`recent${item}`}
                        style={{ marginBottom: 15 }}
                    />
                );
            })}
        </>
    )
}
export default NearByMe