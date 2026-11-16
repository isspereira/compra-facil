import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProductsContext, GREEN } from '../context/ProductsContext';
import styles from '../styles';

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
      !Number.isInteger(parsedQuantity) ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      Alert.alert(
        'Atenção',
        'Informe uma quantidade inteira maior que zero e um preço válido (zero ou maior).'
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
          maxLength={60}
          returnKeyType="next"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Quantidade</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 2"
          keyboardType="number-pad"
          maxLength={5}
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Preço unitário (R$)</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 10,50"
          keyboardType="decimal-pad"
          maxLength={12}
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

export default AddProductScreen;
