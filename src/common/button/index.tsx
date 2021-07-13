import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
const variants = {
  outlined: 'outlined',
  contained: 'outlined',
  text: 'text',
};

const types = {
  primary: 'primary',
  default: 'default',
  secondary: 'secondary',
  warning: 'warning',
  error: 'error',
  tertiary: 'tertiary',
};

const colors = {
  primary: '#239F33',
  default: '#333333',
  secondary: '#FAFAFA',
  tertiary: '#0088CC',
  warning: '#FAFAFA',
  error: '#F50000',
};

const backgroundColors = {
  primary: {
    default: '#2CC941',
    hover: '#219130',
  },
  default: {
    default: '#D9D9D9',
    hover: '#c9c9c9',
  },
  secondary: {
    default: '#00A3F5',
    hover: '#0294de',
  },
  tertiary: {
    default: '#DCEFF9',
    hover: '#ccdee8',
  },
  warning: {
    default: '#F5B000',
    hover: '#db9e00',
  },
  error: {
    default: '#F9DCDC',
    hover: '#e6caca',
  },
};

const borderColors = {
  primary: {
    default: '#2CC941',
    hover: '#219130',
  },
  default: {
    default: '#D9D9D9',
    hover: '#c9c9c9',
  },
  secondary: {
    default: '#00A3F5',
    hover: '#0294de',
  },
  tertiary: {
    default: '#DCEFF9',
    hover: '#ccdee8',
  },
  warning: {
    default: '#F5B000',
    hover: '#db9e00',
  },
  error: {
    default: '#F9DCDC',
    hover: '#e6caca',
  },
};

const StyledDisabledFontButton = styled(Button)`
  text-transform: none;
`;

const PrimaryButton = withStyles({
  text: {
    color: colors.primary,
  },
  outlined: {
    color: colors.primary,
    borderColor: borderColors.primary.default,
    '&:hover': {
      borderColor: borderColors.primary.hover,
    },
    '&:active': {
      borderColor: borderColors.primary.hover,
    },
  },
  contained: {
    color: colors.secondary,
    backgroundColor: backgroundColors.primary.default,
    '&:hover': {
      backgroundColor: backgroundColors.primary.hover,
    },
    '&:active': {
      backgroundColor: backgroundColors.primary.hover,
    },
  },
})(StyledDisabledFontButton);

const SecondaryButton = withStyles({
  text: {
    color: backgroundColors.secondary.default,
  },
  outlined: {
    color: borderColors.secondary.default,
    borderColor: borderColors.secondary.default,
    '&:hover': {
      borderColor: borderColors.secondary.hover,
    },
    '&:active': {
      borderColor: borderColors.secondary.hover,
    },
  },
  contained: {
    color: colors.secondary,
    backgroundColor: backgroundColors.secondary.default,
    '&:hover': {
      backgroundColor: backgroundColors.secondary.hover,
    },
    '&:active': {
      backgroundColor: backgroundColors.secondary.hover,
    },
  },
})(StyledDisabledFontButton);

const TertiaryButton = withStyles({
  text: {
    color: colors.tertiary,
  },
  outlined: {
    color: borderColors.tertiary.default,
    borderColor: borderColors.tertiary.default,
    '&:hover': {
      borderColor: borderColors.tertiary.hover,
    },
    '&:active': {
      borderColor: borderColors.tertiary.hover,
    },
  },
  contained: {
    color: colors.tertiary,
    backgroundColor: backgroundColors.tertiary.default,
    '&:hover': {
      backgroundColor: backgroundColors.tertiary.hover,
    },
    '&:active': {
      backgroundColor: backgroundColors.tertiary.hover,
    },
  },
})(StyledDisabledFontButton);

const DefaultButton = withStyles({
  text: {
    color: colors.default,
  },
  outlined: {
    color: colors.default,
    borderColor: borderColors.default.default,
    '&:hover': {
      borderColor: borderColors.default.hover,
    },
    '&:active': {
      borderColor: borderColors.default.hover,
    },
  },
  contained: {
    color: colors.default,
    backgroundColor: backgroundColors.default.default,
    '&:hover': {
      backgroundColor: backgroundColors.default.hover,
    },
    '&:active': {
      backgroundColor: backgroundColors.default.hover,
    },
  },
})(StyledDisabledFontButton);

const ErrorButton = withStyles({
  text: {
    color: colors.error,
  },
  outlined: {
    color: colors.error,
    borderColor: borderColors.error.default,
    '&:hover': {
      borderColor: borderColors.error.hover,
    },
    '&:active': {
      borderColor: borderColors.error.hover,
    },
  },
  contained: {
    color: colors.error,
    backgroundColor: backgroundColors.error.default,
    '&:hover': {
      backgroundColor: backgroundColors.error.hover,
    },
    '&:active': {
      backgroundColor: backgroundColors.error.hover,
    },
  },
})(StyledDisabledFontButton);

const WarningButton = withStyles({
  text: {
    color: colors.warning,
  },
  outlined: {
    color: colors.warning,
    borderColor: borderColors.warning.default,
    '&:hover': {
      borderColor: borderColors.warning.hover,
    },
    '&:active': {
      borderColor: borderColors.warning.hover,
    },
  },
  contained: {
    color: colors.warning,
    backgroundColor: backgroundColors.warning.default,
    '&:hover': {
      backgroundColor: backgroundColors.warning.hover,
    },
    '&:active': {
      backgroundColor: backgroundColors.warning.hover,
    },
  },
})(StyledDisabledFontButton);

const ButtonTypes = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  default: DefaultButton,
  error: ErrorButton,
  warning: WarningButton,
  tertiary: TertiaryButton,
};

const CustomButton: React.FC<any> = ({ children, color, ...rest }) => {
  const ButtonToRender = ButtonTypes[color as keyof typeof ButtonTypes];

  return <ButtonToRender {...rest}>{children}</ButtonToRender>;
};

export default CustomButton;