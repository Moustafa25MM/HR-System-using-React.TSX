import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

interface Attendance {
  date: string;
  status: string;
  signInTime: string;
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
    width: '33%',
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

const AttendanceDocument = ({
  attendances,
  email,
  name,
}: {
  attendances: Attendance[];
  email: string;
  name: string;
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>{email}</Text>
      <Text style={styles.header}>{name}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Date</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Status</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.header}>Sign-In</Text>
          </View>
        </View>
        {attendances.map((attendance, index) => {
          const date = new Date(attendance.date);
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, '0')}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getFullYear()}`;

          return (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formattedDate}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{attendance.status}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{attendance.signInTime}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default AttendanceDocument;
