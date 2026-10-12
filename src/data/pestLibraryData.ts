import { PestLibraryItem } from '../types';

export const PEST_LIBRARY_DATA: PestLibraryItem[] = [
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    category: 'Caterpillar / Borer',
    affectedCrops: ['Maize', 'Sorghum', 'Rice', 'Sugarcane', 'Cotton'],
    damageType: 'Foliar Defoliation & Whorl Destruction',
    keyIdentificationFeatures: [
      'Larva has an inverted white "Y" suture on its dark head capsule',
      'Four elevated dark pinacula arranged in a square on the 8th abdominal segment',
      'Dark green to brownish body with three thin yellowish dorsal stripes',
      'Extensive yellowish-brown frass accumulating in central whorl'
    ],
    typicalDamageSymptoms: [
      'Window-pane transparent patches on young whorl leaves',
      'Ragged shot-holes resembling hail damage as leaves unfold',
      'Complete defoliation and severed tassel growing points in heavy infestations'
    ],
    lifeCycleSummary: 'Moths lay 100-200 eggs in dome-shaped clusters covered with gray-brown scales. Larval stage lasts 14-22 days across 6 instars before pupating in topsoil for 7-10 days.',
    favorableConditions: 'Warm temperatures (25-30°C), moderate relative humidity, late or asynchronous planting.',
    preventionStrategies: [
      'Early synchronous planting with local rain onset',
      'Deep summer plowing to expose pupae to avian predation',
      'Intercropping with desmodium or cowpea (push-pull strategy)'
    ],
    ipmOptions: {
      cultural: ['Balanced N-P-K fertilization (avoid excessive nitrogen)', 'Field sanitation and removal of wild grass hosts'],
      mechanical: ['Hand-picking of egg masses and early instars', 'Application of fine sand mixed with wood ash (1:1) in whorls'],
      biological: ['Release Trichogramma chilonis egg parasitoids (50,000/acre)', 'Spray Bacillus thuringiensis (Bt) or Metarhizium anisopliae'],
      chemical: ['If whorl damage exceeds 20% in V4-V8 stage: Apply Chlorantraniliprole 18.5% SC or Emamectin benzoate 5% SG adhering strictly to safety labels and PPE.']
    },
    imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'brown-planthopper',
    name: 'Brown Planthopper (BPH)',
    scientificName: 'Nilaparvata lugens',
    category: 'Piercing-Sucking',
    affectedCrops: ['Rice'],
    damageType: 'Sap Depletion & Hopperburn',
    keyIdentificationFeatures: [
      'Small, brownish fulgoroid insects (2.5-4 mm long) congregating at the basal stem',
      'Both macropterous (long-winged) and brachypterous (short-winged) forms occur',
      'Presence of brown feeding punctures and honeydew secretions along leaf sheaths'
    ],
    typicalDamageSymptoms: [
      'Initial yellowing of lower leaf blades extending upwards',
      'Characteristic circular patches of dry, brown, lodging plants known as "hopperburn"',
      'Sooty mold fungus growth on sticky honeydew deposits at the plant base'
    ],
    lifeCycleSummary: 'Females insert banana-shaped egg masses into leaf sheaths. Nymphs pass through 5 instars over 12-15 days. Adult longevity is 10-25 days.',
    favorableConditions: 'Continuous standing water, high humidity (>85%), dense plant canopy, excessive nitrogen fertilizer.',
    preventionStrategies: [
      'Adopt Alternate Wetting and Drying (AWD) water management',
      'Maintain 20cm alleyways every 2-3 meters for aeration and solar penetration ("skip-row" method)',
      'Cultivate BPH-resistant rice varieties (e.g., MTU 1010, IR64 derivatives)'
    ],
    ipmOptions: {
      cultural: ['Drain standing water for 3-5 days when population builds', 'Avoid prophylactic synthetic pyrethroid sprays'],
      mechanical: ['Install yellow sticky traps and light traps (1 per acre) to gauge flight activity'],
      biological: ['Conserve natural predators: mirid bugs (Cyrtorhinus lividipennis) and wolf spiders (Lycosa pseudoannulata)', 'Apply Beauveria bassiana'],
      chemical: ['When count exceeds economic threshold (10-15 hoppers/hill): Apply Pymetrozine 50% WG or Triflumezopyrim 10% SC targeting plant base.']
    },
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tomato-leafminer',
    name: 'Tomato Leafminer',
    scientificName: 'Tuta absoluta',
    category: 'Fly / Miner',
    affectedCrops: ['Tomato', 'Potato', 'Brinjal', 'Capsicum'],
    damageType: 'Mesophyll Blotch Mining',
    keyIdentificationFeatures: [
      'Larva is creamy-white to light green with a dark brown prothoracic shield',
      'Creates wide, transparent blotch-shaped mines between upper and lower epidermal layers',
      'Black granular frass granules clearly visible inside feeding galleries'
    ],
    typicalDamageSymptoms: [
      'Irregular transparent patches (mines) turning necrotic and brown over time',
      'Larval bore holes in apical buds, stems, and under the fruit calyx',
      'Distorted fruit growth and secondary fungal rot entrance'
    ],
    lifeCycleSummary: 'Small silvery-gray moth active at dusk. Eggs hatch in 4-6 days; larvae mine leaves for 10-15 days before pupating in soil or dried leaves.',
    favorableConditions: 'Warm dry conditions (25-30°C), protected greenhouse environments, continuous solanaceous cultivation.',
    preventionStrategies: [
      'Install 40-mesh insect netting in nurseries and protected structures',
      'Rotate with non-solanaceous crops (maize, pulses, brassicas)',
      'Prompt destruction of infested crop residues in sealed plastic bags'
    ],
    ipmOptions: {
      cultural: ['Prune and burn lower infested leaves before pupation occurs', 'Eliminate wild solanaceous weeds (Solanum nigrum)'],
      mechanical: ['Install delta pheromone water traps (4-6 traps/acre) baited with Qlure for mass trapping'],
      biological: ['Release Trichogramma achaeae parasitoids or Nesidiocoris tenuis predatory mirids', 'Apply spinosad or Bacillus thuringiensis'],
      chemical: ['When >5% leaves show active mines: Apply Chlorantraniliprole or Cyantraniliprole rotating with bio-rational products.']
    },
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pink-bollworm',
    name: 'Pink Bollworm',
    scientificName: 'Pectinophora gossypiella',
    category: 'Caterpillar / Borer',
    affectedCrops: ['Cotton'],
    damageType: 'Boll Boring & Lint Staining',
    keyIdentificationFeatures: [
      'Mature larva (12-15 mm) features distinctive alternating dark pink and pale bands across its back',
      'Causes terminal petals to twist into characteristic "rosetted flowers"',
      'Bore holes into mid-sized green bolls often sealed with frass plugs'
    ],
    typicalDamageSymptoms: [
      'Premature dropping of floral squares and young bolls',
      'Internal feeding on developing seeds and locule fibers resulting in discolored, stained lint',
      'Premature or improper opening of green bolls'
    ],
    lifeCycleSummary: 'Moths lay eggs on bolls and involucres. Newly hatched larvae enter bolls within 30-60 minutes, feeding internally for 20-30 days before pupation.',
    favorableConditions: 'Extended cotton growing seasons, stacked un-ginning cotton stalks, monoculture.',
    preventionStrategies: [
      'Grow early-maturing hybrid varieties to avoid late-season population peaks',
      'Strict adherence to regional cotton closed seasons',
      'Deep post-harvest plowing and destruction of cotton stubble'
    ],
    ipmOptions: {
      cultural: ['Avoid ratooning cotton which allows diapausing larvae to survive across seasons', 'Terminate irrigation early to accelerate maturity'],
      mechanical: ['Deploy Gossyplure pheromone traps (8 traps/acre) for monitoring and mating disruption'],
      biological: ['Release Trichogramma bactrae egg parasitoids weekly at 50,000/acre', 'Conserve green lacewings (Chrysoperla carnea)'],
      chemical: ['At ETL (8 moths/trap/day for 3 days or 10% green boll infestation): Spray Azadirachtin 1% or approved selective ovicides with protective gear.']
    },
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'whitefly',
    name: 'Silverleaf Whitefly',
    scientificName: 'Bemisia tabaci',
    category: 'Piercing-Sucking',
    affectedCrops: ['Tomato', 'Cotton', 'Chilli', 'Brinjal', 'Soybean', 'Okra'],
    damageType: 'Sap Depletion & Viral Transmission',
    keyIdentificationFeatures: [
      'Tiny moth-like insects (1 mm) with powdery white wings held roof-like over yellowish bodies',
      'Clusters of scale-like nymphs adhering to underside of leaves',
      'Flutters in cloud-like swarms when infested plants are disturbed'
    ],
    typicalDamageSymptoms: [
      'Leaf chlorosis, silvering of upper leaf surfaces, and stunted plant vigor',
      'Extensive sooty mold growth coating leaves in black powdery fungal layer',
      'Vector for devastating Gemini viruses such as Tomato Yellow Leaf Curl Virus (TYLCV) and Cotton Leaf Curl Virus (CLCuV)'
    ],
    lifeCycleSummary: 'Females lay 100-300 eggs anchored on leaf undersides. Nymphs pass through 4 instars in 15-20 days. Multiple overlapping generations per year.',
    favorableConditions: 'Hot and dry weather (28-35°C), low rainfall, sheltered environments.',
    preventionStrategies: [
      'Install yellow sticky traps early (15-20 per acre) across the field boundary',
      'Plant barrier crops like maize, pearl millet, or sorghum around sensitive solanaceous plots',
      'Use reflective silver plastic mulches in tomato beds to repel flying adults'
    ],
    ipmOptions: {
      cultural: ['Avoid excessive synthetic nitrogen applications', 'Maintain clean borders free of malvaceous weeds (Abutilon indicum)'],
      mechanical: ['Yellow sticky sheets placed at canopy height to capture migrating adults'],
      biological: ['Conserve predatory ladybird beetles (Coccinella septempunctata) and pirate bugs (Orius spp.)', 'Spray Verticillium lecanii or Beauveria bassiana'],
      chemical: ['Apply botanical Neem oil (Azadirachtin 0.03%) at early nymph stage. For heavy ETL, apply Pyriproxyfen or Spiromesifen rotating modes of action.']
    },
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'chilli-thrips',
    name: 'Chilli Thrips',
    scientificName: 'Scirtothrips dorsalis',
    category: 'Piercing-Sucking',
    affectedCrops: ['Chilli', 'Capsicum', 'Groundnut', 'Strawberry', 'Cotton'],
    damageType: 'Upward Leaf Curling & Silvery Streaking',
    keyIdentificationFeatures: [
      'Extremely minute (less than 1.2 mm), pale yellow to translucent slender insects with fringed wings',
      'Congregates on tender shoot tips, leaf veins, and flower petals',
      'Causes leaves to curl characteristically upward into a "boat" shape'
    ],
    typicalDamageSymptoms: [
      'Upward cupping and curling of tender leaves with crinkled leaf margins',
      'Silvery, bronze, or brownish corky scarring on leaf undersides and fruit stalks',
      'Severe flower drop and deformed pod maturation'
    ],
    lifeCycleSummary: 'Under warm conditions life cycle completes in 12-16 days. Eggs inserted into leaf tissue; prepupae and pupae drop to ground litter.',
    favorableConditions: 'Prolonged dry spells with mild temperatures (25-32°C). Heavy rain drastically washes nymphs off leaves.',
    preventionStrategies: [
      'Use overhead sprinkler irrigation during early vegetative phases to dislodge thrips',
      'Install blue sticky traps which are specifically attractive to thrips species',
      'Avoid continuous sole cropping with susceptible chilli varieties'
    ],
    ipmOptions: {
      cultural: ['Intercrop chilli with coriander or marigold to stimulate beneficial predator populations', 'Mulch soil with organic straw to impede pupation in soil'],
      mechanical: ['Blue sticky traps installed at 20-25 traps per acre at crop height'],
      biological: ['Release predatory mites (Amblyseius swirskii) or predatory thrips (Franklinothrips vespiformis)', 'Apply Beauveria bassiana liquid formulation'],
      chemical: ['If leaf damage exceeds 10% shoots: Apply Spinetoram 11.7% SC or Diafenthiuron 50% WP in accordance with regional regulations and pre-harvest intervals.']
    },
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80'
  }
];
