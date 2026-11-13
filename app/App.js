
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

import { db, auth } from './src/firebase';

// CONTEXTO GLOBAL
const ProductsContext = createContext();

function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  // AUTENTICAÇÃO E CONEXÃO COM FIREBASE
  useEffect(() => {
    let unsubscribeProducts = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async user => {
      try {
        if (!user) {
          await signInAnonymously(auth);
          return;
        }

        setUserId(user.uid);

        if (unsubscribeProducts) {
          unsubscribeProducts();
        }

        const productsRef = collection(db, 'products');

        const userProductsQuery = query(
          productsRef,
          where('ownerId', '==', user.uid)
        );

        unsubscribeProducts = onSnapshot(
          userProductsQuery,
          snapshot => {
            const productsList = snapshot.docs.map(document => ({
              id: document.id,
              ...document.data(),
            }));

            setProducts(productsList);
          },
          error => {
            console.error('Erro ao carregar produtos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os produtos.');
          }
        );
      } catch (error) {
        console.error('Erro na autenticação:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao Firebase.');
      }
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeProducts) {
        unsubscribeProducts();
      }
    };
  }, []);

  // CADASTRAR OU EDITAR PRODUTO
  async function saveProduct(product) {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('Usuário ainda não autenticado.');
      }

      const productData = {
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        purchased: product.purchased || false,
        imageUri: product.imageUri || null,
        ownerId: currentUser.uid,
      };

      if (product.id) {
        await updateDoc(
          doc(db, 'products', product.id),
          productData
        );
      } else {
        await addDoc(
          collection(db, 'products'),
          productData
        );
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);

      Alert.alert('Erro', 'Não foi possível salvar o produto.');
      throw error;
    }
  }

  // MARCAR OU DESMARCAR PRODUTO COMPRADO
  async function togglePurchased(id) {
    try {
      const product = products.find(item => item.id === id);

      if (!product) return;

      await updateDoc(
        doc(db, 'products', id),
        {
          purchased: !product.purchased,
        }
      );
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    }
  }

  // EXCLUIR PRODUTO
  async function deleteProduct(id) {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      Alert.alert('Erro', 'Não foi possível excluir o produto.');
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        saveProduct,
        togglePurchased,
        deleteProduct,
        userId,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const GREEN = '#238B57';
const LIGHT_GREEN = '#EAF6EF';

// TELA INICIAL
function HomeScreen({ navigation }) {
  const { products, togglePurchased, deleteProduct } =
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

// TELA DE CADASTRO E EDIÇÃO
function AddProductScreen({ navigation, route }) {
  const { saveProduct } = useContext(ProductsContext);

  const editingProduct = route.params?.product;

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(editingProduct?.name || '');
    setQuantity(String(editingProduct?.quantity || 1));

    setPrice(
      editingProduct
        ? String(editingProduct.price).replace('.', ',')
        : ''
    );

    setImageUri(editingProduct?.imageUri || null);
  }, [editingProduct]);

  // SELECIONAR IMAGEM DA GALERIA
  async function selectImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à galeria para escolher uma imagem.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  }

  async function handleSave() {
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price.replace(',', '.'));

    if (!name.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0 ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      Alert.alert(
        'Atenção',
        'Informe uma quantidade e um preço válidos.'
      );
      return;
    }

    try {
      setSaving(true);

      await saveProduct({
        id: editingProduct?.id,
        name: name.trim(),
        quantity: parsedQuantity,
        price: parsedPrice,
        purchased: editingProduct?.purchased || false,
        imageUri: imageUri,
      });

      navigation.goBack();
    } catch (error) {
      // A mensagem de erro é exibida na função saveProduct.
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.sectionTitle}>
          {editingProduct ? 'Editar produto' : 'Novo produto'}
        </Text>

        <Text style={styles.label}>Nome do produto</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Arroz"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Quantidade</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 2"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Preço unitário (R$)</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 10,50"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Foto do produto</Text>

        <TouchableOpacity
          style={styles.imageButton}
          onPress={selectImage}
        >
          <Ionicons
            name="image-outline"
            size={22}
            color={GREEN}
          />

          <Text style={styles.imageButtonText}>
            {imageUri ? 'Escolher outra foto' : 'Selecionar foto da galeria'}
          </Text>
        </TouchableOpacity>

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
            />

            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
            >
              <Ionicons name="trash-outline" size={18} color="#D9534F" />
              <Text style={styles.removeImageText}>Remover foto</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            saving && { opacity: 0.6 },
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.addButtonText}>
            {saving ? 'Salvando...' : 'Salvar produto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// TELA DE RESUMO
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

// NAVEGAÇÃO POR ABAS
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 5,
        },

        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Início'
              ? 'list-outline'
              : 'stats-chart-outline';

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Resumo" component={SummaryScreen} />
    </Tab.Navigator>
  );
}

// APLICAÇÃO
export default function App() {
  return (
    <ProductsProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductsProvider>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },

  header: {
    backgroundColor: GREEN,
    padding: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#E5F5EA',
    fontSize: 14,
    marginTop: 5,
  },

  totalCard: {
    backgroundColor: LIGHT_GREEN,
    margin: 18,
    padding: 20,
    borderRadius: 15,
  },

  summaryCard: {
    backgroundColor: LIGHT_GREEN,
    margin: 18,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },

  totalLabel: {
    color: '#456454',
    fontSize: 14,
  },

  totalValue: {
    color: GREEN,
    fontSize: 29,
    fontWeight: 'bold',
    marginTop: 8,
  },

  sectionHeader: {
    marginHorizontal: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#244333',
    marginBottom: 18,
  },

  smallText: {
    color: '#777777',
    fontSize: 12,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginVertical: 5,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    marginBottom: 7,
  },

  productName: {
    color: '#244333',
    fontWeight: 'bold',
    fontSize: 15,
  },

  purchasedText: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },

  actions: {
    flexDirection: 'row',
    gap: 14,
    marginLeft: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#888888',
    margin: 30,
    lineHeight: 22,
  },

  addButton: {
    backgroundColor: GREEN,
    margin: 18,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  form: {
    padding: 20,
  },

  label: {
    color: '#244333',
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E5DA',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },

  imageButton: {
    backgroundColor: LIGHT_GREEN,
    borderWidth: 1,
    borderColor: '#C5DFCE',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 3,
  },

  imageButtonText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: 'bold',
  },

  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 15,
  },

  imagePreview: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },

  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },

  removeImageText: {
    color: '#D9534F',
    fontWeight: '600',
  },

  cancelButton: {
    alignItems: 'center',
    padding: 14,
  },

  cancelText: {
    color: GREEN,
    fontWeight: 'bold',
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginVertical: 7,
    padding: 18,
    borderRadius: 13,
    alignItems: 'center',
  },

  statNumber: {
    color: GREEN,
    fontSize: 27,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#456454',
    marginTop: 5,
  },
});
