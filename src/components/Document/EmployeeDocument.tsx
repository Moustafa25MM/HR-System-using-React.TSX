import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

interface Employee {
  name: string;
  email: string;
  netSalary: number;
  grossSalary: number;
  task: string;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});

const EmployeeDocument = ({ employees }: { employees: Employee[] }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Email</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Net Salary</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Gross Salary</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Task</Text>
          </View>
        </View>
        {employees.map((employee, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{employee.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{employee.email}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{employee.netSalary}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{employee.grossSalary}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{employee.task}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default EmployeeDocument;
