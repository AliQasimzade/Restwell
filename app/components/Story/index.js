import React, {useState} from 'react';
import {View, Text} from 'react-native';
import InstaStory from 'react-native-insta-story';


const Story = (props) => {
  const {data} = props
  const [show, setShow ] = useState(false)
  const [text, setText] = useState('')
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
      customSwipeUpComponent={show ?  <View>
        <Text style={{color:'red'}}>{text}</Text>
      </View> : <Text style={{color:'white'}}>Data not found</Text>}
      style={{marginTop: 30}}
      showAvatarText={true}
      textStyle={{color: 'white'}}
      avatarSize={70}
    />
  );
};

export default Story;