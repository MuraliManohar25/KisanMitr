const RECOMMENDATIONS = {
    apple: {
        A: {
            advice: "Excellent quality! Consider premium organic markets for max profit.",
            storage: "Store at 0-4°C with 90% humidity. Can last 3-6 months."
        },
        B: {
            advice: "Good quality. Suitable for local markets or supermarkets.",
            storage: "Store at 0-4°C. Check for bruises before storage."
        },
        C: {
            advice: "Processing grade. Best for juice, jam, or dried fruit.",
            fertilizer: "Consider increasing Potassium (K) intake next season for better fruit size."
        },
        Reject: {
            advice: "Not suitable for sale. Compost or use as animal feed if safe.",
            disease_prevention: "Remove fallen fruits immediately to prevent pest cycles."
        }
    },
    tomato: {
        A: {
            advice: "Premium grade. Ideal for export or high-end retail.",
            storage: "Store at 12-15°C. Do not refrigerate below 10°C to avoid chilling injury."
        },
        B: {
            advice: "Standard grade. Good for local veg markets.",
            storage: "Keep cool and dry. Use within 1 week."
        },
        C: {
            advice: "Sauce grade. Use for purees, ketchup, or sales to processing plants.",
            fertilizer: "Check Calcium levels to prevent Blossom End Rot."
        },
        Reject: {
            advice: "Cull immediately. Do not leave in field.",
            disease_prevention: "Rotate crops with non-solanaceous plants to reduce soil pathogens."
        }
    },
    orange: {
        A: { advice: "Export quality. High juice content expected.", storage: "4-8°C optimal." },
        B: { advice: "Market quality.", storage: "Keep in well-ventilated crates." },
        C: { advice: "Juicing grade.", fertilizer: "Zinc deficiency might cause small fruit." },
        Reject: { advice: "Discard responsibly.", disease_prevention: "Prune dead wood to reduce fungal risks." }
    },
    mango: {
        A: { advice: "Export premium. Handle with extreme care (latex burn risk).", storage: "13°C for ripe fruit." },
        B: { advice: "Domestic market standard.", storage: "Ripen at room temperature." },
        C: { advice: "Pulping grade (Aamen/Maaza).", fertilizer: "Boron spray during flowering improves retention." },
        Reject: { advice: "Destroy localized infestation (fruit fly).", disease_prevention: "Use pheromone traps for fruit flies." }
    }
};

const PESTICIDES = {
    "Spots/Fungal": {
        organic: "Neem Oil, Copper Fungicide",
        chemical: "Mancozeb, Carbendazim",
        advice: "Spray early morning. Ensure underside of leaves is covered."
    },
    "Discoloration/Nutrient": {
        organic: "Compost Tea, Seaweed Extract",
        chemical: "NPK Foliar Spray",
        advice: "Test soil pH. Discoloration often means localized nutrient lock-out."
    },
    "Pest Damage": {
        organic: "Neem Oil, Sticky Traps",
        chemical: "Imidacloprid (use sparingly)",
        advice: "Check for aphids or mites on leaf undersides."
    },
    "Rot": {
        organic: "Remove affected parts, improve airflow",
        chemical: "Copper Oxychloride",
        advice: "Reduce watering. Avoid wetting foliage."
    }
};

export default {
    getRecommendations(cropType, grade, disease = null) {
        const crop = cropType?.toLowerCase() || 'tomato';
        const gradeKey = grade || 'B';

        let result = {
            grade_advice: "Standard care recommended.",
            storage: "Keep in a cool, dry place.",
            pesticides: null,
            disease_note: null
        };

        // Grade-based advice
        if (RECOMMENDATIONS[crop]) {
            const rec = RECOMMENDATIONS[crop][gradeKey] || RECOMMENDATIONS[crop]['B'];
            result.grade_advice = rec.advice;
            if (rec.storage) result.storage = rec.storage;
            if (rec.fertilizer) result.fertilizer = rec.fertilizer;
        }

        // Disease-based advice
        if (disease && disease !== 'Healthy' && disease !== 'None') {
            const pestRec = PESTICIDES[disease] || PESTICIDES["Spots/Fungal"]; // Default to fungal for general spots
            result.pesticides = pestRec;
            result.disease_note = `Detected signs of ${disease}. Immediate action recommended.`;
        }

        return result;
    }
};
