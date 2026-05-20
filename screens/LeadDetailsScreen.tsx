import { theme } from '@/theme/colors';
import { LeadProfile } from '@/types/lead';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatCurrency } from '../utils/formatCurrency';

export const LeadDetailsScreen = () => {
  const STATUS_CHOICES = [
    ['new', 'New'],
    ['contacted', 'Contacted'],
    ['qualified', 'Qualified'],
    ['converted', 'Converted'],
  ];

  const leads: LeadProfile[] = [
    {
      id: 'LEAD001',
      name: 'Alice Johnson',
      company: 'Tech Solutions Inc.',
      email: 'alice.johnson@example.com',
      number: '+1234567890',
      status: 'new',
      source: 'website',
      notes: 'Interested in product demo.',
      value: 50000, // 👈 added
    },
    {
      id: 'LEAD002',
      name: 'Bob Smith',
      company: 'Creative Agency',
      email: 'bob.smith@example.com',
      number: '+1987654321',
      status: 'unqualified',
      source: 'referral',
      notes: 'Follow-up scheduled for next week.',
      value: 30000,
    },
    {
      id: 'LEAD003',
      name: 'Carla Reyes',
      company: 'Global Enterprises',
      email: 'carla.reyes@example.com',
      number: '+1122334455',
      status: 'lost',
      source: 'social',
      notes: 'Strong interest, budget approved.',
      value: 75000,
    },
  ];

  const handleEdit = () => {
    // navigation.navigate('EditCustomer', { leads });
  };
  const handleNotes = () => {
    // navigation.navigate('EditCustomer', { leads });
  };

  const currentStatus = leads[2].status;
  const currentIndex = STATUS_CHOICES.findIndex(
    ([value]) => value === currentStatus,
  );

  const leadNotes = [
    {
      id: '1',
      content: 'Followed up with client regarding proposal.',
      createdAt: '2025-04-10',
      author: 'you',
    },
    {
      id: '2',
      content: 'Client requested a demo next week.',
      createdAt: '2025-04-12',
      author: 'you',
    },
    {
      id: '3',
      content: 'Sent updated contract for review.',
      createdAt: '2025-04-15',
      author: 'you',
    },
    {
      id: '4',
      content: 'Scheduled demo for April 20.',
      createdAt: '2025-04-16',
      author: 'you',
    },
    {
      id: '5',
      content: 'Demo completed successfully, client showed interest.',
      createdAt: '2025-04-20',
      author: 'you',
    },
    {
      id: '6',
      content: 'Shared pricing details and package options.',
      createdAt: '2025-04-22',
      author: 'you',
    },
    {
      id: '7',
      content: 'Client asked for additional references.',
      createdAt: '2025-04-25',
      author: 'you',
    },
    {
      id: '8',
      content: 'Provided references and case studies.',
      createdAt: '2025-04-27',
      author: 'you',
    },
  ];

  let notesContent;
  if (!leadNotes || leadNotes.length === 0) {
    notesContent = <Text>No notes found.</Text>;
  } else {
    notesContent = leadNotes.slice(0, 4).map((leadNote) => (
      <View key={leadNote.id}>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>{leadNote.content}</Text>

          <Text style={styles.noteMeta}>Apr 10, 2025 · you</Text>
        </View>
        <View style={styles.divider} />
      </View>
    ));
  }

  return (
    <ScrollView>
      <View>
        {/* HEAD */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={32} color="#1D9E75" />
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{leads[0].name}</Text>
              <Text style={styles.meta}>{leads[0].company}</Text>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
              <MaterialIcons name="edit" size={16} color="#1D9E75" />
              <Text style={styles.editText}>Edit Lead</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaItemPill}>{leads[0].status}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaItem}>
              {formatCurrency(leads[0].value, 'en-PH', 'PHP')}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaItem}>Follow Up: Apr 15</Text>
          </View>
          {/* PIPELINE STAGE */}
          <View style={styles.pipeline}>
            <Text style={styles.label}>PIPELINE STAGE</Text>

            <View style={styles.container}>
              {STATUS_CHOICES.map(([value, label], index) => {
                let effectiveIndex = currentIndex;

                // Redirect special statuses
                if (currentStatus === 'unqualified') {
                  effectiveIndex = 2; // qualified
                }
                if (currentStatus === 'lost') {
                  effectiveIndex = 3; // converted
                }

                const isPassed = index < effectiveIndex;

                const isCurrent =
                  index === effectiveIndex &&
                  currentStatus !== 'unqualified' &&
                  currentStatus !== 'lost';

                const isFailedStage =
                  (currentStatus === 'unqualified' && index === 2) ||
                  (currentStatus === 'lost' && index === 3);

                const isUpcoming = !isPassed && !isCurrent && !isFailedStage;

                const isLast = index === STATUS_CHOICES.length - 1;

                const statusText =
                  currentStatus === 'unqualified' && index === 2
                    ? 'Unqualified'
                    : currentStatus === 'lost' && index === 3
                      ? 'Lost'
                      : label;

                return (
                  <View
                    key={value}
                    style={[
                      styles.stageItem,
                      // PASSED
                      isPassed && styles.passedStage,

                      // CURRENT
                      isCurrent && styles.currentStage,

                      // FAILED TARGET
                      isFailedStage && styles.failedStage,

                      // UPCOMING
                      isUpcoming && styles.upcomingStage,

                      {
                        borderRightWidth: isLast ? 0 : 1, // remove border on last item
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stageText,

                        isPassed && styles.passedText,

                        isCurrent && styles.currentText,

                        isFailedStage && styles.failedText,

                        isUpcoming && styles.upcomingText,
                        {
                          // color: textColor,
                        },
                      ]}
                    >
                      {statusText}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <MaterialIcons name="phone" size={18} color="#1D9E75" />
              <Text style={styles.actionBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <MaterialIcons name="email" size={18} color="#1D9E75" />
              <Text style={styles.actionBtnText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.advanceBtn}
              // onPress={handleAdvanceLead}
              activeOpacity={0.8}
            >
              <MaterialIcons name="trending-up" size={18} color="#FFFFFF" />

              <Text style={styles.advanceBtnText}>
                Advance Lead
                {/* {buttonText} */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />

        {/* LEAD INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEAD INFO</Text>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Email:</Text>
            <Text style={styles.sectionValue}>{leads[0].email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Phone:</Text>
            <Text style={styles.sectionValue}>{leads[0].number}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Company:</Text>
            <Text style={styles.sectionValue}>{leads[0].company}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Status:</Text>
            <Text style={styles.sectionValue}>
              {leads[0].status.charAt(0).toUpperCase() +
                leads[0].status.slice(1).toLowerCase()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Source:</Text>
            <Text style={styles.sectionValue}>
              {leads[0].source.charAt(0).toUpperCase() +
                leads[0].source.slice(1).toLowerCase()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Company:</Text>
            <Text style={styles.sectionValue}>
              {formatCurrency(leads[0].value, 'en-PH', 'PHP')}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* NOTES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>NOTES</Text>
            <TouchableOpacity style={styles.editBtn} onPress={handleNotes}>
              <MaterialIcons name="note" size={16} color="#1D9E75" />
              <Text style={styles.editText}>Manage Notes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>{notesContent}</View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    paddingVertical: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0', // light gray line
    width: '100%',
    marginVertical: 6, // spacing above and below
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1d',
    marginBottom: 10,
    textAlign: 'left',
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes label left, value right
    alignItems: 'center',
    marginVertical: 4,
  },

  sectionLabel: {
    fontSize: 14,
    color: '#555',
  },

  sectionValue: {
    fontSize: 14,
    color: '#000', // darker for emphasis
    textAlign: 'right',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    // textTransform: 'uppercase',
  },

  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.components.button.base,
    ...theme.components.button.sizes.sm.container,
    ...theme.components.button.variants.secondary,
    gap: theme.spacing.xs,
  },

  editText: {
    ...theme.components.button.text.base,
    ...theme.components.button.text.variants.secondary,
    fontSize: theme.components.button.sizes.sm.text.fontSize,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  metaItem: {
    fontSize: 12,
    color: '#555',
  },

  metaItemPill: {
    fontSize: 12,
    color: '#555',
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bfe4d7',
    borderRadius: 999,
    alignSelf: 'flex-start',
    textTransform: 'capitalize',
  },

  metaDot: {
    marginHorizontal: 6,
    color: '#999',
  },

  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  // BUTTONS
  actionBtn: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    ...theme.components.button.base,
    ...theme.components.button.sizes.sm.container,
    ...theme.components.button.variants.secondary,
  },

  actionBtnText: {
    ...theme.components.button.text.base,
    ...theme.components.button.text.variants.secondary,
    fontSize: theme.components.button.sizes.sm.text.fontSize,
  },

  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.components.button.base,
    ...theme.components.button.sizes.sm.container,
    ...theme.components.button.variants.primary,
    gap: theme.spacing.xs,
  },

  advanceBtnText: {
    ...theme.components.button.text.base,
    ...theme.components.button.text.variants.primary,
    fontSize: theme.components.button.sizes.sm.text.fontSize,
  },

  listContainer: {
    flexDirection: 'column',
  },

  // Pipeline
  pipeline: {
    marginVertical: 16,
  },

  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    color: '#666',
    marginBottom: 6,
  },

  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DADADA',
    alignSelf: 'stretch',
  },

  stageItem: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRightWidth: 1,
    alignItems: 'center',
  },

  stageText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // PASSED
  passedStage: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },

  passedText: {
    color: '#047857',
  },

  // CURRENT
  currentStage: {
    backgroundColor: '#1D9E75',
    borderColor: '#1D9E75',
  },

  currentText: {
    color: '#FFFFFF',
  },

  // UPCOMING
  upcomingStage: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },

  upcomingText: {
    color: '#6B7280',
  },

  // FAILED
  failedStage: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },

  failedText: {
    color: '#B91C1C',
  },

  // NOTES
  noteCard: {
    marginBottom: theme.spacing.sm,
  },

  noteText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  noteMeta: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
