
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../../components/Card';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';
import { useAuthStore } from '../../store/userStore';
import { supabase, UserProfile } from '../../config/supabase';

interface UserWithProfile extends UserProfile {
  email: string;
  created_at: string;
}

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { profile } = useAuthStore();

  // Redirect if not admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('userprofile')
        .select(`
          *,
          users!inner (
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching users:', error.message);
        return;
      }

      const usersWithProfile = data?.map((item: any) => ({
        ...item,
        email: item.users.email,
        created_at: item.users.created_at,
      })) || [];

      setUsers(usersWithProfile);
      setFilteredUsers(usersWithProfile);
    } catch (err) {
      console.log('Exception fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedRole, users]);

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    Alert.alert(
      currentStatus ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur',
      `Êtes-vous sûr de vouloir ${currentStatus ? 'désactiver' : 'activer'} cet utilisateur ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: currentStatus ? 'Désactiver' : 'Activer',
          style: currentStatus ? 'destructive' : 'default',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('userprofile')
                .update({ verified: !currentStatus })
                .eq('user_id', userId);

              if (error) {
                Alert.alert('Erreur', 'Impossible de modifier le statut de l\'utilisateur');
                return;
              }

              // Update local state
              setUsers(prev => prev.map(user => 
                user.user_id === userId 
                  ? { ...user, verified: !currentStatus }
                  : user
              ));

              Alert.alert(
                'Succès',
                `Utilisateur ${currentStatus ? 'désactivé' : 'activé'} avec succès`
              );
            } catch (err) {
              Alert.alert('Erreur', 'Une erreur est survenue');
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return themeColors.error;
      case 'entreprise':
        return themeColors.primary;
      case 'formateur':
        return themeColors.secondary;
      case 'candidat':
        return themeColors.success;
      default:
        return themeColors.textSecondary;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'entreprise':
        return 'Entreprise';
      case 'formateur':
        return 'Formateur';
      case 'candidat':
        return 'Candidat';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderUserItem = ({ item }: { item: UserWithProfile }) => (
    <Card style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {item.full_name || 'Nom non renseigné'}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
              <Text style={styles.roleText}>
                {getRoleLabel(item.role)}
              </Text>
            </View>
          </View>
          <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>
            {item.email}
          </Text>
          <Text style={[styles.userDate, { color: themeColors.textSecondary }]}>
            Inscrit le {formatDate(item.created_at)}
          </Text>
        </View>
        
        <View style={styles.userActions}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              {
                backgroundColor: item.verified 
                  ? themeColors.success 
                  : themeColors.warning,
              },
            ]}
            onPress={() => toggleUserStatus(item.user_id, item.verified)}
          >
            <IconSymbol
              name={item.verified ? 'check-circle' : 'block'}
              size={16}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {item.location && (
        <View style={styles.userDetails}>
          <IconSymbol name="location-on" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.userLocation, { color: themeColors.textSecondary }]}>
            {item.location}
          </Text>
        </View>
      )}
      
      {item.skills && item.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={[styles.skillChip, { backgroundColor: themeColors.highlight }]}>
              <Text style={[styles.skillText, { color: themeColors.primary }]}>
                {skill}
              </Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <Text style={[styles.moreSkills, { color: themeColors.textSecondary }]}>
              +{item.skills.length - 3} autres
            </Text>
          )}
        </View>
      )}
    </Card>
  );

  const RoleFilter = () => (
    <View style={styles.roleFilter}>
      {['all', 'candidat', 'entreprise', 'formateur', 'admin'].map((role) => (
        <TouchableOpacity
          key={role}
          style={[
            styles.roleFilterButton,
            {
              backgroundColor: selectedRole === role 
                ? themeColors.primary 
                : themeColors.card,
              borderColor: selectedRole === role 
                ? themeColors.primary 
                : themeColors.border,
            },
          ]}
          onPress={() => setSelectedRole(role)}
        >
          <Text
            style={[
              styles.roleFilterText,
              {
                color: selectedRole === role 
                  ? '#FFFFFF' 
                  : themeColors.text,
              },
            ]}
          >
            {role === 'all' ? 'Tous' : getRoleLabel(role)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Gestion des utilisateurs"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
          containerStyle={styles.searchInput}
        />
        <RoleFilter />
      </View>
      
      <View style={styles.statsBar}>
        <Text style={[styles.statsText, { color: themeColors.textSecondary }]}>
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
        </Text>
      </View>
      
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.usersList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchUsers}
            colors={[themeColors.primary]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <IconSymbol name="people-outline" size={64} color={themeColors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                Aucun utilisateur trouvé
              </Text>
              <Text style={[styles.emptyMessage, { color: themeColors.textSecondary }]}>
                Aucun utilisateur ne correspond à vos critères de recherche.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  roleFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleFilterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  roleFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  statsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  usersList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  userCard: {
    marginBottom: spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.h3,
    fontSize: 16,
    flex: 1,
    marginRight: spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  userDate: {
    fontSize: 12,
  },
  userActions: {
    marginLeft: spacing.md,
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  userLocation: {
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  skillChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyMessage: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});
