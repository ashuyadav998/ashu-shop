import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CartProvider } from "./context/CartContext";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductDetailScreen from "./screens/ProductsDetailScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MyOrdersScreen from "./screens/MyOrdersScreen"; // ⬅️ Añade
import OrderDetailScreen from "./screens/OrderDetailScreen"; // ⬅️ Añade
import CheckoutScreen from "./screens/CheckoutScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ headerShown: true, title: "Detalle del Producto" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
         
          <Stack.Screen
            name="MyOrders"
            component={MyOrdersScreen}
            optio
            ns={{ headerShown: true, title: "Mis Pedidos" }}
          />
          <Stack.Screen 
  name="Checkout" 
  component={CheckoutScreen}
  options={{ 
    title: 'Finalizar Compra',
    headerShown: true 
  }}
/>
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ headerShown: true, title: "Detalle del Pedido" }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ headerShown: true, title: "Mi Carrito" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}