import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  FlatList,
  Alert,
  Linking,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, Images, useTheme } from '@config';
import * as Utils from '@utils';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
  TextInput,
} from '@components';
import { KeyboardAvoidingView } from 'react-native';
import { StyleSheet } from 'react-native';
import CheckboxGroup from 'react-native-checkbox-group';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
export default function AddListings({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [ourTeam, setOurTeam] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState([]);
  const [tags, setTags] = useState([]);
  const [properties, setProperties] = useState([]);
  const [slogan, setSlogan] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [address, setAddress] = useState('');
  const [zipcode, setZipCode] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [prePrice, setPrePrice] = useState('');
  const [price, setPrice] = useState('');
  const [uploadVideoLink, setUploadVideoLink] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  console.log('====================================');
  console.log(selectedCategory + "bleeet");
  console.log('====================================');

  useEffect(() => {

    const categories = fetch(
      'https://restwell.az/api/categories',
    ).then(res => res.json());
    const tags = fetch(
      'https://restwell.az/api/tags',
    ).then(res => res.json());
    const properties = fetch(
      'https://restwell.az/api/properties',
    ).then(res => res.json());

    Promise.all([categories, tags, properties]).then(responses => {
      const [res1, res2, res3] = responses;
      setCategory(res1);
      setTags(res2)
      setProperties(res3)
    })

  }, [])

  console.log('====================================');
  console.log(JSON.stringify(category) + " blet");
  console.log('====================================');

  const handleTitleChange = text => {
    setTitle(text);
  };

  const handleCategoryChange = text => {
    setCategory(text);
  };

  const handleSloganChange = text => {
    setSlogan(text);
  };

  const handleTypeChange = text => {
    setType(text);
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

  const handleZipCodeChange = text => {
    setZipCode(text);
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

  const handleLinkedinChange = text => {
    setLinkedin(text);
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

  const handlePriceChange = text => {
    setPrice(text);
  };
  const handleUploadVideoLinkChange = text => {
    setUploadVideoLink(text);
  };
  uploadVideoLink;

  const handleSubmit = () => {
    fetch('https://restwell.az/api/listings', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        category: category,
        slogan: slogan,
        type: type,
        city: city,
        street: street,
        address: address,
        zipcode: zipcode,
        description: description,
        phone: phone,
        email: email,
        website: website,
        facebook: facebook,
        linkedin: linkedin,
        youtube: youtube,
        whatsapp: whatsapp,
        prePrice: prePrice,
        price: price,
        uploadVideoLink: uploadVideoLink,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Form submitted successfully!', data);
      })
      .catch(error => {
        console.error('Error submitting form data:', error);
      });
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      maxSelectedAssets: 10 - selectedImages.length, // limit to 10 images total
    });
    if (!result.canceled) {
      const images = result.selected.map(image => image.uri);
      setSelectedImages([...selectedImages, ...images]);
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [checked, setChecked] = useState(false);

  const handleCheckBox = () => {
    setChecked(!checked);
  };

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
                placeholder={'Type a title'}
                style={styles.formInput}
                value={title}
                onChangeText={handleTitleChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Categories:</Text>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {
                  category.length > 0 &&
                  <Picker
                    selectedValue={selectedCategory}
                    style={{ width: '100%', backgroundColor: 'white', color: 'white' }}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  >
                    {category.map((cat) => (
                      <Picker.Item style={{ color: 'white' }} key={cat._id} label={cat.name} value={cat.name} />
                    ))}
                  </Picker>
                }
              </View>
            </View>
            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Slogan:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type a slogan'}
                style={styles.formInput}
                value={slogan}
                onChangeText={handleSloganChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Type:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type a type'}
                style={styles.formInput}
                value={type}
                onChangeText={handleTypeChange}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Location</Text>
              <Icon
                style={styles.sectionHeader}
                name={'location-arrow'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Street:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type a street'}
                style={styles.formInput}
                value={street}
                onChangeText={handleStreetChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>City:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type a city'}
                style={styles.formInput}
                value={city}
                onChangeText={handleCityChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Address:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type an address'}
                style={styles.formInput}
                value={address}
                onChangeText={handleAddressChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>ZipCode:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type a zipcode'}
                style={styles.formInput}
                value={zipcode}
                onChangeText={handleZipCodeChange}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Details</Text>
              <Icon
                style={styles.sectionHeader}
                name={'paperclip'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Description:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type a description'}
                value={description}
                onChangeText={handleDescriptionChange}
                style={styles.formInput}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Phone:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'e.g +994 12 345 67 89'}
                style={styles.formInput}
                value={phone}
                onChangeText={handlePhoneChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Email:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type an email'}
                style={styles.formInput}
                value={email}
                onChangeText={handleEmailChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Website:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Add a Link'}
                style={styles.formInput}
                value={website}
                onChangeText={handleWebsiteChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Facebook:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Add Facebook link'}
                style={styles.formInput}
                value={facebook}
                onChangeText={handleFacebookChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Linkedin:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Add Linkedin link'}
                style={styles.formInput}
                value={linkedin}
                onChangeText={handleLinkedinChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Youtube:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Add Youtube link'}
                style={styles.formInput}
                value={youtube}
                onChangeText={handleYoutubeChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Whatsapp:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'Type Whatsapp number'}
                style={styles.formInput}
                value={whatsapp}
                onChangeText={handleWhatsappChange}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Pricing</Text>
              <Icon
                style={styles.sectionHeader}
                name={'wallet'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Previous price:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'e.g 155 AZN'}
                style={styles.formInput}
                value={prePrice}
                onChangeText={handlePrePriceChange}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Price:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'e.g 140 AZN'}
                style={styles.formInput}
                value={price}
                onChangeText={handlePriceChange}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Tags</Text>
              <Icon
                style={styles.sectionHeader}
                name={'wallet'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <CheckboxGroup
                callback={selected => {
                  console.log(selected);
                }}
                iconColor={'white'}
                iconSize={28}
                checkedIcon="ios-checkbox-outline"
                uncheckedIcon="ios-square-outline"
                checkboxes={[
                  {
                    label: 'First',
                    value: 1,
                    selected: true,
                  },
                ]}
                labelStyle={{
                  color: 'white',
                  marginLeft: 8,
                }}
                rowStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                rowDirection={'row'}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Media and Attachement
              </Text>
              <Icon
                style={styles.sectionHeader}
                name={'vihara'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Upload Video Link:</Text>
              <TextInput
                secureTextEntry={false}
                placeholder={'e.g www.youtube.com'}
                style={styles.formInput}
                value={uploadVideoLink}
                onChangeText={handleUploadVideoLinkChange}
              />
            </View>

            <TouchableOpacity onPress={pickImages}>
              <View style={{ backgroundColor: 'gray', padding: 20 }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  Select up to {10 - selectedImages.length} images
                </Text>
              </View>
              {selectedImages && selectedImages.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 25,
                  }}>
                  {selectedImages.map(imageUri => (
                    <Image
                      key={selectedImages.length}
                      source={{ uri: imageUri }}
                      style={{ width: 100, height: 100, margin: 5 }}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Features</Text>
              <Icon
                style={styles.sectionHeader}
                name={'wine-glass'}
                size={20}
                color="grey"
              />
            </View>

            <View style={styles.formItem}>
              <CheckboxGroup
                callback={selected => {
                  console.log(selected);
                }}
                iconColor={'white'}
                iconSize={28}
                checkedIcon="ios-checkbox-outline"
                uncheckedIcon="ios-square-outline"
                checkboxes={[
                  {
                    label: 'First',
                    value: 1,
                    selected: true,
                  },
                ]}
                labelStyle={{
                  color: 'white',
                  marginLeft: 8,
                }}
                rowStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                rowDirection={'row'}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 25,
                width: '85%',
                marginLeft: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                }}>
                Add Listing
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
});