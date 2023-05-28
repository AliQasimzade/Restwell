import React, { useState } from 'react';
import { View } from 'react-native';
import { BaseColor, useTheme } from '@config';
import StarRating from '../StarRating'

import Text from '../Text';
import Image from '../Image'
import PropTypes from 'prop-types';
import styles from './styles';

import { useTranslation } from 'react-i18next';

function CommentItem(props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [state] = useState(["according_to_the_service", "for_the_price", "general", "according_to_the_portion"])
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
          <View key={index} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.primary }}>{t(state[index])}:</Text>
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
  name: PropTypes.string,
  rate: PropTypes.string,
  date: PropTypes.string,
  comment: PropTypes.string,
};

CommentItem.defaultProps = {
  style: {},
  name: '',
  rate: '0',
  date: '',
  comment: '',
};
export default CommentItem