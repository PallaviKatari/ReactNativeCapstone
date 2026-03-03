import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import { CommonActions, useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext) as { user: any; setUser: any };
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  // Logout function with reset
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
    if (!user) return;
    fetchLoans();
  }, [user]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/loans');
      const data: Loan[] = await response.json();

      if (user.role === 'Customer') {
        setUserLoans(data.filter(l => l.customerId === user.id));
      } else if (user.role === 'Manager') {
        setUserLoans(data);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066c0" />
        <Text style={styles.loadingText}>{!user ? 'Redirecting...' : 'Loading loans...'}</Text>
      </View>
    );
  }

  // Manager view
  if (user.role === 'Manager') {
    const pendingCount = userLoans.filter(l => l.status === 'Pending').length;
    const acceptedCount = userLoans.filter(l => l.status === 'Accepted').length;
    const rejectedCount = userLoans.filter(l => l.status === 'Rejected').length;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.managerContainer}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <Image source={{ uri: user.profilePic }} style={styles.managerImage} />
          <Text style={styles.managerName}>{user.name}</Text>
          <Text style={styles.managerText}>Manager Dashboard</Text>
          <Text style={styles.managerSubtext}>You have access to all loan applications</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryHeader}>Loan Application Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryAmount}>Total Pending: {pendingCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryAmount}>Total Accepted: {acceptedCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryAmount}>Total Rejected: {rejectedCount}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Customer view
  const mainLoan = userLoans.find(l => l.status === 'Pending') || userLoans[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileDetail}>Date of Birth: {user.dob}</Text>
          <Text style={styles.profileDetail}>Gender: {user.gender}</Text>
          <Text style={styles.profileDetail}>Email: {user.email}</Text>
        </View>
      </View>

      {/* Main Loan */}
      {mainLoan && (
        <View style={styles.loanSection}>
          <Text style={styles.sectionHeader}>Your Loan Application</Text>
          <View style={styles.loanCard}>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Applicant:</Text><Text style={styles.loanValue}>{mainLoan.applicant}</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>DOB:</Text><Text style={styles.loanValue}>{mainLoan.dob}</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Employer:</Text><Text style={styles.loanValue}>{mainLoan.employer}</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Monthly Salary:</Text><Text style={styles.loanValue}>${mainLoan.monthlySalary.toLocaleString()}</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Applied Amount:</Text><Text style={styles.loanValue}>${mainLoan.amount.toLocaleString()}</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Credit Score:</Text><Text style={[styles.loanValue, styles.creditScore]}>{mainLoan.creditScore}</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Interest Rate:</Text><Text style={styles.loanValue}>{mainLoan.interestRate}%</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Term Length:</Text><Text style={styles.loanValue}>{mainLoan.termLength} months</Text></View>
            <View style={styles.loanRow}><Text style={styles.loanLabel}>Applied Date:</Text><Text style={styles.loanValue}>{mainLoan.appliedDate}</Text></View>
          </View>
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>Application Status: {mainLoan.status}</Text>
          </View>
        </View>
      )}

      {/* Loan History */}
      {userLoans.length > 0 && (
        <View style={styles.summarySection}>
          <Text style={styles.summaryHeader}>Your Loan History</Text>
          {userLoans.map(loan => (
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

// Status color helper
const getStatusColor = (status: string) => {
  switch(status) {
    case 'Accepted': return '#28a745';
    case 'Rejected': return '#dc3545';
    case 'Pending': return '#ffc107';
    default: return '#6c757d';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#666' },
  managerContainer: { alignItems: 'center', padding: 20 },
  managerImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  managerName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  managerText: { fontSize: 18, fontWeight: 'bold', color: '#0066c0', marginBottom: 4 },
  managerSubtext: { fontSize: 14, color: '#666' },
  welcomeContainer: { backgroundColor: '#0066c0', padding: 20, alignItems: 'center', marginBottom: 16 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  logoutButton: { position: 'absolute', top: 16, right: 16 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  profileCard: { flexDirection: 'row', backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width:0,height:2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  profileDetail: { fontSize: 14, color: '#666', marginBottom: 2 },
  loanSection: { padding: 16 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#0066c0', marginBottom: 12 },
  loanCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3, marginBottom:16 },
  loanRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:6, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
  loanLabel: { fontSize:14, color:'#666', fontWeight:'500' },
  loanValue: { fontSize:14, color:'#333', fontWeight:'500' },
  creditScore: { color:'#2e7d32', fontWeight:'bold' },
  pendingContainer: { backgroundColor:'#fff3cd', padding:16, borderRadius:8, borderWidth:1, borderColor:'#ffeeba', marginBottom:16 },
  pendingText: { fontSize:16, fontWeight:'bold', color:'#856404', textAlign:'center', marginBottom:12 },
  summarySection: { padding:16, paddingTop:0 },
  summaryHeader: { fontSize:18, fontWeight:'bold', marginBottom:12, color:'#333' },
  summaryCard: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'white', padding:12, borderRadius:6, marginBottom:8, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:2, elevation:2 },
  summaryAmount: { fontSize:16, fontWeight:'500', color:'#333' },
  summaryStatus: { paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
  summaryStatusText: { color:'white', fontSize:12, fontWeight:'bold' },
});