// ife — design system
// Warm, earthy, African-inspired palette with modern app aesthetics

export const colors = {
  primary: {
    50: '#FFF5F0',
    100: '#FFE8DC',
    200: '#FFCDB5',
    300: '#FFA882',
    400: '#FF8354',
    500: '#FF5E26',
    600: '#E04A1A',
    700: '#B83A12',
    800: '#8A2C0E',
    900: '#5C1D09',
  },
  secondary: {
    50: '#F0FAF5',
    100: '#D9F2E5',
    200: '#B3E5CC',
    300: '#80D3AB',
    400: '#4DB887',
    500: '#2A9D6A',
    600: '#1E7A52',
    700: '#155C3E',
    800: '#0D3F2A',
    900: '#062417',
  },
  accent: {
    50: '#FFF8E8',
    100: '#FFEFCC',
    200: '#FFDE99',
    300: '#FFCC66',
    400: '#FFBB33',
    500: '#FFAA00',
    600: '#CC8800',
    700: '#996600',
    800: '#664400',
    900: '#332200',
  },
  success: {
    50: '#F0FBF4',
    100: '#D9F7E2',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },
  warning: {
    50: '#FFFCE8',
    100: '#FFF8CC',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  neutral: {
    0: '#FFFFFF',
    10: '#FAFAFA',
    20: '#F5F5F5',
    30: '#EFEFEF',
    40: '#E5E5E5',
    50: '#D4D4D4',
    100: '#A3A3A3',
    200: '#737373',
    300: '#525252',
    400: '#404040',
    500: '#262626',
    600: '#171717',
    700: '#0A0A0A',
  },
} as const;

export const fonts = {
  heading: 'Poppins-SemiBold',
  headingBold: 'Poppins-Bold',
  body: 'NunitoSans-Regular',
  bodyMedium: 'NunitoSans-Medium',
  bodySemiBold: 'NunitoSans-SemiBold',
  bodyBold: 'NunitoSans-Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
