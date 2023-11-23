export interface SharedTheme {
  colors: {
    statusColors: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    accentColor: string;
  };
  spacing: {
    unit: number;
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
  };
  typography: {
    fontSizeSmall: string;
    fontSizeMedium: string;
    fontSizeLarge: string;
    lineHeightSmall: string;
    lineHeightMedium: string;
    lineHeightLarge: string;
    fontFamily: string;
  };
  components: {
    button: {
      text: string;
      borderRadius: string;
      padding: string;
      boxShadow: string;
      borderColor: string;
    };
    inputBorderRadius: string;
    inputPadding: string;
    inputShadow: string;
    panelPadding: string;
    panelBorderRadius: string;
    panelShadow: string;
    popover: {
      borderRadius: string;
      shadow: string;
    };
  };
}

export interface Theme extends SharedTheme {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accentColor: string;
    borderColor: string;
    statusColors: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    surfaces: {
      navBg: string;
      mainBg: string;
      sectionBg: string;
      articleBg: string;
    };
  };
}

const statusColors = {
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
};

const buttonColors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  link: '#007bff',
};

const accentColor = '#007bff';

const typography = {
  fontSizeSmall: '12px',
  fontSizeMedium: '16px',
  fontSizeLarge: '20px',
  lineHeightSmall: '1.2',
  lineHeightMedium: '1.5',
  lineHeightLarge: '1.8',
  fontFamily: '"Times New Roman", sans-serif',
};

const components = {
  button: {
    text: '#ededed',
    borderRadius: '4px',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    borderColor: '#212121',
  },
  inputBorderRadius: '4px',
  inputPadding: '8px',
  inputShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  panelPadding: '20px',
  panelBorderRadius: '8px',
  panelShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  popover: {
    borderRadius: '4px',
    shadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
};
const spacing = {
  unit: 8,
  small: '8px',
  medium: '16px',
  large: '24px',
  extraLarge: '32px',
};

const sharedTheme = {
  spacing: spacing,
  typography: typography,
  components: components,
  colors: {
    accentColor: accentColor,
    statusColors: statusColors,
  },
};

export const darkTheme: Theme = {
  ...sharedTheme,
  colors: {
    ...sharedTheme.colors,
    background: '#36393f',
    text: '#ffffff',
    primary: '#ededed',
    secondary: '#80848e',
    borderColor: '#80848e',
    surfaces: {
      navBg: '#1e1f22',
      mainBg: '#2b2d31',
      sectionBg: '#202225',
      articleBg: '#36393f',
    },
  },
};

export const lightTheme: Theme = {
  ...sharedTheme,
  colors: {
    ...sharedTheme.colors,
    background: '#f0f0f0',
    text: '#333',
    primary: '#007bff',
    secondary: '#6c757d',
    borderColor: '#424242',
    surfaces: {
      navBg: '#007bff',
      mainBg: '#f0f0f0',
      sectionBg: '#ffffff',
      articleBg: '#f0f0f0',
    },
  },
};

// neutrals: {
//   100: '#121212',
//   200: '#282828',
//   300: '#3f3f3f',
//   400: '#575757',
//   500: '#717171',
//   600: '#8b8b8b',
//   700: '#616161',
//   800: '#424242',
//   900: '#212121',
// },
