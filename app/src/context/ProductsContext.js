import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase';

export const ProductsContext = createContext();
export const GREEN = '#238B57';

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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
            setLoading(false);
          },
          error => {
            console.error('Erro ao carregar produtos:', error);
            setLoading(false);
            Alert.alert('Erro', 'Não foi possível carregar os produtos.');
          }
        );
      } catch (error) {
        console.error('Erro na autenticação:', error);
        setLoading(false);
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

      if (product.ownerId !== auth.currentUser?.uid) {
        throw new Error('Você não tem permissão para alterar este produto.');
      }

      await updateDoc(
        doc(db, 'products', id),
        { purchased: !product.purchased }
      );
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    }
  }

  // EXCLUIR PRODUTO
  async function deleteProduct(id) {
    try {
      const product = products.find(item => item.id === id);
      if (!product || product.ownerId !== auth.currentUser?.uid) {
        throw new Error('Você não tem permissão para excluir este produto.');
      }
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
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

