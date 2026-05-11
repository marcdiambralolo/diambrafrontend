import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { Position } from '../interfaces';
import { styles } from './analysis-pdf.styles';
import { formatPosition } from './analysis-pdf.utils';

const PositionCard: React.FC<{ position: Position; index: number }> = ({ position, index }) => (
  <View style={styles.positionCard}>
    <Text style={styles.positionText}>
      {formatPosition(position, index)}
    </Text>
  </View>
);

export default PositionCard;