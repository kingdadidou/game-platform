export const FRONTIER_REGIONS = [
  { id: 'nord', name: 'Nordheim', x: 50, y: 12, links: ['fjord', 'acier', 'centre'] },
  { id: 'fjord', name: 'Fjord', x: 25, y: 20, links: ['nord', 'brume', 'centre'] },
  { id: 'acier', name: 'Acier', x: 75, y: 20, links: ['nord', 'ambre', 'centre'] },
  { id: 'brume', name: 'Brume', x: 12, y: 42, links: ['fjord', 'ouest', 'centre'] },
  { id: 'centre', name: 'Citadelle', x: 50, y: 39, links: ['nord', 'fjord', 'acier', 'brume', 'ambre', 'delta', 'steppe'] },
  { id: 'ambre', name: 'Ambre', x: 88, y: 42, links: ['acier', 'est', 'centre'] },
  { id: 'ouest', name: 'Solaria', x: 17, y: 67, links: ['brume', 'delta', 'cap'] },
  { id: 'delta', name: 'Delta', x: 38, y: 62, links: ['ouest', 'centre', 'steppe', 'cap'] },
  { id: 'steppe', name: 'Steppe', x: 62, y: 62, links: ['centre', 'ambre', 'est', 'iles', 'delta'] },
  { id: 'est', name: 'Orage', x: 83, y: 67, links: ['ambre', 'steppe', 'iles'] },
  { id: 'cap', name: 'Cap-Sud', x: 32, y: 87, links: ['ouest', 'delta', 'iles'] },
  { id: 'iles', name: 'Archipel', x: 68, y: 87, links: ['cap', 'delta', 'steppe', 'est'] }
];

export const FRONTIER_REGION_BY_ID = Object.fromEntries(FRONTIER_REGIONS.map(region => [region.id, region]));
