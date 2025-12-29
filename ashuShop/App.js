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
import MyOrdersScreen from "./screens/MyOrdersScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ 
            headerShown: false  // ⬅️ BOOLEAN sin comillas
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}  // ⬅️ BOOLEAN
          />
          
          <Stack.Screen 
            name="Register" 
            component={SignupScreen}
            options={{ headerShown: false }}  // ⬅️ BOOLEAN
          />
          
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}  // ⬅️ BOOLEAN
          />
          
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ 
              headerShown: true,  // ⬅️ BOOLEAN
              title: "Detalle del Producto" 
            }}
          />
          
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}  // ⬅️ BOOLEAN
          />

          <Stack.Screen
            name="MyOrders"
            component={MyOrdersScreen}
            options={{ 
              headerShown: true,  // ⬅️ BOOLEAN
              title: "Mis Pedidos" 
            }}
          />
          
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{
              title: 'Finalizar Compra',
              headerShown: true  // ⬅️ BOOLEAN
            }}
          />
          
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ 
              headerShown: true,  // ⬅️ BOOLEAN
              title: "Detalle del Pedido" 
            }}
          />
          
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ 
              headerShown: true,  // ⬅️ BOOLEAN
              title: "Mi Carrito" 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}