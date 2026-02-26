/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#1155cc', // Corporate Blue
        paddingBottom: 10,
    },
    logo: {
        width: 60,
        height: 60,
    },
    headerText: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    subHeader: {
        fontSize: 10,
        color: '#666666',
        marginTop: 4,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1155cc',
        textTransform: 'uppercase',
    },
    metaGrid: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
    },
    metaItem: {
        flexDirection: 'column',
        marginRight: 30,
    },
    metaLabel: {
        fontSize: 8,
        color: '#888888',
        textTransform: 'uppercase',
    },
    metaValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
    },
    bulletList: {
        marginLeft: 10,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        fontSize: 10,
        flex: 1,
        lineHeight: 1.5,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    photoCard: {
        width: '45%', // Approximately 2 per row
        margin: '2%',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 5,
    },
    photoImage: {
        width: '100%',
        height: 150,
        objectFit: 'contain',
        backgroundColor: '#f0f0f0',
    },
    photoCaption: {
        fontSize: 9,
        marginTop: 5,
        fontStyle: 'italic',
        color: '#555555',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#aaaaaa',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 10,
    },
});

export interface ShiftReportPDFProps {
    projectTitle: string;
    projectDescription?: string;
    date: Date;
    shift: string;
    bullets: string[];
    photos: { file?: File; id: string; preview: string; caption: string }[];
    user?: {
        name?: string | null;
        email?: string | null;
    };
}

const ShiftReportPDF: React.FC<ShiftReportPDFProps> = ({
    projectTitle,
    projectDescription,
    date,
    shift,
    bullets,
    photos,
    user,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                {/* Logo - referenced from public folder */}
                <Image src="/csu-logo.jpg" style={styles.logo} />

                <View style={styles.headerText}>
                    <Text style={styles.title}>Shift Report</Text>
                    <Text style={styles.subHeader}>Construction Services Unit</Text>
                    {user?.name && (
                        <Text style={{ ...styles.subHeader, marginTop: 8, fontStyle: 'italic' }}>
                            Prepared By: {user.name}
                        </Text>
                    )}
                </View>
            </View>

            {/* Meta Data */}
            <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Project</Text>
                    <Text style={styles.metaValue}>{projectTitle}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Date</Text>
                    <Text style={styles.metaValue}>{date ? format(date, 'MMMM do, yyyy') : 'N/A'}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Shift</Text>
                    <Text style={styles.metaValue}>{shift}</Text>
                </View>
            </View>

            {/* Project Description */}
            {projectDescription && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Description</Text>
                    <Text style={{ fontSize: 10, lineHeight: 1.5, color: '#333333' }}>
                        {projectDescription}
                    </Text>
                </View>
            )}

            {/* Work Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Details</Text>
                <View style={styles.bulletList}>
                    {bullets.map((bullet, index) => (
                        <View key={index} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{bullet}</Text>
                        </View>
                    ))}
                    {bullets.length === 0 && (
                        <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#999' }}>
                            No work details recorded.
                        </Text>
                    )}
                </View>
            </View>

            {/* Photos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Site Photos</Text>
                <View style={styles.photoGrid}>
                    {photos.map((photo, index) => (
                        <View key={index} style={styles.photoCard}>
                            {/* React-pdf Image supports url strings (previews) */}
                            <Image src={photo.preview} style={styles.photoImage} />
                            <Text style={styles.photoCaption}>{photo.caption || 'No caption'}</Text>
                        </View>
                    ))}
                    {photos.length === 0 && (
                        <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#999' }}>
                            No photos attached.
                        </Text>
                    )}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Generated by CSU Reporting App • {format(new Date(), 'Pp')}</Text>
            </View>
        </Page>
    </Document>
);

export default ShiftReportPDF;
