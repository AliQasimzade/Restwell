import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert
} from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@config';
import {
  Header,
  Icon,
  Text,
  TextInput,
} from '@components';
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet } from 'react-native';
import CheckboxGroup from 'react-native-checkbox-group';
import { Picker } from '@react-native-picker/picker';
import { downloadAsync } from 'expo-file-system';
export default function AddListings({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedLogoImage, setSelectedLogoImage] = useState('');
  const [selectedCoverImages, setSelectedCoverImages] = useState('');
  const [selectedGalleryImages, setSelectedGalleryImages] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [slogan, setSlogan] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [Instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [prePrice, setPrePrice] = useState('');
  const [price, setPrice] = useState('');
  const [uploadVideoLink, setUploadVideoLink] = useState('');
  const [locations, setLocations] = useState([]);
  const [pricerelationShips] = useState(['₼', '₼₼','₼₼₼','₼₼₼₼','₼₼₼₼₼']);
  const [selectedPriceRelation,setSelectedPriceRelation] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null);

  //metnlerin rengi ucun 
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'white' : 'black';
  const bgColor = colorScheme === 'dark' ? 'white' : 'black';
  // dark light rejim ucun kod bitdi


  // heftenin gunler ve is vaxti ucun kodlar
  const daysOfWeek = ['Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə', 'Bazar'];
  const TimePicker = ({ selectedHour, selectedMinute, onHourChange, onMinuteChange }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0'dan 23'e kadar bir dizi
    const minutes = Array.from({ length: 60 }, (_, i) => i); // 0'dan 59'a kadar bir dizi

    return (
      <View style={styles.timePickerContainer}>
        <Picker
          style={[styles.timePicker, bgColor]}
          selectedValue={selectedHour}
          onValueChange={(itemValue) => {
            onHourChange(itemValue);
          }}
          mode="dropdown"
          itemStyle={styles.pickerItem}
        >
          {hours.map((hour) => (
            <Picker.Item
              key={hour}
              label={hour.toString().padStart(2, '0')}
              value={hour}
              color={textColor}
            />
          ))}
        </Picker>
        <Text>:</Text>
        <Picker
          style={[styles.timePicker, bgColor]}
          selectedValue={selectedMinute}
          onValueChange={(itemValue) => {
            onMinuteChange(itemValue);
          }}
          mode="dropdown"
          itemStyle={styles.pickerItem}
        >
          {minutes.map((minute) => (
            <Picker.Item
              key={minute}
              label={minute.toString().padStart(2, '0')}
              value={minute}
              color={textColor}
            />
          ))}
        </Picker>
      </View>
    );
  };
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = {
        openingTime: { hour: 0, minute: 0 },
        closingTime: { hour: 0, minute: 0 },
      };
      return acc;
    }, {}),
  );
  const results = [];
  for (let key in schedule) {
    const openingTime = schedule[key].openingTime.hour.toString().padStart(2, "0") + ":" + schedule[key].openingTime.minute.toString().padStart(2, "0");
    const closingTime = schedule[key].closingTime.hour.toString().padStart(2, "0") + ":" + schedule[key].closingTime.minute.toString().padStart(2, "0");
    results.push({ openingTime, closingTime });
  }
  const handleTimeChange = (day, timeType, field, value) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        [timeType]: { ...prevSchedule[day][timeType], [field]: value },
      },
    }));
  };
  // heftenin gunleri ve is vacti ucun kod bitdi

  useEffect(() => {
    const categories = axios.get(
      'http://192.168.0.123:3001/api/categories',
    );
    const tags = axios.get(
      'http://192.168.0.123:3001/api/tags',
    );
    const properties = axios.get(
      'http://192.168.0.123:3001/api/properties',
    );

    Promise.all([categories, tags, properties]).then(responses => {
      const [res1, res2, res3] = responses;
      setCategory(res1.data);
      setProperties(res3.data)

      const formattedTags = res2.data.map((tag) => ({
        label: tag.name,
        value: tag.name,
        selected: false,
      }));
      setTags(formattedTags);

      const formattedProperties = res3.data.map((tag) => ({
        label: tag.name,
        value: tag.name,
        selected: false,
      }));
      setProperties(formattedProperties);
    })

  }, [])

  //  location secme kodu basladi
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerInfo, setMarkerInfo] = useState({
    city: '',
    street: '',
    address: '',
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMarkerPosition(location.coords);
    })();
  }, []);

  async function fetchAddress(latitude, longitude) {
    const apiKey = 'AIzaSyCQYSi3nER3Yjmlfkxqx0HnHXlunkyNFfU';
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (response.status === 200) {
      const data = await response.json()

      if (data.status === 'OK') {
        const addressComponents = data.results[0].address_components;
        const street = addressComponents.find(
          (component) => component.types.includes('route')
        );
        const city = addressComponents.find((component) =>
          component.types.includes('locality')
        );
        const address = data.results[0].formatted_address;
        const kuceNomresi = data.results[0].address_components[0].long_name;
        const kuceAdi = data.results[0].address_components[1].long_name;
        const seherAdi = data.results[0].address_components[3].long_name;
        const tamUnvan = address;
        setStreet(`${kuceNomresi} ${kuceAdi}`)
        setCity(seherAdi)
        setAddress(tamUnvan)
        setLongitude(longitude);
        setLatitude(latitude)
        return {
          street: street ? street.long_name : '',
          city: city ? city.long_name : '',
          address,
          latitude,
          longitude,
        };
      }
    }
    return null;
  }
  const handlePress = async (e) => {
    const coords = e.nativeEvent.coordinate;
    setMarkerPosition(coords);
    const fetchedInfo = await fetchAddress(coords.latitude, coords.longitude);
    if (fetchedInfo) {
      setMarkerInfo(fetchedInfo);
    }
  };
  function renderMap() {
    if (errorMsg) {
      return (
        <View>
          <Text>{errorMsg}</Text>
        </View>
      );
    } else if (location) {
      return (
        <MapView
          style={{ flex: 1, width: '100%', height: 400 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handlePress}
        >
          {markerPosition && (
            <Marker
              coordinate={{
                latitude: markerPosition.latitude,
                longitude: markerPosition.longitude,
              }}
              title="Seçilen Konum"
            />
          )}
        </MapView>
      );
    } else {
      return (
        <View>
          <Text>Harita yükleniyor...</Text>
        </View>
      );
    }
  }
  // location kodu bitdi
  const firebaseConfig = {
    apiKey: "AIzaSyCQYSi3nER3Yjmlfkxqx0HnHXlunkyNFfU",
    authDomain: "restwellapp-9bfa9.firebaseapp.com",
    projectId: "restwellapp-9bfa9",
    storageBucket: "restwellapp-9bfa9.appspot.com",
    messagingSenderId: "469388796562",
    appId: "1:469388796562:web:8f43a85fdedbdc84f9bc4b",
    measurementId: "G-SGJ6SBH2SM"
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  // logo sekil secib gondermek
  async function pickAndUploadImagesForLogo() {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      const response = await fetch(result.uri);

      const blob = await response.blob();
      const fileName = result.uri.substring(result.uri.lastIndexOf("/") + 1);
      const fileExtension = fileName.split(".").pop();

      const fileRef = ref(storage, `images/${fileName}.${fileExtension}`);

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress: " + progress + "%");
        },
        (error) => {
          console.error("Upload error: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Upload complete. File available at: ", downloadURL);
          setSelectedLogoImage(downloadURL);
        }
      );

    } else {
      console.log('Media Library permission not granted');
    }
  }
  // logo sekil secib gondermek bitdi
  // logo sekil secib gondermek
  async function pickAndUploadImagesForCover() {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 1,
      });

      const response = await fetch(result.uri);

      const blob = await response.blob();
      const fileName = result.uri.substring(result.uri.lastIndexOf("/") + 1);
      const fileExtension = fileName.split(".").pop();

      const fileRef = ref(storage, `images/${fileName}.${fileExtension}`);

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress: " + progress + "%");
        },
        (error) => {
          console.error("Upload error: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Upload complete. File available at: ", downloadURL);
          setSelectedCoverImages(selectedCoverImages => selectedCoverImages = downloadURL);
        }
      );

    } else {
      console.log('Media Library permission not granted');
    }
  }
  // logo sekil secib gondermek bitdi
  // logo sekil secib gondermek
  async function pickAndUploadImagesForGallery() {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      const response = await fetch(result.uri);

      const blob = await response.blob();
      const fileName = result.uri.substring(result.uri.lastIndexOf("/") + 1);
      const fileExtension = fileName.split(".").pop();

      const fileRef = ref(storage, `images/${fileName}.${fileExtension}`);

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress: " + progress + "%");
        },
        (error) => {
          console.error("Upload error: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Upload complete. File available at: ", downloadURL);
          setSelectedGalleryImages([...selectedGalleryImages, downloadURL]);
        }
      );

    } else {
      console.log('Media Library permission not granted');
    }
  }
  // logo sekil secib gondermek bitdi


  // rayon pickerinin cekmeyi
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://192.168.0.123:3001/api/locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [])


  const handleTitleChange = text => {
    setTitle(text);
  };

  const handleSloganChange = text => {
    setSlogan(text);
  };

  const handleCityChange = text => {
    setCity(text);
  };

  const handleStreetChange = text => {
    setStreet(text);
  };

  const handleAddressChange = text => {
    setAddress(text);
  };

  const handleDescriptionChange = text => {
    setDescription(text);
  };

  const handlePhoneChange = text => {
    setPhone(text);
  };

  const handleEmailChange = text => {
    setEmail(text);
  };

  const handleWebsiteChange = text => {
    setWebsite(text);
  };

  const handleFacebookChange = text => {
    setFacebook(text);
  };

  const handleInstagramChange = text => {
    setInstagram(text);
  };

  const handleYoutubeChange = text => {
    setYoutube(text);
  };

  const handleWhatsappChange = text => {
    setWhatsapp(text);
  };

  const handlePrePriceChange = text => {
    setPrePrice(text);
  };

  console.log(selectedPriceRelation, 'Added')
  const handlePriceChange = text => {
    setPrice(text);
  };
  const handleUploadVideoLinkChange = text => {
    setUploadVideoLink(text);
  };
  uploadVideoLink;

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.0.123:3001/api/addnewlisting', {
        listingTitle: title,
        category: selectedCategory,
        slogan: slogan,
        type: "lastadded",
        cityorstate: city,
        priceRelationShip: selectedPriceRelation,
        roadorstreet: street,
        address: address,
        description: description,
        phone: phone,
        email: email,
        website: website,
        facebook: facebook,
        instagram: Instagram,
        youtube: youtube,
        twitter: "salam",
        whatsapp: whatsapp,
        previousprice: prePrice,
        price: price,
        uploadlink: uploadVideoLink,
        rayon: selectedLocation,
        gallery: selectedGalleryImages,
        splashscreen: selectedCoverImages,
        profileImage: selectedLogoImage,
        features: selectedProperties,
        tags: selectedTags,
        locationCoords: {
          latitude: latitude,
          longtitude: longitude
        },
        timeschedule: results
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      Alert.alert({ title: "Göndərildi", message: 'Form submitted successfully!' });
    
    } catch (error) {
      Alert.alert({ title: 'Gonderilmedi', message: "Error submitting form data" });
    }
    
    

  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header
          title={'Yeni məkan əlavə et'}
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Əsas məlumatlar</Text>
              <Icon
                style={styles.sectionHeader}
                name={'info-circle'}
                size={25}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Adı:</Text>

              <TextInput
                secureTextEntry={false}
                placeholder={'Məkanın adını daxil edin'}
                style={styles.formInput}
                value={title}
                onChangeText={handleTitleChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Kateqoriyasını seçin:</Text>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {
                  category.length > 0 &&
                  <Picker
                    selectedValue={selectedCategory}
                    style={[styles.locationPickerStyle, bgColor]}

                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  >
                    <Picker.Item label='Kateqoriyanı seçin' color={textColor} />
                    {category.map((cat) => (
                      <Picker.Item key={cat._id} label={cat.name} value={cat.name} color={textColor} />
                    ))}
                  </Picker>

                }
              </View>
            </View>


            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Qiymət münasibətini seçin:</Text>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {
                  pricerelationShips.length > 0 &&
                  <Picker
                    selectedValue={selectedPriceRelation}
                    style={[styles.locationPickerStyle, bgColor]}

                    onValueChange={(itemValue) => setSelectedPriceRelation(itemValue)}
                  >
                    <Picker.Item label='Qiymət münasibətini seçin' color={textColor} />
                    {pricerelationShips.map((cat, index) => (
                      <Picker.Item key={index} label={cat} value={cat} color={textColor} />
                    ))}
                  </Picker>

                }
              </View>
            </View>



            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Şüar:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Şüarı yazın'}
                style={styles.formInput}
                value={slogan}
                onChangeText={handleSloganChange}
              />
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Ünvan</Text>
              <Icon
                style={styles.sectionHeader}
                name={'location-arrow'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Küçə:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Küçə adını daxil edin'}
                style={styles.formInput}
                value={street}
                onChangeText={handleStreetChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Şəhər:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Şəhəri daxil edin'}
                style={styles.formInput}
                value={city}
                onChangeText={handleCityChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Tam ünvan:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Ünvanı daxil edin'}
                style={styles.formInput}
                value={address}
                onChangeText={handleAddressChange}
              />
            </View>
            {/* location picker */}
            <View>
              {locations.length > 0 ? (
                <Picker
                  style={[styles.locationPickerStyle, bgColor]}
                  selectedValue={selectedLocation}
                  onValueChange={(itemValue) => setSelectedLocation(itemValue)}
                >
                  <Picker.Item label="Məkan olduğu rayon ərazisi seçin" value={null} color={textColor} />
                  {locations.map((location, index) => (
                    <Picker.Item key={index} label={location.name} value={location.name} color={textColor} />
                  ))}
                </Picker>
              ) : (
                <Text>Yüklənir...</Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              {renderMap()}
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Detalları</Text>
              <Icon
                style={styles.sectionHeader}
                name={'paperclip'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Açıqlama:</Text>
              <TextInput
                multiline
                numberOfLines={5}
                secureTextEntry={false}
                placeholder={'Type a description'}
                value={description}
                onChangeText={handleDescriptionChange}
                style={styles.textarea}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Əlaqə nömrəsi:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'məs +994 12 345 67 89'}
                style={styles.formInput}
                value={phone}
                onChangeText={handlePhoneChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>E-poçt:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'E-poçt ünvanını daxil edin'}
                style={styles.formInput}
                value={email}
                onChangeText={handleEmailChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Vebsayt:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Vebsaytı daxil edin'}
                style={styles.formInput}
                value={website}
                onChangeText={handleWebsiteChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Facebook:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Facebook linki'}
                style={styles.formInput}
                value={facebook}
                onChangeText={handleFacebookChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Instagram:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Instagram linki'}
                style={styles.formInput}
                value={Instagram}
                onChangeText={handleInstagramChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Youtube:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Youtube linki'}
                style={styles.formInput}
                value={youtube}
                onChangeText={handleYoutubeChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Whatsapp:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Whatsapp nömrəsi'}
                style={styles.formInput}
                value={whatsapp}
                onChangeText={handleWhatsappChange}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Qiymətlər</Text>
              <Icon
                style={styles.sectionHeader}
                name={'wallet'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Ən aşağı qiymət:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'məs: 2 AZN'}
                style={styles.formInput}
                value={prePrice}
                onChangeText={handlePrePriceChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Price:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'məs: 100 AZN'}
                style={styles.formInput}
                value={price}
                onChangeText={handlePriceChange}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Teqlər</Text>
              <Icon
                style={styles.sectionHeader}
                name={'wallet'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <ScrollView>
                <CheckboxGroup
                  callback={(selected) => {
                    setSelectedTags(selected);
                  }}
                  iconColor={'white'}
                  iconSize={28}
                  checkedIcon="ios-checkbox-outline"
                  uncheckedIcon="ios-square-outline"
                  checkboxes={tags}
                  labelStyle={{
                    color: 'white',
                    marginLeft: 8,
                    marginRight: 15,
                    marginBottom: 10
                  }}
                  rowStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                  rowDirection={'column'}
                />
              </ScrollView>
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Media və görüntülər
              </Text>
              <Icon
                style={styles.sectionHeader}
                name={'vihara'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Tanıtım videonuzu əlavə edin:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'məs: www.youtube.com'}
                style={styles.formInput}
                value={uploadVideoLink}
                onChangeText={handleUploadVideoLinkChange}
              />
            </View>

            {/* logo */}
            <View style={styles.formItem}>
              <Text>Logonu seçin</Text>
              <TouchableOpacity onPress={pickAndUploadImagesForLogo}>
                <View style={{ backgroundColor: 'gray', padding: 20 }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    Maksimum {1 - (selectedLogoImage && selectedLogoImage[0].length)} şəkil seçin
                  </Text>
                </View>
                {selectedLogoImage && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 25,
                    }}>
                    {
                      selectedLogoImage &&
                      <Image
                        source={{ uri: selectedLogoImage }}
                        style={{ width: 100, height: 100, margin: 5 }}
                      />

                    }

                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* cover sekli */}
            <View style={styles.formItem}>
              <Text>Örtük şəklini seçin</Text>
              <TouchableOpacity onPress={pickAndUploadImagesForCover}>
                <View style={{ backgroundColor: 'gray', padding: 20 }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    Maksimum {1 - (selectedCoverImages && selectedCoverImages[0].length)} şəkil seçin
                  </Text>
                </View>
                {selectedCoverImages && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 25,
                    }}>

                    {selectedCoverImages &&
                      <Image
                        source={{ uri: selectedCoverImages }}
                        style={{ width: 100, height: 100, margin: 5 }}
                      />

                    }

                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* galerya sekli */}
            <View style={styles.formItem}>
              <Text>Qalereya şəkillərini seçin</Text>
              <TouchableOpacity onPress={pickAndUploadImagesForGallery}>
                <View style={{ backgroundColor: 'gray', padding: 20 }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    Maksimum {10 - selectedGalleryImages.length} şəkil seçin
                  </Text>
                </View>
                {selectedGalleryImages.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 25,
                    }}>
                    {
                      selectedGalleryImages.map((imageUri, index) => (
                        <Image
                          key={index}
                          source={{ uri: imageUri }}
                          style={{ width: 100, height: 100, margin: 5 }}
                        />
                      ))
                    }

                  </View>
                )}
              </TouchableOpacity>
            </View>


            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Özəlliklər</Text>
              <Icon
                style={styles.sectionHeader}
                name={'wine-glass'}
                size={20}
                color="grey"
              />
            </View>


            <View style={styles.formItem}>
              <ScrollView>
                <CheckboxGroup
                  callback={(selected) => {
                    setSelectedProperties(selected);
                  }}
                  iconColor={'white'}
                  iconSize={28}
                  checkedIcon="ios-checkbox-outline"
                  uncheckedIcon="ios-square-outline"
                  checkboxes={properties}
                  labelStyle={{
                    color: 'white',
                    marginLeft: 8,
                    marginRight: 15,
                    marginBottom: 10
                  }}
                  rowStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                  rowDirection={'column'}
                />
              </ScrollView>
            </View>


            {/* həftənin günü və iş saatı başladı */}
            <View style={styles.formItem}>
              {daysOfWeek.map((day) => (
                <View key={day} style={styles.dayContainer}>
                  <Text body1>{day}</Text>
                  <Text>Açılış saatı:</Text>
                  <TimePicker
                    selectedHour={schedule[day].openingTime.hour}
                    selectedMinute={schedule[day].openingTime.minute}
                    onHourChange={(hour) => handleTimeChange(day, 'openingTime', 'hour', hour)}
                    onMinuteChange={(minute) => handleTimeChange(day, 'openingTime', 'minute', minute)}
                  />
                  <Text>Bağlanış saatı:</Text>
                  <TimePicker
                    selectedHour={schedule[day].closingTime.hour}
                    selectedMinute={schedule[day].closingTime.minute}
                    onHourChange={(hour) => handleTimeChange(day, 'closingTime', 'hour', hour)}
                    onMinuteChange={(minute) => handleTimeChange(day, 'closingTime', 'minute', minute)}
                  />

                </View>
              ))}
            </View>
            {/* həftənin günü və iş saatı bitdi */}

            <TouchableOpacity
              onPress={handleSubmit}
              style={[{
                padding: 10,
                borderRadius: 25,
                width: '85%',
                marginLeft: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
              }, bgColor]}>
              <Text
                style={[{ fontSize: 18 }, textColor]}>
                Təsdiqlə
              </Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  header: {},
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    flexWrap: 'wrap'
  },
  sectionHeaderText: {
    fontSize: 23,
    marginRight: 15,
  },
  formItem: {
    padding: 5,
    paddingLeft: 15,
  },
  formLabel: {
    marginBottom: 5,
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
    fontSize: 16,
    height: 200,
  },
  map: {
    width: '100%',
    height: 400,
  },
  locationPickerStyle: {
    width: '95%',
    color: 'white',
    marginBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    marginHorizontal: 15,
    borderRadius: 8
  },
  dayContainer: {
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePicker: {
    width: 200,
    marginBottom: 20
  }
});