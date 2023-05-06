import React, { useState } from 'react';
import { View, Text } from 'react-native';
import InstaStory from 'react-native-insta-story';
import { useTheme } from '@config';

const Story = (props) => {
  const { data } = props
  const [show, setShow] = useState(false)
  const [text, setText] = useState('');
  const { colors } = useTheme();
  const handleStart = item => {
    setShow(true)
    setText(item.stories[0].swipeText)
  };

  const handleClose = item => {
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
      style={{ marginTop: 30, color: `${colors.primary}` }}
      showAvatarText={true}
      avatarSize={70}
      unPressedAvatarTextColor={colors.text}
      pressedAvatarTextColor={colors.text}
      unPressedBorderColor={colors.primary}
      pressedBorderColor={colors.text}
    />
  );
};

export default Story;