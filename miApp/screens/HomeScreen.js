import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useCart } from '../context/CartContext';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { getCartCount, loadCart } = useCart();
  
  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://ashu-shop.vercel.app/api/products");
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.log("Error parseando JSON:", text);
        Alert.alert("Error", "Respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.log("Error fetch:", error);
      Alert.alert("Error", "No se pueden cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  // Calcular productos para la página actual
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  };

  // Calcular número total de páginas
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A6CF7" />
        <Text style={{ marginTop: 10 }}>Cargando productos...</Text>
      </View>
    );
  }

  const cartCount = getCartCount();
  const currentProducts = getCurrentPageProducts();

  return (
    <View style={styles.container}>
      {/* Header con título y carrito */}
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        
        <View style={styles.headerRight}>
          {/* Botón de perfil */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>

          {/* Icono del carrito */}
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid de productos con ScrollView */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.productsGrid}>
          {currentProducts.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={() => navigation.navigate("ProductDetail", { product: item })}
            >
              <Image
                source={{ uri: `http://192.168.1.148:5000${item.image}` }}
                style={styles.image}
              />
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.price}>€{item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Información de paginación */}
        {totalPages > 1 && (
          <View style={styles.pageInfo}>
            <Text style={styles.pageInfoText}>
              Mostrando {((currentPage - 1) * PRODUCTS_PER_PAGE) + 1}-
              {Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)} de {products.length} productos
            </Text>
          </View>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            {/* Botón Anterior */}
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled
              ]}
              onPress={handlePrevPage}
              disabled={currentPage === 1}
            >
              <Text style={[
                styles.paginationButtonText,
                currentPage === 1 && styles.paginationButtonTextDisabled
              ]}>
                ← Anterior
              </Text>
            </TouchableOpacity>

            {/* Números de página */}
            <View style={styles.pageNumbers}>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                
                // Mostrar solo algunas páginas para no saturar
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <TouchableOpacity
                      key={pageNumber}
                      style={[
                        styles.pageNumberButton,
                        currentPage === pageNumber && styles.pageNumberButtonActive
                      ]}
                      onPress={() => handleGoToPage(pageNumber)}
                    >
                      <Text style={[
                        styles.pageNumberText,
                        currentPage === pageNumber && styles.pageNumberTextActive
                      ]}>
                        {pageNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <Text key={pageNumber} style={styles.ellipsis}>...</Text>;
                }
                return null;
              })}
            </View>

            {/* Botón Siguiente */}
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled
              ]}
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <Text style={[
                styles.paginationButtonText,
                currentPage === totalPages && styles.paginationButtonTextDisabled
              ]}>
                Siguiente →
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8ECF4",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: "white",
    width: "48%",
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#4A6CF7",
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 15,
    padding: 8,
  },
  profileIcon: {
    fontSize: 28,
  },
  // Estilos de paginación
  pageInfo: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  pageInfoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#4A6CF7',
  },
  paginationButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  paginationButtonTextDisabled: {
    color: '#9CA3AF',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pageNumberButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  pageNumberButtonActive: {
    backgroundColor: '#4A6CF7',
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pageNumberTextActive: {
    color: 'white',
  },
  ellipsis: {
    fontSize: 16,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
});