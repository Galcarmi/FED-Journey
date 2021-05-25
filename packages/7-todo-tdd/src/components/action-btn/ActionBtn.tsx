import React, { FC, MouseEventHandler, ReactElement } from 'react';
import { commonStyles } from '../../styles/commonStyles';
import { jss } from '../../styles/config';

interface BtnProps {
  onClick: MouseEventHandler<SVGSVGElement>;
  color: string;
  svgIconPath: JSX.Element;
}

export const ActionBtn: FC<BtnProps> = (props: BtnProps): ReactElement => {
  const getStyles = (color: string) => {
    return jss
      .createStyleSheet({
        actionBtn: {
          ...commonStyles.RLMarginXS,
          cursor: 'pointer',
          fill: color,
        },
      })
      .attach().classes;
  };

  const s = getStyles(props.color);

  return (
    <svg
      onClick={props.onClick}
      className={s.actionBtn}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      {props.svgIconPath}
    </svg>
  );
};
