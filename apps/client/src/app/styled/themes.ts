

export interface Theme {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    headingPrimary: string;
    headingSecondary: string;
    buttonPrimaryBg: string;
    buttonPrimaryText: string;
    buttonSecondaryBg: string;
    buttonSecondaryText: string;
    inputBg: string;
    inputText: string;
    inputBorder: string;
    panelPrimaryBg: string;
    panelSecondaryBg: string;
    statusColors: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    semantic: {
      navBg: string;
      mainBg: string;
      sectionBg: string;
      articleBg: string;
    }
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
    buttonRadius: string;
    buttonPadding: string;
    buttonShadow: string;
    inputBorderRadius: string;
    inputPadding: string;
    inputShadow: string;
    panelPadding: string;
    panelBorderRadius: string;
    panelShadow: string;
  };
}

const statusColors = {
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
};

const typography = {
  fontSizeSmall: '12px',
  fontSizeMedium: '16px',
  fontSizeLarge: '20px',
  lineHeightSmall: '1.2',
  lineHeightMedium: '1.5',
  lineHeightLarge: '1.8',
  fontFamily: 'Arial, sans-serif',
};

const components = {
  buttonRadius: '4px',
  buttonPadding: '10px 20px',
  buttonShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  inputBorderRadius: '4px',
  inputPadding: '8px',
  inputShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  panelPadding: '20px',
  panelBorderRadius: '8px',
  panelShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};
const spacing = {
  unit: 8,
  small: '8px',
  medium: '16px',
  large: '24px',
  extraLarge: '32px',
};

// Dark mode theme
export const darkTheme: Theme = {
  colors: {
    background: '#36393f',
    text: '#ffffff',
    primary: '#7289da',
    secondary: '#b9bbbe',
    headingPrimary: '#ffffff',
    headingSecondary: '#b9bbbe',
    buttonPrimaryBg: '#7289da',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: '#414549',
    buttonSecondaryText: '#ffffff',
    inputBg: '#40444b',
    inputText: '#ffffff',
    inputBorder: '#2f3136',
    panelPrimaryBg: '#202225',
    panelSecondaryBg: '#2f3136',
    statusColors: statusColors,
    semantic: {
      navBg: '#36393f',
      mainBg: '#2f3136',
      sectionBg: '#202225',
      articleBg: '#36393f',
    }
  },
  spacing: spacing,
  typography: typography,
  components: components,
};

// Light mode theme
export const lightTheme: Theme = {
  colors: {
    background: '#f0f0f0',
    text: '#333',
    primary: '#007bff',
    secondary: '#6c757d',
    headingPrimary: '#333',
    headingSecondary: '#6c757d',
    buttonPrimaryBg: '#007bff',
    buttonPrimaryText: '#fff',
    buttonSecondaryBg: '#414549',
    buttonSecondaryText: '#fff',
    inputBg: '#fff',
    inputText: '#333',
    inputBorder: '#ccc',
    panelPrimaryBg: '#f0f0f0',
    panelSecondaryBg: '#ffffff',
    statusColors: statusColors,
    semantic: {
      navBg: '#007bff',
      mainBg: '#f0f0f0',
      sectionBg: '#ffffff',
      articleBg: '#f0f0f0',
    }
  },
  spacing: spacing,
  typography: typography,
  components: components,
};