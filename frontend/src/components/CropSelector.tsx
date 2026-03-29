interface Props {
  selectedCrop: string;
  onChange: (crop: string) => void;
}

const CROPS = [
  { value: 'apple', label: 'Apples 🍎', icon: '🍎' },
  { value: 'tomato', label: 'Tomatoes 🍅', icon: '🍅' },
  { value: 'orange', label: 'Oranges 🍊', icon: '🍊' },
  { value: 'mango', label: 'Mangoes 🥭', icon: '🥭' }
];

export default function CropSelector({ selectedCrop, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-charcoal block">Select Crop Type:</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CROPS.map((crop) => (
          <button
            key={crop.value}
            onClick={() => onChange(crop.value)}
            className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
              selectedCrop === crop.value
                ? 'border-forest bg-leaf/10'
                : 'border-light-gray hover:border-soil'
            }`}
          >
            <span className="text-4xl">{crop.icon}</span>
            <span className="font-semibold text-sm">{crop.label.replace(/[^\w\s]/gi, '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

