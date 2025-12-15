import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params;

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA726',
      processing: '#42A5F5',
      shipped: '#AB47BC',
      delivered: '#66BB6A',
      cancelled: '#EF5350'
    };
    return colors[status] || '#999';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Pedido #{order._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado del Pedido</Text>
        <View style={styles.trackingContainer}>
          <View style={styles.trackingStep}>
            <View style={[styles.trackingDot, styles.trackingDotActive]} />
            <Text style={styles.trackingText}>Pedido realizado</Text>
          </View>
          <View style={styles.trackingLine} />
          <View style={styles.trackingStep}>
            <View style={[styles.trackingDot, order.status !== 'pending' && styles.trackingDotActive]} />
            <Text style={styles.trackingText}>Procesando</Text>
          </View>
          <View style={styles.trackingLine} />
          <View style={styles.trackingStep}>
            <View style={[styles.trackingDot, order.status === 'shipped' || order.status === 'delivered' ? styles.trackingDotActive : null]} />
            <Text style={styles.trackingText}>Enviado</Text>
          </View>
          <View style={styles.trackingLine} />
          <View style={styles.trackingStep}>
            <View style={[styles.trackingDot, order.status === 'delivered' && styles.trackingDotActive]} />
            <Text style={styles.trackingText}>Entregado</Text>
          </View>
        </View>
      </View>

      {/* Productos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productos ({order.orderItems.length})</Text>
        {order.orderItems.map((item, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.productPlaceholder}>
              <Text style={styles.productPlaceholderText}>📦</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productQuantity}>Cantidad: {item.qty}</Text>
              <Text style={styles.productPrice}>€{item.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.productTotal}>€{(item.price * item.qty).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Dirección de envío */}
      {order.shippingAddress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección de Envío</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressText}>{order.shippingAddress.address}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Text>
            <Text style={styles.addressText}>{order.shippingAddress.country}</Text>
          </View>
        </View>
      )}

      {/* Método de pago */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Pago</Text>
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>{order.paymentMethod || 'Tarjeta de crédito'}</Text>
        </View>
      </View>

      {/* Resumen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>€{order.totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío:</Text>
            <Text style={styles.summaryValue}>Gratis</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>€{order.totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Seguir comprando</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackingStep: {
    alignItems: 'center',
  },
  trackingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
  },
  trackingDotActive: {
    backgroundColor: '#4A6CF7',
  },
  trackingLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  trackingText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    maxWidth: 60,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productPlaceholderText: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A6CF7',
  },
  addressBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  summaryBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6CF7',
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#4A6CF7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});