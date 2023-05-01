import React, { useState } from 'react';
import { View, Text } from 'react-native';
import InstaStory from 'react-native-insta-story';
import { useTheme } from '@config';

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
      customSwipeUpComponent={show ? <View >
        <Text>{text}</Text>
      </View> : <Text>Data not found</Text>}
      style={{ marginTop: 30 }}
      showAvatarText={true}
      avatarSize={70}
      avatarTextStyle={{color: `${colors.primary}` }}
    />
  );
};

export default Story;