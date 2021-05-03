import { commonStyles, colors } from '../../styles/commonStyles';
import { jss } from '../../styles/jss';

export const getDoneBtn = (): string => {
  return `<svg
    class=${classes.doneBtn}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24">
      <path
      d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"
    />
  </svg>`;
};

const styles = {
  doneBtn: {
    ...commonStyles.RLMarginXS,
    cursor: 'pointer',
    fill: colors.green,
  },
};

const { classes } = jss.createStyleSheet(styles).attach();
export const s = classes;