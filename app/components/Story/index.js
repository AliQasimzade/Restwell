import React, { useState } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import InstaStory from 'react-native-insta-story';
import { BaseStyle, BaseColor, useTheme } from '@config';

const Story = (props) => {
  const { data } = props
  const [show, setShow] = useState(false)
  const [text, setText] = useState('');
  const { colors } = useTheme();
  console.log('====================================');
  console.log(colors, "ListItem bleet");
  console.log('====================================');
  const handleStart = item => {
    console.log(item);
    setShow(true)
    setText(item.stories[0].swipeText)
  };

  const handleClose = item => {
    console.log('close: ', item);
    setShow(false)
  };

  const handleSwipe = item => {
    console.log(item, "Swipe Up !");
  }

  return (
    <InstaStory
      
      data={data}
      duration={10}
      onStart={handleStart}
      onClose={handleClose}
      onSwipeUp={handleSwipe}
      customSwipeUpComponent={show ? <View style={{ color: `${colors.primaryLight}` }}>
        <Text style={{ color: `${colors.primaryLight}` }}>{text}</Text>
      </View> : <Text>Data not found</Text>}
      style={{ marginTop: 30, color: `${colors.primaryLight} !important` }}
      showAvatarText={true}
      avatarSize={70}
      storyUserContainerStyle={{color: "red"}}
    />
  );
};

export default Story;