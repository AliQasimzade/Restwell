import React, {useCallback} from 'react';
import Slider from 'rn-range-slider';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';

export default function RangeSlider(props) {
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(
    () => <Rail color={props.color} />,
    [props.color],
  );
  const renderRailSelected = useCallback(
    () => <RailSelected color={props.selectionColor} />,
    [props.selectionColor],
  );
  const renderLabel = useCallback(
    value => <Label text={value} color={props.selectionColor} />,
    [props.selectionColor],
  );
  const renderNotch = useCallback(
    () => <Notch color={props.selectionColor} />,
    [props.selectionColor],
  );

  return (
    <Slider
      min={props.min}
      max={props.max}
      step={1}
      disableRange={false}
      floatingLabel={true}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      renderNotch={renderNotch}
      onValueChanged={props.onValueChanged}
    />
  );
}