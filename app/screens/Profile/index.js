import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProfileDetail from '../../components/ProfileDetail';
import { Button } from '../../components/Button';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Header from '../../components/Header';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { userInfo } from '../../selectors';
import { logOutUSer } from '../../actions/user';

function Profile({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userAbout = useSelector(userInfo)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false);

  /**
   * on Logout
   *
   */
  const onLogout = async () => {
    setLoading(true);
    dispatch(logOutUSer())
    navigation.navigate('Home')
  };

  /**
   * on onNotification
   *
   */

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('profile')}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {userAbout && <ScrollView>
          <View style={styles.contain}>
            <ProfileDetail
              image={userAbout?.image}
              textFirst={userAbout?.name}
              textSecond={userAbout?.surname}
              textThird={userAbout?.email}
            />
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                  marginTop: 15,
                },
              ]}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}>
              <Text body1>{t('edit_profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('AddListings');
              }}>
              <Text body1>{t('add_your_business')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('AboutUs');
              }}>
              <Text body1>{t('about_us')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileItem}
              onPress={() => {
                navigation.navigate('Setting');
              }}>
              <Text body1>{t('setting')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{ marginLeft: 5 }}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>}
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          <Button full loading={loading} onPress={onLogout}>
            {t('sign_out')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
export default Profile