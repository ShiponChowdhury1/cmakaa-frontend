import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9C65',
    paddingBottom: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B2A4A',
  },
  subtitle: {
    fontSize: 10,
    color: '#E05A1E',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 9,
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 12,
    marginTop: 10,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    backgroundColor: '#F3F4F6',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableCell: {
    fontSize: 8,
    color: '#4B5563',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9CA3AF',
  },
});

interface PdfReportProps {
  title: string;
  dateRange: string;
  data: any[];
  type: 'stats' | 'bankers' | 'pardnas' | 'audit';
}

export const PdfReport: React.FC<PdfReportProps> = ({ title, dateRange, data, type }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PardnaBook Platform Report</Text>
          <Text style={styles.subtitle}>{title}</Text>
        </View>

        {/* Meta */}
        <View style={styles.metaSection}>
          <Text>Date Range: {dateRange}</Text>
          <Text>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</Text>
        </View>

        {/* Content */}
        <Text style={styles.sectionTitle}>Data Records ({data.length})</Text>

        {type === 'stats' && (
          <View style={{ gap: 8, marginBottom: 20 }}>
            {data.map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151' }}>{item.label}</Text>
                <Text style={{ fontSize: 10, color: '#111827', fontWeight: 'bold' }}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

        {type === 'bankers' && (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Name</Text></View>
              <View style={[styles.tableColHeader, { width: '35%' }]}><Text style={styles.tableCellHeader}>Email</Text></View>
              <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Pardnas</Text></View>
              <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Joined</Text></View>
            </View>
            {/* Table Body */}
            {data.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{row.name}</Text></View>
                <View style={[styles.tableCol, { width: '35%' }]}><Text style={styles.tableCell}>{row.email}</Text></View>
                <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{row.pardnas}</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{row.joined}</Text></View>
              </View>
            ))}
          </View>
        )}

        {type === 'pardnas' && (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Pardna Name</Text></View>
              <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Banker</Text></View>
              <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Members</Text></View>
              <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Collected</Text></View>
              <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableCellHeader}>Status</Text></View>
            </View>
            {/* Table Body */}
            {data.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{row.name}</Text></View>
                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{row.banker}</Text></View>
                <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{row.members}</Text></View>
                <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{row.collected}</Text></View>
                <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{row.status}</Text></View>
              </View>
            ))}
          </View>
        )}

        {type === 'audit' && (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Timestamp</Text></View>
              <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Actor</Text></View>
              <View style={[styles.tableColHeader, { width: '25%' }]}><Text style={styles.tableCellHeader}>Action</Text></View>
              <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Entity</Text></View>
            </View>
            {/* Table Body */}
            {data.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{row.timestamp}</Text></View>
                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{row.actor}</Text></View>
                <View style={[styles.tableCol, { width: '25%' }]}><Text style={styles.tableCell}>{row.action}</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{row.entity}</Text></View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>© {new Date().getFullYear()} PardnaBook. All rights reserved.</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
