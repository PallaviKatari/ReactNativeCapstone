import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation, CommonActions } from '@react-navigation/native';

interface Loan {
  id: string;
  customerId: string;
  applicant: string;
  dob: string;
  employer: string;
  monthlySalary: number;
  amount: number;
  creditScore: number;
  interestRate: number;
  termLength: number;
  appliedDate: string;
  status: string;
}

export default function ApproveLoans() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext) as { user: any; setUser: any };
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Logout handler
  const logout = () => {
    setUser(null);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      })
    );
  };

  useEffect(() => {
    if (!user) return; // Prevent crash if user is null
    fetchLoans();
  }, [user]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/loans');
      const data: Loan[] = await response.json();
      if (user.role === 'Manager') setLoans(data);
      else setLoans(data.filter(l => l.customerId === user.id));
    } catch (error) {
      console.error('Error fetching loans:', error);
      Alert.alert('Error', 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = async (id: string, status: string) => {
    if (!user) return;
    if (user.role !== 'Manager') {
      Alert.alert('Unauthorized', 'Only managers can approve or reject loans');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/loans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update loan');
      setLoans(loans.map(l => (l.id === id ? { ...l, status } : l)));
      Alert.alert('Success', `Loan ${status} successfully`);
    } catch (error) {
      console.error('Error updating loan:', error);
      Alert.alert('Error', 'Failed to update loan');
    }
  };

  const getStatusColor = (status: string = 'Pending') => {
    switch (status) {
      case 'Accepted':
        return '#28a745';
      case 'Rejected':
        return '#dc3545';
      case 'Pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const filteredLoans = loans.filter(l => filter === 'All' || l.status === filter);
  const pendingCount = loans.filter(l => l.status === 'Pending').length;

  if (!user || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066c0" />
        <Text style={styles.loadingText}>{!user ? 'Redirecting...' : 'Loading loans...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loan Applications</Text>
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingCount} Pending</Text>
          </View>
        )}
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Pending', 'Accepted', 'Rejected'].map(f => {
            const count = f === 'All' ? loans.length : loans.filter(l => l.status === f).length;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                  {f} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Loan List */}
      <ScrollView style={styles.loanList}>
        {filteredLoans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {filter !== 'All' ? filter.toLowerCase() : ''} loan applications found
            </Text>
          </View>
        ) : (
          filteredLoans.map(loan => (
            <View key={loan.id} style={styles.loanCard}>
              <View style={styles.loanHeader}>
                <View>
                  <Text style={styles.loanApplicant}>{loan.applicant || 'Unknown Applicant'}</Text>
                  <Text style={styles.loanId}>Loan #{loan.id}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(loan.status) }]}>
                  <Text style={styles.statusText}>{loan.status || 'Pending'}</Text>
                </View>
              </View>

              <View style={styles.loanDetails}>
                <Text>Amount: ${loan.amount.toLocaleString()}</Text>
                <Text>Employer: {loan.employer}</Text>
                <Text>Monthly Salary: ${loan.monthlySalary.toLocaleString()}</Text>
                <Text>Credit Score: {loan.creditScore}</Text>
                <Text>Interest Rate: {loan.interestRate}%</Text>
                <Text>Term: {loan.termLength} months</Text>
                <Text>Applied: {loan.appliedDate}</Text>
              </View>

              {user.role === 'Manager' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.acceptButton,
                      loan.status === 'Accepted' && styles.disabledButton,
                    ]}
                    onPress={() => updateLoan(loan.id, 'Accepted')}
                    disabled={loan.status === 'Accepted'}
                  >
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.rejectButton,
                      loan.status === 'Rejected' && styles.disabledButton,
                    ]}
                    onPress={() => updateLoan(loan.id, 'Rejected')}
                    disabled={loan.status === 'Rejected'}
                  >
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#0066c0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  pendingBadge: { backgroundColor: '#ffc107', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pendingBadgeText: { color: '#333', fontWeight: 'bold' },
  logoutButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff', borderRadius: 6 },
  logoutText: { color: '#0066c0', fontWeight: 'bold' },
  filterContainer: { paddingVertical: 10, paddingLeft: 16 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#e0e0e0', borderRadius: 20, marginRight: 10 },
  filterButtonActive: { backgroundColor: '#0066c0' },
  filterText: { color: '#333', fontWeight: '500' },
  filterTextActive: { color: 'white' },
  loanList: { paddingHorizontal: 16, paddingBottom: 16 },
  loanCard: { backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width:0, height:1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  loanApplicant: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  loanId: { fontSize: 12, color: '#666' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  loanDetails: { marginBottom: 8 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginHorizontal: 4 },
  acceptButton: { backgroundColor: '#28a745' },
  rejectButton: { backgroundColor: '#dc3545' },
  actionButtonText: { color: 'white', fontWeight: 'bold' },
  disabledButton: { opacity: 0.6 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyStateText: { color: '#666', fontSize: 16 },
});