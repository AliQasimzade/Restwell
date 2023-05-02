import React, {useState} from 'react';
import { View } from 'react-native';
import { Images, BaseColor, useTheme } from '@config';
import { Text, Image, StarRating } from '@components';
import PropTypes from 'prop-types';
import styles from './styles';

export default function CommentItem(props) {
  const { colors } = useTheme();
  const [state] = useState(["Xidmətə görə","Qiymətə görə", "Ümumi","Porsiyaya görə"])
  const cardColor = colors.card;
  const { style, image, name, rate, date, comments } = props;
  return (
    <View style={[styles.contain, { backgroundColor: cardColor }, style]}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <View style={styles.contentLeft}>
          <Image source={{ uri: image }} style={styles.thumb} />
          <View>
            <Text headline semibold numberOfLines={1}>
              {name}
            </Text>
            
          </View>
        </View>
        <View >
          <Text caption2 grayColor numberOfLines={2}>
            {date}
          </Text>
        </View>
      </View>
      <View body2 grayColor>
        {comments.map((comment, index) => (
          <View key={index} style={{marginTop: 8}}>
            <Text style={{color: colors.primary}}>{state[index]}:</Text>
            <View>
            <Text>{comment.message}</Text>
            <View style={styles.contentRate}>
              <StarRating
                disabled={true}
                starSize={14}
                maxStars={5}
                rating={comment.rating_count}
                selectedStar={rating => { }}
                fullStarColor={BaseColor.yellowColor}
              />
            </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

CommentItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  rate: PropTypes.string,
  date: PropTypes.string,
  comment: PropTypes.string,
};

CommentItem.defaultProps = {
  style: {},
  image: Images.profile2,
  name: '',
  rate: '0',
  date: '',
  comment: '',
};
