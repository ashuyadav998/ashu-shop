import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList
} from "react-native";
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, loading } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Cargar productos relacionados al montar el componente
  useEffect(() => {
    fetchRelatedProducts();
  }, [product._id]);

  const fetchRelatedProducts = async () => {
    try {
      setLoadingRelated(true);
      const response = await fetch('http://192.168.1.148:5000/api/products');
      const data = await response.json();
      
      // Filtrar productos relacionados (misma categoría, excluyendo el actual)
      const related = data
        .filter(p => p.category === product.category && p._id !== product._id)
        .slice(0, 4); // Limitar a 4 productos
      
      setRelatedProducts(related);
    } catch (error) {
      console.error('Error al cargar productos relacionados:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product._id, 1);
    setAddingToCart(false);
    
    if (result.success) {
      Alert.alert(
        '¡Éxito!', 
        result.message,
        [
          { text: 'Seguir comprando', style: 'cancel' },
          { 
            text: 'Ver carrito', 
            onPress: () => navigation.navigate('Cart')
          }
        ]
      );
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderRelatedProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.relatedCard}
      onPress={() => navigation.push('ProductDetail', { product: item })}
    >
      <Image
        source={{ uri: `http://192.168.1.148:5000${item.image}` }}
        style={styles.relatedImage}
      />
      <Text style={styles.relatedName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.relatedPrice}>€{item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `http://192.168.1.148:5000${product.image}` }}
        style={styles.productImage}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>€{product.price.toFixed(2)}</Text>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>
          {product.description || "Este producto no tiene descripción."}
        </Text>

        <TouchableOpacity 
          style={[styles.addButton, (addingToCart || loading) && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart || loading}
        >
          {addingToCart || loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.addButtonText}>Añadir al carrito 🛒</Text>
          )}
        </TouchableOpacity>

        {/* Sección de productos relacionados */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Productos relacionados</Text>
            
            {loadingRelated ? (
              <ActivityIndicator size="large" color="#4A6CF7" style={styles.loader} />
            ) : (
              <FlatList
                data={relatedProducts}
                renderItem={renderRelatedProduct}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  productImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#ddd",
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    color: "#4A6CF7",
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 25,
  },
  addButton: {
    backgroundColor: "#4A6CF7",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#999",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Estilos para productos relacionados
  relatedSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 15,
  },
  relatedList: {
    paddingRight: 20,
  },
  relatedCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedImage: {
    width: "100%",
    height: 130,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    height: 35,
  },
  relatedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A6CF7",
  },
  loader: {
    marginVertical: 20,
  },
});