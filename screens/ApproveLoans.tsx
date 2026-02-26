import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';

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
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/loans');
      const data = await response.json();
      console.log('Fetched loans:', data); // Debug log
      setLoans(data || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
      Alert.alert('Error', 'Failed to fetch loans');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3000/loans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update loan');
      }
      
      setLoans(loans.map(l => l.id === id ? { ...l, status } : l));
      Alert.alert('Success', `Loan ${status} successfully`);
    } catch (error) {
      console.error('Error updating loan:', error);
      Alert.alert('Error', 'Failed to update loan');
    }
  };

  const getStatusColor = (status: string = 'Pending') => {
    switch(status) {
      case 'Accepted': return '#28a745';
      case 'Rejected': return '#dc3545';
      case 'Pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const formatCurrency = (amount: any): string => {
    if (amount === undefined || amount === null) return '$0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? '$0' : `$${numAmount.toLocaleString()}`;
  };

  const formatNumber = (value: any, defaultValue: string = 'N/A'): string => {
    if (value === undefined || value === null) return defaultValue;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? defaultValue : numValue.toString();
  };

  const filteredLoans = loans.filter(l => filter === 'All' || l.status === filter);
  const pendingCount = loans.filter(l => l.status === 'Pending').length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066c0" />
        <Text style={styles.loadingText}>Loading loans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loan Applications</Text>
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingCount} Pending</Text>
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Pending', 'Accepted', 'Rejected'].map(f => {
            const count = f === 'All' ? loans.length : loans.filter(l => l.status === f).length;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive
                ]}>
                  {f} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.loanList}>
        {filteredLoans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {filter !== 'All' ? filter.toLowerCase() : ''} loan applications found</Text>
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
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(loan.amount)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Employer:</Text>
                  <Text style={styles.detailValue}>{loan.employer || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Monthly Salary:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(loan.monthlySalary)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Credit Score:</Text>
                  <Text style={[styles.detailValue, styles.creditScore]}>
                    {loan.creditScore || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Interest Rate:</Text>
                  <Text style={styles.detailValue}>
                    {loan.interestRate ? `${loan.interestRate}%` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Term:</Text>
                  <Text style={styles.detailValue}>
                    {loan.termLength ? `${loan.termLength} months` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applied:</Text>
                  <Text style={styles.detailValue}>{loan.appliedDate || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton, loan.status === 'Accepted' && styles.disabledButton]}
                  onPress={() => updateLoan(loan.id, 'Accepted')}
                  disabled={loan.status === 'Accepted'}
                >
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton, loan.status === 'Rejected' && styles.disabledButton]}
                  onPress={() => updateLoan(loan.id, 'Rejected')}
                  disabled={loan.status === 'Rejected'}
                >
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#0066c0',
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  pendingBadge: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#0066c0',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  loanList: {
    padding: 16,
  },
  loanCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loanApplicant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loanId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loanDetails: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  creditScore: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
  },
});