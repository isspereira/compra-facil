import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductsContext } from '../context/ProductsContext';
import styles from '../styles';

function SummaryScreen() {
  const { products } = useContext(ProductsContext);

  const purchased = products.filter(item => item.purchased);
  const pending = products.filter(item => !item.purchased);

  const total = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Resumo</Text>

        <Text style={styles.subtitle}>
          Acompanhe suas compras
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.totalLabel}>Total estimado</Text>

        <Text style={styles.totalValue}>
          R$ {total.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{products.length}</Text>
        <Text style={styles.statLabel}>Total de produtos</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{pending.length}</Text>
        <Text style={styles.statLabel}>Produtos pendentes</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{purchased.length}</Text>
        <Text style={styles.statLabel}>Produtos comprados</Text>
      </View>
    </SafeAreaView>
  );
}

export default SummaryScreen;
