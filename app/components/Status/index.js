import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Alert,View } from 'react-native';
import Story from '../Story';
export default function Status() {
    const [status, setStatus] = useState([]);

    const getAllStatus = async () => {
        try {
            const request = await axios.get('https://restwell.az/api/status');

            if(request.status !== 200) {
                throw new Error('Request is failed !')
            }else {
                const response = request.data;
                setStatus(response)
            }
           }catch(err) {
            Alert.alert({type:'error', title:"Error", message:err.message})
           }
    }
    useEffect(() => {
        getAllStatus()
    },[])
  return (
    <View style={{ paddingLeft: 5, marginTop: 40, marginBottom: 0 }}>
            {status.length > 0 && (
              <Story
                data={status.map((item, index) => {
                  return {
                    user_id: index,
                    user_image: item.userProfilePicture,
                    user_name: item.sharedBy,
                    stories: [
                      {
                        story_id: index,
                        story_image: item.image,
                        swipeText: item.content,

                      },
                    ],
                  };
                })}
              />
            )}
          </View>
  )
}
