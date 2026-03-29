import supabase from '../config/supabase.js';
import bcrypt from 'bcrypt';

export default {
  async create(userData) {
    const { username, email, password, farmerName, location, phone } = userData;
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        farmer_name: farmerName || '',
        location: location || '',
        phone: phone || ''
      })
      .select()
      .single();
    
    if (error) throw error;
    return this.formatUser(data);
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data ? this.formatUser(data) : null;
  },

  async findByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatUser(data) : null;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatUser(data) : null;
  },

  async comparePassword(user, candidatePassword) {
    return bcrypt.compare(candidatePassword, user.password_hash);
  },

  formatUser(user) {
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      username: user.username,
      email: user.email,
      farmerName: user.farmer_name,
      location: user.location,
      phone: user.phone,
      password_hash: user.password_hash, // Keep for password comparison
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
};
