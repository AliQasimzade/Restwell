import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { Alert,View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {ListItem,EventListItem,Text} from "@components";
import styles from "@screens/Home/styles";

export default function Events() {
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();
    const {t} = useTranslation()
    const getAllEvents = async () => {
        try {
            const request = await axios.get('http://192.168.0.123:3001/api/events');
            if (request.status !== 200) {
                throw new Error('Request is failed !')
            } else {
                const response = request.data;

                setEvents(response.length > 0 ? response : null)
            }
        } catch (err) {
            Alert.alert({ type: 'error', title: 'Error', message: err.message })
        }
    }
    useEffect(() => {
        getAllEvents();
    }, [])
    return (
        <>
        {events == null ? <View style={styles.centerView}>
        <View style={{ alignItems: 'center', paddingBottom: 8 }}>
          <Text>{t('data_not_found')}</Text>
        </View>
      </View> : events.length > 0 ? events.map((item, index) => {
        return (
          <EventListItem
            small
            key={`event${item._id}`}
            image={item.image}
            title={item.name}
            status={item.locationName}
            style={{ marginBottom: 15 }}
            onPress={() => {
              navigation.navigate('EventDetail', {
                item: item
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
