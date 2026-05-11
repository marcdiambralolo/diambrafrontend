import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Sujet } from '../interfaces';
import { styles } from './analysis-pdf.styles';

const PageHeader: React.FC<{ sujet: Sujet; dateGeneration: string }> = ({ sujet, dateGeneration }) => (
    <View style={styles.header}>
        <Text style={styles.title}>✨ Analyse Astrologique Complète</Text>
        <Text style={styles.subtitle}>
            {sujet.prenoms.length > 40 ? sujet.prenoms.substring(0, 37) + '...' : sujet.prenoms} {sujet.nom}
        </Text>
        <Text style={styles.subtitle}>
            Né(e) le {sujet.dateNaissance} à {sujet.heureNaissance}
        </Text>
        <Text style={styles.subtitle}>
            {sujet.lieuNaissance}
        </Text>
        <Text style={styles.subtitle}>
            Généré le {new Date(dateGeneration).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })}
        </Text>
    </View>
);

export default PageHeader;