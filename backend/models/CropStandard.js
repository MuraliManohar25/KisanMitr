import supabase from '../config/supabase.js';

export default {
  async create(standardData) {
    const { data, error } = await supabase
      .from('crop_standards')
      .insert({
        crop_type: standardData.cropType,
        display_name: standardData.displayName || '',
        icon: standardData.icon || '',
        grade_a_min_diameter: standardData.gradeThresholds?.gradeA?.minDiameter || null,
        grade_a_max_diameter: standardData.gradeThresholds?.gradeA?.maxDiameter || null,
        grade_a_min_hue: standardData.gradeThresholds?.gradeA?.colorRange?.minHue || null,
        grade_a_max_hue: standardData.gradeThresholds?.gradeA?.colorRange?.maxHue || null,
        grade_b_min_diameter: standardData.gradeThresholds?.gradeB?.minDiameter || null,
        grade_b_max_diameter: standardData.gradeThresholds?.gradeB?.maxDiameter || null,
        grade_b_min_hue: standardData.gradeThresholds?.gradeB?.colorRange?.minHue || null,
        grade_b_max_hue: standardData.gradeThresholds?.gradeB?.colorRange?.maxHue || null,
        grade_c_min_diameter: standardData.gradeThresholds?.gradeC?.minDiameter || null,
        grade_c_max_diameter: standardData.gradeThresholds?.gradeC?.maxDiameter || null,
        grade_c_min_hue: standardData.gradeThresholds?.gradeC?.colorRange?.minHue || null,
        grade_c_max_hue: standardData.gradeThresholds?.gradeC?.colorRange?.maxHue || null
      })
      .select()
      .single();

    if (error) throw error;
    return this.formatStandard(data);
  },

  async findByCropType(cropType) {
    const { data, error } = await supabase
      .from('crop_standards')
      .select('*')
      .eq('crop_type', cropType)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatStandard(data) : null;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('crop_standards')
      .select('*')
      .order('crop_type');

    if (error) throw error;
    return (data || []).map(s => this.formatStandard(s));
  },

  async upsert(standardData) {
    const { data, error } = await supabase
      .from('crop_standards')
      .upsert({
        crop_type: standardData.cropType,
        display_name: standardData.displayName || '',
        icon: standardData.icon || '',
        grade_a_min_diameter: standardData.gradeThresholds?.gradeA?.minDiameter || null,
        grade_a_max_diameter: standardData.gradeThresholds?.gradeA?.maxDiameter || null,
        grade_a_min_hue: standardData.gradeThresholds?.gradeA?.colorRange?.minHue || null,
        grade_a_max_hue: standardData.gradeThresholds?.gradeA?.colorRange?.maxHue || null,
        grade_b_min_diameter: standardData.gradeThresholds?.gradeB?.minDiameter || null,
        grade_b_max_diameter: standardData.gradeThresholds?.gradeB?.maxDiameter || null,
        grade_b_min_hue: standardData.gradeThresholds?.gradeB?.colorRange?.minHue || null,
        grade_b_max_hue: standardData.gradeThresholds?.gradeB?.colorRange?.maxHue || null,
        grade_c_min_diameter: standardData.gradeThresholds?.gradeC?.minDiameter || null,
        grade_c_max_diameter: standardData.gradeThresholds?.gradeC?.maxDiameter || null,
        grade_c_min_hue: standardData.gradeThresholds?.gradeC?.colorRange?.minHue || null,
        grade_c_max_hue: standardData.gradeThresholds?.gradeC?.colorRange?.maxHue || null
      }, { onConflict: 'crop_type' })
      .select()
      .single();

    if (error) throw error;
    return this.formatStandard(data);
  },

  formatStandard(standard) {
    if (!standard) return null;
    return {
      _id: standard.id,
      id: standard.id,
      cropType: standard.crop_type,
      displayName: standard.display_name,
      icon: standard.icon,
      gradeThresholds: {
        gradeA: {
          minDiameter: standard.grade_a_min_diameter,
          maxDiameter: standard.grade_a_max_diameter,
          colorRange: {
            minHue: standard.grade_a_min_hue,
            maxHue: standard.grade_a_max_hue
          }
        },
        gradeB: {
          minDiameter: standard.grade_b_min_diameter,
          maxDiameter: standard.grade_b_max_diameter,
          colorRange: {
            minHue: standard.grade_b_min_hue,
            maxHue: standard.grade_b_max_hue
          }
        },
        gradeC: {
          minDiameter: standard.grade_c_min_diameter,
          maxDiameter: standard.grade_c_max_diameter,
          colorRange: {
            minHue: standard.grade_c_min_hue,
            maxHue: standard.grade_c_max_hue
          }
        }
      },
      createdAt: standard.created_at,
      updatedAt: standard.updated_at
    };
  }
};
