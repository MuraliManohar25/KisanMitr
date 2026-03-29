import supabase from '../config/supabase.js';

export default {
  async create(imageData) {
    const { data, error } = await supabase
      .from('training_images')
      .insert({
        crop_type: imageData.cropType,
        image_url: imageData.imageUrl,
        image_path: imageData.imagePath,
        filename: imageData.filename,
        uploaded_by: imageData.uploadedBy || 'system',
        image_size: imageData.metadata?.size || null,
        image_width: imageData.metadata?.width || null,
        image_height: imageData.metadata?.height || null
      })
      .select()
      .single();
    
    if (error) throw error;
    return this.formatImage(data);
  },

  async findByCropType(cropType, limit = 100) {
    const { data, error } = await supabase
      .from('training_images')
      .select('*')
      .eq('crop_type', cropType)
      .limit(limit);
    
    if (error) throw error;
    return (data || []).map(img => this.formatImage(img));
  },

  async countByCropType() {
    const { data, error } = await supabase
      .from('training_images')
      .select('crop_type')
      .select('id', { count: 'exact' });
    
    if (error) throw error;
    
    // Group by crop type
    const counts = {};
    (data || []).forEach(item => {
      counts[item.crop_type] = (counts[item.crop_type] || 0) + 1;
    });
    
    return counts;
  },

  formatImage(image) {
    if (!image) return null;
    return {
      _id: image.id,
      id: image.id,
      cropType: image.crop_type,
      imageUrl: image.image_url,
      imagePath: image.image_path,
      filename: image.filename,
      uploadedBy: image.uploaded_by,
      labels: [], // Can be fetched separately if needed
      metadata: {
        size: image.image_size,
        width: image.image_width,
        height: image.image_height,
        importedAt: image.created_at
      },
      createdAt: image.created_at,
      updatedAt: image.updated_at
    };
  }
};
