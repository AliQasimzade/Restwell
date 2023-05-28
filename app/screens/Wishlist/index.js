import React, {useState} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import ListItem from '../../components/EventListItem';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import {wish} from '../../selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import styles from './styles';
import { removeAllWish, removeWish } from '../../actions/wish';

function Wishlist({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const wishlist = useSelector(wish);
  const [modalVisible, setModalVisible] = useState(false);

  const [refreshing, setRefresh] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionItem, setActionItem] = useState(null);

  /**
   * Reload wishlist
   */
  const onRefresh = () => {
    setRefresh(false);
  };

  /**
   * Action Delete/Reset
   */
  const onDelete = it => {
    setDeleting(true);
    const id = it._id
    setTimeout(() => {
      dispatch(removeWish(id));
      setDeleting(false);
    }, 1000);
  };

  const onDeleteAll = () => {
    setDeleting(true);
    setTimeout(() => {
      dispatch(removeAllWish())
      setDeleting(false);
    }, 1000);
  
  }

 

  /**
   * render UI Modal action
   * @returns
   */
  const renderModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setActionItem(null);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <SafeAreaView
          style={[styles.contentFilterBottom, {backgroundColor: colors.card}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setModalVisible(false);
              setActionItem(null);
            }}>
            <Icon name="times" size={18} color={colors.text} />
          </TouchableOpacity>
         
          <TouchableOpacity
            style={[styles.contentActionModalBottom]}
            onPress={() => {
              setModalVisible(false);
              onDelete(actionItem);
            }}>
            <Icon name="trash-alt" size={18} color={colors.text} />
            <Text body2 semibold style={{marginLeft: 15}}>
              {t('remove')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  };

  /**
   * render content wishlist
   * @returns
   */
  const renderContent = () => {
    if (wishlist.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{paddingTop: 15}}
          style={styles.contentList}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={wishlist}
          keyExtractor={(item, index) => `wishlist ${index}`}
          renderItem={({item, index}) => (
            <ListItem
              small
              enableAction={true}
              image={item.splashscreen}
              title={item.listingTitle}
              subtitle={item.category}
              rate={item.rating_avg}
              status={item.priceRelationShip}
              style={{marginBottom: 15}}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  item: item,
                })
              }
              omPressMore={() => {
                setActionItem(item);
                setModalVisible(true);
              }}
            />
          )}
        />
      );
    }
    if (wishlist.length == 0) {
      return (
        <View style={styles.loadingContent}>
          <View style={{alignItems: 'center'}}>
            <Icon
              name="frown-open"
              size={18}
              color={colors.text}
              style={{marginBottom: 4}}
            />
            <Text>{t('data_not_found')}</Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={{paddingTop: 15}}
        style={styles.contentList}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={[1, 2, 3, 4, 5, 6, 7, 8]}
        keyExtractor={(item, index) => `empty ${index}`}
        renderItem={({item, index}) => (
          <ListItem small loading={true} style={{marginBottom: 15}} />
        )}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('wishlist')}
        renderRight={() => {
          if (deleting) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
          return <Icon name="trash-alt" size={16} color={colors.text} />;
        }}
        onPressRight={() => onDeleteAll()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        {renderModal()}
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
export default Wishlist