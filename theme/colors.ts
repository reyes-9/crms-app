// src/theme/theme.js

export const theme = {
  colors: {
    // Brand
    primary: '#0F6E56',
    primaryLight: '#1D9E75',
    primarySoft: '#9FE1CB',
    primaryBackground: '#E1F5EE',

    // Neutral
    dark: '#2C2C2A',
    light: '#F1EFE8',

    // UI
    background: '#FFFFFF',
    border: '#E5E7EB',
    offWhite: '#FAFAF9',

    // Text
    textPrimary: '#2C2C2A',
    textSecondary: '#6B7280',
    textInverse: '#FFFFFF',

    // Status
    success: '#1D9E75',
    warning: '#F59E0B',
    danger: '#E74C3C',
    neutral: '#6B7280',
    info: '#3B82F6',

    // Navigation
    tabActive: '#0F6E56',
    tabInactive: '#9CA3AF',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },

  typography: {
    fontFamily: {
      regular: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },

  elevation: {
    sm: {
      elevation: 2,
      boxShadowColor: '#000',
      boxShadowOpacity: 0.1,
      boxShadowRadius: 3,
      boxShadowOffset: { width: 0, height: 1 },
    },
    md: {
      elevation: 4,
      boxShadowColor: '#000',
      boxShadowOpacity: 0.15,
      boxShadowRadius: 5,
      boxShadowOffset: { width: 0, height: 3 },
    },
    lg: {
      elevation: 8,
      boxShadowColor: '#000',
      boxShadowOpacity: 0.2,
      boxShadowRadius: 10,
      boxShadowOffset: { width: 0, height: 6 },
    },
    xl: {
      elevation: 12,
      boxShadowColor: '#000',
      boxShadowOpacity: 0.25,
      boxShadowRadius: 16,
      boxShadowOffset: { width: 0, height: 8 },
    },
  },
};
