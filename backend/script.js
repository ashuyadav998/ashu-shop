import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    mongoose.connect('mongodb+srv://ttechashu:ashuzoya@ashu-shop.i4y6qdx.mongodb.net/');
    console.log('✅ Conectado a MongoDB');

    const email = 'admin@admin.com';
    
    // Buscar usuario existente
    let admin = await User.findOne({ email });
    
    if (admin) {
      console.log('👤 Usuario encontrado, actualizando a admin...');
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Usuario actualizado a admin');
    } else {
      // Crear nuevo admin
      console.log('👤 Creando nuevo admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Admin',
        email: email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin creado exitosamente');
    }

    console.log('\n📋 Credenciales:');
    console.log('   Email:', email);
    console.log('   Password: admin123');
    console.log('   Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();