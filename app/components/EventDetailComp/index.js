import React from 'react';
import { SafeAreaView, Text } from 'react-native';
function EventDetailComp({route}) {
 
  console.log(route?.params);
  return (
    <SafeAreaView>
     <Text style={{color:'red'}}>Event Detail Page !</Text>
    </SafeAreaView>
  );
}
export default EventDetailComp