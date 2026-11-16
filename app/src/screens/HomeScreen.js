import React, { useContext } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProductsContext, GREEN } from '../context/ProductsContext';
import styles from '../styles';

function HomeScreen({ navigation }) {
  const { products, togglePurchased, deleteProduct, loading } =
    useContext(ProductsContext);

  const total = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function confirmDelete(id) {
    Alert.alert(
      'Excluir produto',
      'Deseja realmente excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteProduct(id),
        },
      ]
    );
  }

  function renderProduct({ item }) {
    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.productInfo}
          onPress={() => togglePurchased(item.id)}
        >
          <Ionicons
            name={item.purchased ? 'checkbox' : 'square-outline'}
            size={25}
            color={GREEN}
          />

          <View style={{ flex: 1, marginLeft: 10 }}>
            {item.imageUri && (
              <Image
                source={{ uri: item.imageUri }}
                style={styles.productImage}
              />
            )}

            <Text
              style={[
                styles.productName,
                item.purchased && styles.purchasedText,
              ]}
            >
              {item.name}
            </Text>

            <Text style={styles.smallText}>
              Quantidade: {item.quantity} • R$ {item.price.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddProduct', { product: item })
            }
          >
            <Ionicons name="create-outline" size={23} color={GREEN} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => confirmDelete(item.id)}>
            <Ionicons name="trash-outline" size={23} color="#D9534F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Compra Fácil</Text>
        <Text style={styles.subtitle}>Organize suas compras!</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Valor estimado da compra
        </Text>

        <Text style={styles.totalValue}>
          R$ {total.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Minha lista</Text>

        <Text style={styles.smallText}>
          {products.length} produto(s)
        </Text>
      </View>

      {loading ? (
        <Text style={styles.emptyText}>Carregando seus produtos...</Text>
      ) : (
      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Sua lista está vazia. Adicione seu primeiro produto!
          </Text>
        }
      />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons
          name="add-circle-outline"
          size={23}
          color="#FFFFFF"
        />

        <Text style={styles.addButtonText}>
          Adicionar produto
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HomeScreen;
