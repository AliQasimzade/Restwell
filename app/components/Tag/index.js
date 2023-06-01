import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@config';
import Text from '@components/Text';
import styles from './styles';

function Tag(props) {
  const { colors } = useTheme();
  const {
    style,
    textStyle,
    icon,
    primary,
    primaryIcon,
    outline,
    outlineIcon,
    outlineSecondary,
    outlineSecondaryIcon,
    small,
    light,
    gray,
    chip,
    status,
    rate,
    rateSmall,
    sale,
    children,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      {...rest}
      style={StyleSheet.flatten([
        styles.default,
        primary && [styles.primary, { backgroundColor: colors.primary }],
        primaryIcon && styles.primary,
        outline && [
          styles.outline,
          { borderColor: colors.primary, backgroundColor: colors.card },
        ],
        outlineIcon && styles.outline,
        outlineSecondary && styles.outlineSecondary,
        outlineSecondaryIcon && [
          styles.outlineSecondary,
          { borderColor: colors.accent },
        ],
        small && [styles.small, { backgroundColor: colors.primary }],
        light && [styles.light, { backgroundColor: colors.primary }],
        gray && styles.gray,
        chip && [
          styles.chip,
          { backgroundColor: colors.card, borderColor: colors.primary },
        ],
        status && [styles.status, { backgroundColor: colors.primary, fontSize: 22 }],
        rate && [styles.rate, { backgroundColor: colors.primaryLight }],
        rateSmall && [styles.rateSmall, { backgroundColor: colors.primaryLight }],
        sale && [styles.sale, { backgroundColor: colors.primaryLight }],
        style,
      ])}
      activeOpacity={0.9}>
      {icon ? icon : null}
      <Text
        style={StyleSheet.flatten([
          primary && styles.textPrimary,
          primaryIcon && styles.textPrimary,
          outline && [styles.textOutline, { color: colors.primary }],
          outlineIcon && [styles.textOutline, { color: colors.primary }],
          outlineSecondary && [
            styles.textOutlineSecondary,
            { color: colors.accent },
          ],
          outlineSecondaryIcon && [
            styles.textOutlineSecondary,
            { color: colors.accent },
          ],
          small && styles.textSmall,
          light && [styles.textLight, { color: colors.primaryLight }],
          gray && styles.textGray,
          chip && [styles.textChip, { color: colors.primary }],
          status && styles.textStatus,
          rate && styles.textRate,
          rateSmall && styles.textRateSmall,
          sale && styles.textSale,
          textStyle,
        ])}
        numberOfLines={1}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export default Tag