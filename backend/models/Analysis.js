import supabase from '../config/supabase.js';

export default {
  async create(analysisData) {
    let data;

    // Try inserting with new fields (recommendations, disease_detected)
    try {
      const { data: result, error } = await supabase
        .from('analyses')
        .insert({
          analysis_id: analysisData.analysisId,
          user_id: analysisData.userId || null,
          crop_type: analysisData.cropType,
          farmer_name: analysisData.farmerInfo?.name || '',
          farmer_location: analysisData.farmerInfo?.location || '',
          farmer_phone: analysisData.farmerInfo?.phone || '',
          image_url: analysisData.imageUrl,
          total_count: analysisData.detectionResults?.totalCount || 0,
          overall_grade: analysisData.overallGrade,
          grade_a_count: analysisData.gradeDistribution?.A || 0,
          grade_b_count: analysisData.gradeDistribution?.B || 0,
          grade_c_count: analysisData.gradeDistribution?.C || 0,
          reject_count: analysisData.gradeDistribution?.Reject || 0,
          certificate_hash: analysisData.certificateHash,
          verified: analysisData.verified || false,
          disease_detected: analysisData.diseaseDetected,
          recommendations: analysisData.recommendations
        })
        .select()
        .single();

      if (error) throw error;
      data = result;

    } catch (error) {
      // Fallback: If column missing error, try without new fields
      if (error.message && (error.message.includes("column") || error.message.includes("schema") || error.code === "42703")) {
        console.warn("⚠️ Database schema mismatch. Retrying without new fields (disease_detected, recommendations)...");
        const { data: retryResult, error: retryError } = await supabase
          .from('analyses')
          .insert({
            analysis_id: analysisData.analysisId,
            user_id: analysisData.userId || null,
            crop_type: analysisData.cropType,
            farmer_name: analysisData.farmerInfo?.name || '',
            farmer_location: analysisData.farmerInfo?.location || '',
            farmer_phone: analysisData.farmerInfo?.phone || '',
            image_url: analysisData.imageUrl,
            total_count: analysisData.detectionResults?.totalCount || 0,
            overall_grade: analysisData.overallGrade,
            grade_a_count: analysisData.gradeDistribution?.A || 0,
            grade_b_count: analysisData.gradeDistribution?.B || 0,
            grade_c_count: analysisData.gradeDistribution?.C || 0,
            reject_count: analysisData.gradeDistribution?.Reject || 0,
            certificate_hash: analysisData.certificateHash,
            verified: analysisData.verified || false
          })
          .select()
          .single();

        if (retryError) throw retryError;
        data = retryResult;
      } else {
        throw error;
      }
    }

    const analysisId = data.id;
    let items = [];

    // Insert analysis items if provided
    if (analysisData.detectionResults?.items && analysisData.detectionResults.items.length > 0) {
      items = analysisData.detectionResults.items.map(item => ({
        analysis_id: analysisId,
        item_id: item.id,
        bbox_x: item.bbox?.[0] || null,
        bbox_y: item.bbox?.[1] || null,
        bbox_width: item.bbox?.[2] || null,
        bbox_height: item.bbox?.[3] || null,
        diameter: item.diameter || null,
        avg_r: item.colorProfile?.avgRGB?.[0] || null,
        avg_g: item.colorProfile?.avgRGB?.[1] || null,
        avg_b: item.colorProfile?.avgRGB?.[2] || null,
        dominant_hue: item.colorProfile?.dominantHue || null,
        grade: item.grade || null
      }));

      const { error: itemsError } = await supabase
        .from('analysis_items')
        .insert(items);

      if (itemsError) console.error('Error inserting items:', itemsError);
    }

    // Reconstruct items structure for formatAnalysis if needed
    // But formatAnalysis takes the raw DB items (with snake_case keys)
    // Wait, the items array above uses snake_case for insert.
    // The formatAnalysis expects DB format (snake_case).
    // So 'items' here are already snake_case.
    return this.formatAnalysis(data, items);
  },

  async findByAnalysisId(analysisId) {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    // Get analysis items
    const { data: items, error: itemsError } = await supabase
      .from('analysis_items')
      .select('*')
      .eq('analysis_id', data.id)
      .order('item_id');

    if (itemsError) console.error('Error fetching items:', itemsError);

    return this.formatAnalysis(data, items || []);
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(a => this.formatAnalysis(a));
  },

  formatAnalysis(analysis, items = []) {
    if (!analysis) return null;

    return {
      _id: analysis.id,
      id: analysis.id,
      analysisId: analysis.analysis_id,
      userId: analysis.user_id,
      cropType: analysis.crop_type,
      farmerInfo: {
        name: analysis.farmer_name,
        location: analysis.farmer_location,
        phone: analysis.farmer_phone
      },
      imageUrl: analysis.image_url,
      detectionResults: {
        totalCount: analysis.total_count,
        items: items.map(item => ({
          id: item.item_id,
          bbox: [item.bbox_x, item.bbox_y, item.bbox_width, item.bbox_height].filter(v => v !== null),
          diameter: item.diameter,
          colorProfile: {
            avgRGB: [item.avg_r, item.avg_g, item.avg_b].filter(v => v !== null),
            dominantHue: item.dominant_hue
          },
          grade: item.grade
        }))
      },
      overallGrade: analysis.overall_grade,
      gradeDistribution: {
        A: analysis.grade_a_count,
        B: analysis.grade_b_count,
        C: analysis.grade_c_count,
        Reject: analysis.reject_count
      },
      certificateHash: analysis.certificate_hash,
      verified: analysis.verified,
      createdAt: analysis.created_at,
      updatedAt: analysis.updated_at,
      diseaseDetected: analysis.disease_detected,
      recommendations: analysis.recommendations
    };
  }
};
