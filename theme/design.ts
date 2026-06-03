// ============================================================
// LOCUS CRM — Shared Design System
// Single source of truth for all UI tokens
// ============================================================

export const DS = {
  color: {
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryMuted: '#EFF6FF',

    bg: '#F8FAFC',
    card: '#FFFFFF',

    border: '#E2E8F0',
    borderLight: '#F1F5F9',

    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#EA580C',
    warningLight: '#FFF7ED',
    danger: '#DC2626',
    dangerLight: '#FEE2E2',
    neutral: '#94A3B8',
    neutralLight: '#F1F5F9',

    // Order statuses
    status: {
      pending: { bg: '#FFF7ED', color: '#C2410C', dot: '#C2410C' },
      confirmed: { bg: '#EFF6FF', color: '#1D4ED8', dot: '#1D4ED8' },
      processing: { bg: '#F5F3FF', color: '#5B21B6', dot: '#5B21B6' },
      shipped: { bg: '#ECFEFF', color: '#0E7490', dot: '#0E7490' },
      delivered: { bg: '#ECFDF5', color: '#047857', dot: '#047857' },
      cancelled: { bg: '#FEF2F2', color: '#991B1B', dot: '#991B1B' },
      all: { bg: '#F8FAFC', color: '#0F172A', dot: '#0F172A' },
    },

    // Lead statuses
    lead: {
      new: '#3B82F6',
      contacted: '#F59E0B',
      qualified: '#10B981',
      unqualified: '#EF4444',
      converted: '#059669',
      lost: '#6B7280',
    },
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    full: 999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  typography: {
    screenTitle: { fontSize: 24, fontWeight: '700' as const, color: '#0F172A' },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: '#0F172A',
    },
    cardTitle: { fontSize: 16, fontWeight: '700' as const, color: '#0F172A' },
    body: { fontSize: 14, lineHeight: 22, color: '#0F172A' },
    caption: { fontSize: 12, color: '#94A3B8' },
    label: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.8,
      color: '#64748B',
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 1.2,
      color: '#64748B',
      textTransform: 'uppercase' as const,
    },
  },

  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },
} as const;
