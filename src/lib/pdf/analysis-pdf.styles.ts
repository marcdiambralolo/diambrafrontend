import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    header: {
        marginBottom: 20,
        borderBottom: '2 solid #8b5cf6',
        paddingBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#8b5cf6',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 2,
    },
    section: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 6,
        borderLeft: '3 solid #8b5cf6',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subsectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4b5563',
        marginTop: 8,
        marginBottom: 4,
    },
    text: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#374151',
        marginBottom: 6,
    },
    textBold: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#374151',
        fontWeight: 'bold',
    },
    listItem: {
        fontSize: 9,
        color: '#374151',
        marginBottom: 4,
        marginLeft: 10,
        lineHeight: 1.4,
    },
    highlight: {
        backgroundColor: '#ede9fe',
        padding: 8,
        borderRadius: 4,
        marginVertical: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
        borderTop: '1 solid #e5e7eb',
        paddingTop: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 10,
    },
    positionCard: {
        marginBottom: 3,
        padding: 6,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        borderLeft: '2 solid #8b5cf6',
    },
    positionText: {
        fontSize: 8,
        color: '#374151',
        lineHeight: 1.3,
    },
});