import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCart } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';

export default function CheckoutScreen({ navigation }) {
  const { cart, getCartCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const cartItems = cart?.items || [];
  const cartItemsCount = cartItems.length;

  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: 'España'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('userData');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserData(user);
        setShippingData({
          fullName: user.name || '',
          address: '',
          city: '',
          postalCode: '',
          phone: '',
          country: 'España'
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  const validateShipping = () => {
    if (!shippingData.fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return false;
    }
    if (!shippingData.address.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu dirección');
      return false;
    }
    if (!shippingData.city.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu ciudad');
      return false;
    }
    if (!shippingData.postalCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu código postal');
      return false;
    }
    if (!shippingData.phone.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu teléfono');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    const cardNum = paymentData.cardNumber.replace(/\s/g, '');
    if (cardNum.length !== 16 || !/^\d+$/.test(cardNum)) {
      Alert.alert('Error', 'Número de tarjeta inválido (debe tener 16 dígitos)');
      return false;
    }

    if (!paymentData.cardName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre en la tarjeta');
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      Alert.alert('Error', 'Fecha de expiración inválida (formato: MM/YY)');
      return false;
    }

    if (paymentData.cvv.length !== 3 || !/^\d+$/.test(paymentData.cvv)) {
      Alert.alert('Error', 'CVV inválido (debe tener 3 dígitos)');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping() || !validatePayment()) {
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const orderData = {
        orderItems: cart.items.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          product: item.product._id || item.product
        })),
        shippingAddress: {
          address: shippingData.address,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country
        },
        paymentMethod: 'Tarjeta de crédito',
        totalPrice: finalTotal
      };

      console.log('📤 ORDER DATA:', JSON.stringify(orderData, null, 2));

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('📥 RESPUESTA:', JSON.stringify(data, null, 2));

      if (response.ok) {
        await clearCart();

        Alert.alert(
          '¡Pedido realizado!',
          `Tu pedido ha sido procesado exitosamente.`,
          [
            {
              text: 'Volver al inicio',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'No se pudo procesar el pedido');
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const total = cart.totalPrice || 0;
  const shipping = 5.00;
  const finalTotal = total + shipping;

  if (!cart || cartItemsCount === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>🛒</Text>
        <Text style={{ fontSize: 18, color: '#666', marginBottom: 20 }}>Tu carrito está vacío</Text>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.placeOrderButtonText}>Ir a comprar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Finalizar Compra</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Resumen del pedido</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({cartItemsCount} productos, {getCartCount()} unidades)
            </Text>
            <Text style={styles.summaryValue}>€{total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>€{shipping.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>€{finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚚 Dirección de envío</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={shippingData.fullName}
          onChangeText={(text) => setShippingData({ ...shippingData, fullName: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Dirección completa"
          value={shippingData.address}
          onChangeText={(text) => setShippingData({ ...shippingData, address: text })}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Ciudad"
            value={shippingData.city}
            onChangeText={(text) => setShippingData({ ...shippingData, city: text })}
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Código postal"
            value={shippingData.postalCode}
            onChangeText={(text) => setShippingData({ ...shippingData, postalCode: text })}
            keyboardType="numeric"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="País"
          value={shippingData.country}
          onChangeText={(text) => setShippingData({ ...shippingData, country: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={shippingData.phone}
          onChangeText={(text) => setShippingData({ ...shippingData, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💳 Información de pago</Text>

        <TextInput
          style={styles.input}
          placeholder="Número de tarjeta"
          value={paymentData.cardNumber}
          onChangeText={(text) => setPaymentData({
            ...paymentData,
            cardNumber: formatCardNumber(text)
          })}
          keyboardType="numeric"
          maxLength={19}
        />

        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          value={paymentData.cardName}
          onChangeText={(text) => setPaymentData({ ...paymentData, cardName: text })}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="MM/YY"
            value={paymentData.expiryDate}
            onChangeText={(text) => setPaymentData({
              ...paymentData,
              expiryDate: formatExpiryDate(text)
            })}
            keyboardType="numeric"
            maxLength={5}
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="CVV"
            value={paymentData.cvv}
            onChangeText={(text) => setPaymentData({
              ...paymentData,
              cvv: text.replace(/\D/g, '')
            })}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry={true}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.placeOrderButtonText}>
            Realizar pedido - €{finalTotal.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.securityNote}>
        <Text style={styles.securityText}>🔒 Pago seguro y encriptado</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  summaryBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A6CF7",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  placeOrderButton: {
    backgroundColor: "#4A6CF7",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  placeOrderButtonDisabled: {
    backgroundColor: "#999",
  },
  placeOrderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  securityNote: {
    alignItems: "center",
    marginBottom: 30,
  },
  securityText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "500",
  },
});