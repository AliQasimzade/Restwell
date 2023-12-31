import React, { useEffect } from 'react';
import { StatusBar, Platform, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useTheme, BaseSetting } from '@config';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useSelector } from 'react-redux';
import { languageSelect, designSelect } from '../selectors';

/* Main Stack Navigator */
import Main from 'app/navigation/main';
import AddListings from '../screens/AddListings';
/* Modal Screen only affect iOS */
import Loading from '../screens/Loading';
import DeleteAccount from '../screens/DeleteAccount';
import Filter from '../screens/Filter';
import PickerScreen from '../screens/PickerScreen';
import SearchHistory from '../screens/SearchHistory';
import PreviewImage from '../screens/PreviewImage';
import SelectDarkOption from '../screens/SelectDarkOption';
import SelectFontOption from '../screens/SelectFontOption';
import AlertScreen from '../screens/Alert';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ResetPassword from '../screens/ResetPassword';
import ProductDetail from '../screens/ProductDetail';

const RootStack = createStackNavigator();

export default function Navigator() {
  const language = useSelector(languageSelect);
  const design = useSelector(designSelect);

  const { theme, colors } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  /**
   * init language
   */
  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
      compatibilityJSON: 'v3',
    });
  }, []);

  /**
   * when reducer language change
   */
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  /**
   * when theme change
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [colors.primary, isDarkMode]);

  /**
   * Main follow return SearchHistory design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportSearchHistory = value => {
    switch (value) {
      default:
        return SearchHistory;
    }
  };

  /**
   * Main follow return  Product detail design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportProductDetail = value => {
    switch (value) {
      default:
        return ProductDetail;
    }
  };

  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Loading">
        <RootStack.Screen
          name="Loading"
          component={Loading}
          options={{ gestureEnabled: false }}
        />
        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
        <RootStack.Screen
          name="Alert"
          component={AlertScreen}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen name="Filter" component={Filter} />
        <RootStack.Screen name="AddListings" component={AddListings} />
        <RootStack.Screen name="PickerScreen" component={PickerScreen} />
        <RootStack.Screen
          name="SearchHistory"
          component={exportSearchHistory(design)}
        />
        <RootStack.Screen
          name="ProductDetail"
          component={exportProductDetail(design)}
        />
        <RootStack.Screen name="PreviewImage" component={PreviewImage} />
        <RootStack.Screen
          name="SelectDarkOption"
          component={SelectDarkOption}
          gestureEnabled={false}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          }}
        />

        <RootStack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          gestureEnabled={false}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          }}
        />
        <RootStack.Screen
          name="SelectFontOption"
          component={SelectFontOption}
          gestureEnabled={false}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
