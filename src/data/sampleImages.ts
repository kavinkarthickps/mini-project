export interface SampleFieldImage {
  id: string;
  name: string;
  crop: string;
  cropVariety: string;
  growthStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation / Harvest';
  description: string;
  expectedPest: string;
  symptoms: string;
  weather: string;
  url: string;
}

export const SAMPLE_FIELD_IMAGES: SampleFieldImage[] = [
  {
    id: 'sample-maize-faw',
    name: 'Maize Whorl with Ragged Chewing & Frass',
    crop: 'Maize',
    cropVariety: 'Pioneer 3396',
    growthStage: 'Vegetative',
    description: 'Central leaf funnel exhibiting severe windowing perforations and granular sawdust frass.',
    expectedPest: 'Fall Armyworm (Spodoptera frugiperda)',
    symptoms: 'Ragged hole chewing inside growing whorl, yellow-brown frass deposits, stunted whorl development.',
    weather: 'Hot and moderately humid (30°C, 72% RH), occasional showers 4 days ago.',
    url: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'sample-tomato-leafminer',
    name: 'Tomato Foliage with Translucent Blotch Mines',
    crop: 'Tomato',
    cropVariety: 'Arka Rakshak',
    growthStage: 'Flowering',
    description: 'Upper and middle tomato leaves showing silvery translucent blotch galleries with black frass grains.',
    expectedPest: 'Tomato Leafminer (Tuta absoluta)',
    symptoms: 'Mesophyll leaf blotches, blistered leaf epidermis, early necrotic browning along leaf margins.',
    weather: 'Dry and warm daytime conditions (28°C, 55% RH), cool night temperatures.',
    url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'sample-rice-bph',
    name: 'Rice Base Sheath Yellowing & Planthoppers',
    crop: 'Rice',
    cropVariety: 'Samba Mahsuri (BPT 5204)',
    growthStage: 'Vegetative',
    description: 'Base of rice stems showing brown discoloration, planthopper congregations, and bottom leaf drying.',
    expectedPest: 'Brown Planthopper (Nilaparvata lugens)',
    symptoms: 'Hopperburn patches spreading circular drying from basal waterline upwards.',
    weather: 'Continuous stagnant irrigation water, heavy relative humidity (88% RH), warm night temperatures.',
    url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'sample-cotton-pbw',
    name: 'Cotton Square with Rosetted Flower Petals',
    crop: 'Cotton',
    cropVariety: 'Bollgard II Hybrid',
    growthStage: 'Flowering',
    description: 'Twisted flower petals with pink caterpillar entry sign and internal flower ovary feeding.',
    expectedPest: 'Pink Bollworm (Pectinophora gossypiella)',
    symptoms: 'Rosetted flower petals unable to open, small pinhole bore entry in young boll.',
    weather: 'Warm seasonal weather (32°C, 60% RH), cloudy periods during peak dusk emergence.',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'sample-chilli-thrips',
    name: 'Chilli Shoot Tips with Boat-Shaped Upward Curl',
    crop: 'Chilli',
    cropVariety: 'Guntur Sannam (S4)',
    growthStage: 'Vegetative',
    description: 'Severe upward cupping of tender terminal leaves with silvery-bronze underside streaking.',
    expectedPest: 'Chilli Thrips (Scirtothrips dorsalis)',
    symptoms: 'Upward curled leaves resembling canoes, crinkled margins, stunted branch elongation.',
    weather: 'Extended dry spell without rain for 14 days, daytime temperature 34°C, dry wind.',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'sample-healthy-crop',
    name: 'Healthy Crop Foliage (Negative Control)',
    crop: 'Tomato',
    cropVariety: 'Roma VF',
    growthStage: 'Vegetative',
    description: 'Vibrant green intact foliage with zero visible insect feeding, no blotch mines, and clear leaf margins.',
    expectedPest: 'No Pest Detected (Healthy Plant Foliage)',
    symptoms: 'None observed. Vigorous photosynthetic leaf area and clean stems.',
    weather: 'Mild temperate sunshine (24°C, 60% RH), optimal drip irrigation.',
    url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80'
  }
];
