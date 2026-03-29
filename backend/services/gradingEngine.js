const GRADE_THRESHOLDS = {
  apple: {
    A: { minDiameter: 70, maxDiameter: 100, minHue: 0, maxHue: 30 },
    B: { minDiameter: 60, maxDiameter: 70, minHue: 0, maxHue: 40 },
    C: { minDiameter: 50, maxDiameter: 60, minHue: 0, maxHue: 50 }
  },
  tomato: {
    A: { minDiameter: 60, maxDiameter: 90, minHue: 340, maxHue: 20 },
    B: { minDiameter: 50, maxDiameter: 60, minHue: 330, maxHue: 30 },
    C: { minDiameter: 40, maxDiameter: 50, minHue: 320, maxHue: 40 }
  },
  orange: {
    A: { minDiameter: 70, maxDiameter: 90, minHue: 10, maxHue: 30 },
    B: { minDiameter: 60, maxDiameter: 70, minHue: 5, maxHue: 35 },
    C: { minDiameter: 50, maxDiameter: 60, minHue: 0, maxHue: 40 }
  },
  mango: {
    A: { minDiameter: 80, maxDiameter: 120, minHue: 30, maxHue: 60 },
    B: { minDiameter: 70, maxDiameter: 80, minHue: 25, maxHue: 65 },
    C: { minDiameter: 60, maxDiameter: 70, minHue: 20, maxHue: 70 }
  }
};

export default {
  async grade(detections, cropType) {
    const thresholds = GRADE_THRESHOLDS[cropType] || GRADE_THRESHOLDS.apple;
    const gradeDistribution = { A: 0, B: 0, C: 0, Reject: 0 };

    const gradedItems = detections.items.map((item) => {
      let grade = 'Reject';
      const { diameter, colorProfile } = item;
      const healthStatus = item.healthStatus || 'Healthy';

      // 1. Health Check (Crucial override)
      if (healthStatus && healthStatus !== 'Healthy' && healthStatus !== 'None') {
        // If it has Rot or Spots, it's Reject
        grade = 'Reject';
        gradeDistribution[grade]++;
        return { ...item, healthStatus, grade };
      }

      // 2. Lenient Size & Color Grading
      // If it's healthy, we try to give it a good grade

      const isColorGood = this.checkHueRange(colorProfile.dominantHue, thresholds.C.minHue - 15, thresholds.C.maxHue + 15);
      const isSizeGood = diameter >= thresholds.C.minDiameter;

      if (!isColorGood || !isSizeGood) {
        // Fail check
        grade = diameter >= thresholds.C.minDiameter ? 'C' : 'Reject';
      } else {
        // Pass check - Check A or B
        if (
          diameter >= thresholds.A.minDiameter ||
          (diameter >= thresholds.B.minDiameter && this.checkHueRange(colorProfile.dominantHue, thresholds.A.minHue, thresholds.A.maxHue))
        ) {
          grade = 'A'; // Make A easier to get
        } else if (
          diameter >= thresholds.B.minDiameter ||
          this.checkHueRange(colorProfile.dominantHue, thresholds.B.minHue, thresholds.B.maxHue)
        ) {
          grade = 'B';
        } else {
          grade = 'C';
        }
      }

      gradeDistribution[grade]++;
      return { ...item, grade };
    });

    // Calculate Overall Grade based on majority
    // Lenient: If >60% are B or A, then B.
    const total = detections.totalCount;
    let overallGrade = 'C';

    if (gradeDistribution.A >= total * 0.4) {
      overallGrade = 'A';
    } else if ((gradeDistribution.A + gradeDistribution.B) >= total * 0.5) {
      overallGrade = 'B';
    } else if (gradeDistribution.Reject > total * 0.4) {
      overallGrade = 'Reject';
    } else {
      overallGrade = 'C';
    }

    return {
      detectionResults: {
        totalCount: detections.totalCount,
        items: gradedItems
      },
      overallGrade,
      gradeDistribution
    };
  },

  checkHueRange(hue, min, max) {
    if (min > max) return hue >= min || hue <= max; // Wraps around 360
    return hue >= min && hue <= max;
  }
};
