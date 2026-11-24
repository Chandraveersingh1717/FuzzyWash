import type { ScenarioPreset } from '../types/fuzzy';

export const PRESETS: ScenarioPreset[] = [
  {
    id: 'daily',
    name: 'Lightly Soiled Daily Clothes',
    description: 'Regular cotton shirts worn for a day. Low dirt, no grease, standard load.',
    icon: '👕',
    sensors: { dirtiness: 20, greasiness: 10, loadWeight: 3, fabricRobustness: 60, waterHardness: 100 },
  },
  {
    id: 'heavy-cotton',
    name: 'Heavily Soiled Cotton',
    description: 'Work clothes with heavy soil. High dirtiness, moderate grease, full load.',
    icon: '🧱',
    sensors: { dirtiness: 85, greasiness: 50, loadWeight: 7, fabricRobustness: 80, waterHardness: 150 },
  },
  {
    id: 'greasy-towels',
    name: 'Greasy Kitchen Towels',
    description: 'Cooking towels with heavy grease. Max greasiness, moderate dirt.',
    icon: '🍳',
    sensors: { dirtiness: 60, greasiness: 90, loadWeight: 2, fabricRobustness: 70, waterHardness: 120 },
  },
  {
    id: 'silk',
    name: 'Delicate Silk Clothes',
    description: 'Fine silk blouses. Very delicate fabric requires gentle wash.',
    icon: '🧵',
    sensors: { dirtiness: 15, greasiness: 10, loadWeight: 1.5, fabricRobustness: 10, waterHardness: 80 },
  },
  {
    id: 'family',
    name: 'Heavy Family Laundry',
    description: 'Full family wash — jeans, towels, uniforms. Max load, various soil.',
    icon: '👨‍👩‍👧‍👦',
    sensors: { dirtiness: 70, greasiness: 40, loadWeight: 9, fabricRobustness: 75, waterHardness: 160 },
  },
  {
    id: 'hard-water',
    name: 'Hard Water Washing',
    description: 'Standard wash but with very hard water — extra detergent required.',
    icon: '💧',
    sensors: { dirtiness: 35, greasiness: 20, loadWeight: 5, fabricRobustness: 60, waterHardness: 280 },
  },
  {
    id: 'default',
    name: 'Default / Custom',
    description: 'Default balanced scenario — adjust sliders to explore.',
    icon: '⚙️',
    sensors: { dirtiness: 35, greasiness: 40, loadWeight: 5, fabricRobustness: 50, waterHardness: 150 },
  },
];

export const DEFAULT_SENSORS = PRESETS.find(p => p.id === 'default')!.sensors;
