import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';

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

export default function ProfileScreen() {
  const { user } = useContext(UserContext) as { user: any };
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'Customer') {
      fetchLoans();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchLoans = async () => {
    try {
      const response = await fetch('http://localhost:3000/loans');
      const data = await response.json();
      
      // Filter loans for current user
      const userSpecificLoans = data.filter((loan: Loan) => loan.customerId === user.id);
      setUserLoans(userSpecificLoans);
      
      // Get pending loans (for demo, showing all pending loans)
      const pending = data.filter((loan: Loan) => loan.status === 'Pending');
      setPendingLoans(pending);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066c0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Please log in to view your profile.</Text>
      </View>
    );
  }

  if (user.role === 'Manager') {
    return (
      <View style={styles.managerContainer}>
        <Image source={{ uri: user.profilePic }} style={styles.managerImage} />
        <Text style={styles.managerName}>{user.name}</Text>
        <Text style={styles.managerText}>Manager Dashboard</Text>
        <Text style={styles.managerSubtext}>You have access to all loan applications</Text>
      </View>
    );
  }

  // Get the first loan for the main display (matching the screenshot)
  const mainLoan = userLoans.find(loan => loan.status === 'Pending') || userLoans[0];
  const femaleApplicant = pendingLoans.find(loan => loan.applicant.includes('Jane') || loan.applicant.includes('Smith'));

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileDetail}>Date of Birth: {user.dob}</Text>
          <Text style={styles.profileDetail}>Gender: {user.gender}</Text>
          <Text style={styles.profileDetail}>Email: {user.email}</Text>
        </View>
      </View>

      {/* CHASE Loan Application Section */}
      {mainLoan && (
        <View style={styles.loanSection}>
          <Text style={styles.sectionHeader}>CHASE</Text>
          <View style={styles.loanCard}>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Applicant:</Text>
              <Text style={styles.loanValue}>{mainLoan.applicant}</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>DOB:</Text>
              <Text style={styles.loanValue}>{mainLoan.dob}</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Employer:</Text>
              <Text style={styles.loanValue}>{mainLoan.employer}</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Monthly Salary:</Text>
              <Text style={styles.loanValue}>${mainLoan.monthlySalary.toLocaleString()}</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Applied Amount:</Text>
              <Text style={styles.loanValue}>${mainLoan.amount.toLocaleString()}</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Credit Score:</Text>
              <Text style={[styles.loanValue, styles.creditScore]}>{mainLoan.creditScore}</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Interest Rate:</Text>
              <Text style={styles.loanValue}>{mainLoan.interestRate}%</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Term Length:</Text>
              <Text style={styles.loanValue}>{mainLoan.termLength} months</Text>
            </View>
            <View style={styles.loanRow}>
              <Text style={styles.loanLabel}>Applied Date:</Text>
              <Text style={styles.loanValue}>{mainLoan.appliedDate}</Text>
            </View>
          </View>

          {/* Application Pending Status */}
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>Application Pending</Text>
            <View style={styles.buttonContainer}>
              <View style={[styles.actionButton, styles.acceptButton]}>
                <Text style={styles.buttonText}>Accept</Text>
              </View>
              <View style={[styles.actionButton, styles.rejectButton]}>
                <Text style={styles.buttonText}>Reject</Text>
              </View>
            </View>
          </View>

          {/* Applicant Gender Section - Dynamic based on data */}
          {femaleApplicant && (
            <View style={styles.genderSection}>
              <Text style={styles.genderHeader}>Applicant Gender</Text>
              <View style={styles.genderCard}>
                <Text style={styles.genderTitle}>Female</Text>
                <View style={styles.genderInfo}>
                  <Text style={styles.genderDetail}>DOB: {femaleApplicant.dob}</Text>
                  <Text style={styles.genderDetail}>Employer: {femaleApplicant.employer}</Text>
                  <Text style={styles.genderDetail}>Monthly Salary: ${femaleApplicant.monthlySalary.toLocaleString()}</Text>
                  <Text style={styles.genderDetail}>Applied Amount: ${femaleApplicant.amount.toLocaleString()}</Text>
                  <Text style={styles.genderDetail}>Credit Score: {femaleApplicant.creditScore}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* All User Loans Summary */}
      {userLoans.length > 0 && (
        <View style={styles.summarySection}>
          <Text style={styles.summaryHeader}>Your Loan History</Text>
          {userLoans.map((loan) => (
            <View key={loan.id} style={styles.summaryCard}>
              <Text style={styles.summaryAmount}>${loan.amount.toLocaleString()}</Text>
              <View style={[styles.summaryStatus, { backgroundColor: getStatusColor(loan.status) }]}>
                <Text style={styles.summaryStatusText}>{loan.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Accepted': return '#28a745';
    case 'Rejected': return '#dc3545';
    case 'Pending': return '#ffc107';
    default: return '#6c757d';
  }
};

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  managerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  managerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  managerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  managerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066c0',
    marginBottom: 4,
  },
  managerSubtext: {
    fontSize: 14,
    color: '#666',
  },
  welcomeContainer: {
    backgroundColor: '#0066c0',
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  loanSection: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066c0',
    marginBottom: 12,
  },
  loanCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  loanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  loanLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loanValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  creditScore: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  pendingContainer: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    marginBottom: 16,
  },
  pendingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  genderSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  genderHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  genderCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
  },
  genderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066c0',
    marginBottom: 8,
  },
  genderInfo: {
    gap: 4,
  },
  genderDetail: {
    fontSize: 14,
    color: '#666',
  },
  summarySection: {
    padding: 16,
    paddingTop: 0,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  summaryStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});