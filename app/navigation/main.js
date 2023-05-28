import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BaseColor, useTheme, useFont } from '@config';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import { designSelect, userInfo } from '../selectors';
import { useSelector } from 'react-redux';

/* Bottom Screen */
import Home from '../screens/Home';
import Wishlist from '../screens/Wishlist';
import Profile from '../screens/Profile';

/* Stack Screen */
import ThemeSetting from '../screens/ThemeSetting';
import Setting from '../screens/Setting';
import Category from '../screens/Category';
import List from '../screens/List';
import Review from '../screens/Review';
import Feedback from '../screens/Feedback';
import Walkthrough from '../screens/Walkthrough';
import ProfileEdit from '../screens/ProfileEdit';
import ChangeLanguage from '../screens/ChangeLanguage';
import ProductDetail from '../screens/ProductDetail';
import ContactUs from '../screens/ContactUs';
import AboutUs from '../screens/AboutUs';
import EventDetail from '../screens/EventDetail';
import LocationList from "../screens/LocationList";
import FilterSearchList from "../screens/FilterSearchList"

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {

  const design = useSelector(designSelect);
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

  /**
   * Main follow return  Product detail design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportList = value => {
    switch (value) {
      default:
        return List;
    }
  };

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabNavigator">
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="List" component={exportList(design)} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="Review" component={Review} />
      <MainStack.Screen name="Feedback" component={Feedback} />
      <MainStack.Screen name="EventDetail" component={EventDetail} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="FilterSearchList" component={FilterSearchList} />

      <MainStack.Screen
        name="ProductDetail"
        component={exportProductDetail(design)}
      />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      <MainStack.Screen name="LocationList" component={LocationList} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const font = useFont();
  const design = useSelector(designSelect);


  /**
   * Main follow return  Home Screen design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportHome = value => {
    switch (value) {
      default:
        return Home;
    }
  };

  /**
   * Main follow return  WishList Screen design you are selected
   * @param {*} value  ['basic', 'real_estate','event', 'food']
   * @returns
   */
  const exportWishlist = value => {
    if (!userAbout) {
      return Walkthrough;
    }
    switch (value) {
      default:
        return Wishlist;
    }
  };
  const userAbout = useSelector(userInfo)
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          height: 100
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
          paddingBottom: 2,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={exportHome(design)}
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="home" size={28} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Category"
        component={Category}
        options={{
          title: t('category'),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="clipboard-list" size={28} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="Wishlist"
        component={exportWishlist(design)}
        options={{
          title: t('wishlist'),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="bookmark" size={28} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={userAbout ? Profile : Walkthrough}
        options={{
          title: t('account'),
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="user-circle" size={28} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
