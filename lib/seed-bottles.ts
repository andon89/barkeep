import type { BottleStyle, Category } from './types'

export interface SeedBottle { name: string; category: Category; style: BottleStyle }

const CLEAR = '#d9e4e2'
const WHITE = '#eef2f0'
const PAPER = '#f4f1e8'
const CREAM = '#f4efdd'

const s = (shape: BottleStyle['shape'], glass: string, liquid: string, label: string, labelText: string, accent: string): BottleStyle =>
  ({ shape, glass, liquid, label, labelText, accent })

export const SEED_BOTTLES: SeedBottle[] = [
  // Base Spirits
  { name: "Hendrick's Flora & Fauna Gin", category: 'Base Spirits', style: s('apothecary', '#1e1b22', '#1e1b22', '#e8dcc4', "HENDRICK'S", '#4b7a6a') },
  { name: 'St. George Botanivore Gin', category: 'Base Spirits', style: s('tall', CLEAR, WHITE, '#f2ebdd', 'ST. GEORGE', '#2e5a3a') },
  { name: 'Tanqueray London Dry Gin', category: 'Base Spirits', style: s('standard', '#1f6b3a', '#1f6b3a', '#e4e4e4', 'TANQUERAY', '#c8102e') },
  { name: 'Kettle One Vodka', category: 'Base Spirits', style: s('tall', CLEAR, WHITE, PAPER, 'KETEL ONE', '#1e3a6e') },
  { name: 'Skyy Vodka', category: 'Base Spirits', style: s('tall', '#1f4fb5', '#1f4fb5', '#1f4fb5', 'SKYY', '#e8ecf0') },
  { name: 'Smirnoff Spicy Tamarind', category: 'Base Spirits', style: s('tall', CLEAR, '#c8551a', '#b5121b', 'SMIRNOFF', '#f5d26a') },
  { name: 'Kirkland Silver Tequila', category: 'Base Spirits', style: s('tall', CLEAR, WHITE, '#c8102e', 'KIRKLAND', '#f5f0e6') },
  { name: 'Kirkland Tequila Blanca', category: 'Base Spirits', style: s('standard', CLEAR, WHITE, '#1e3a6e', 'KIRKLAND', '#f5f0e6') },
  { name: 'Recuerdo Mezcal', category: 'Base Spirits', style: s('squat', CLEAR, '#f0eee6', '#2b2b2b', 'RECUERDO', '#d9a441') },
  // Whiskey
  { name: "Masterson's 10 Year Straight Rye", category: 'Whiskey', style: s('standard', CLEAR, '#b8651b', '#2a1e14', "MASTERSON'S", '#c9a24b') },
  { name: 'Bulleit Rye', category: 'Whiskey', style: s('flask', CLEAR, '#c2701e', '#2f7a4b', 'BULLEIT', '#f1e9d6') },
  { name: "Angel's Envy Bourbon", category: 'Whiskey', style: s('decanter', CLEAR, '#b5581b', '#f2ead9', "ANGEL'S ENVY", '#8c1d2a') },
  { name: 'Royal Suntory Whisky', category: 'Whiskey', style: s('squat', CLEAR, '#b9702a', '#f3ebd8', 'SUNTORY', '#1a2a44') },
  { name: 'Teeling Irish Whiskey', category: 'Whiskey', style: s('standard', CLEAR, '#c68a2e', '#1f1f1f', 'TEELING', '#c9a24b') },
  // Rum
  { name: "Pusser's Rum", category: 'Rum', style: s('standard', CLEAR, '#6b3a15', '#1e3a6e', "PUSSER'S", '#f1e9d6') },
  { name: "Gosling's Black Seal Rum", category: 'Rum', style: s('standard', '#141210', '#141210', '#f2ead9', "GOSLING'S", '#141210') },
  { name: 'Barbancourt Haitian White Rum', category: 'Rum', style: s('standard', CLEAR, WHITE, PAPER, 'BARBANCOURT', '#1b5e3b') },
  { name: 'Bacardi White Rum', category: 'Rum', style: s('tall', CLEAR, WHITE, PAPER, 'BACARDI', '#c8102e') },
  { name: 'Captain Morgan Spiced Rum', category: 'Rum', style: s('standard', CLEAR, '#c27a2a', '#f5e6c4', 'CAPTAIN MORGAN', '#8c1d2a') },
  { name: 'Tahitian Manutea Rum', category: 'Rum', style: s('tall', CLEAR, '#f0e6c8', '#1e6f8e', 'MANUTEA', '#f5f0e6') },
  { name: 'Mamajuana', category: 'Rum', style: s('apothecary', CLEAR, '#6e4520', '#c9a24b', 'MAMAJUANA', '#3b2410') },
  // Chartreuse Family
  { name: 'Green Chartreuse', category: 'Chartreuse Family', style: s('squat', CLEAR, '#3e8e3a', CREAM, 'CHARTREUSE', '#1f5a2a') },
  { name: 'Yellow Chartreuse', category: 'Chartreuse Family', style: s('squat', CLEAR, '#e8c43a', CREAM, 'CHARTREUSE', '#b8901b') },
  { name: 'MOF Yellow Chartreuse', category: 'Chartreuse Family', style: s('squat', CLEAR, '#e3b92e', '#1e1e1e', 'M.O.F.', '#e8c43a') },
  { name: "Chartreuse Liqueur d'Élixir 1605", category: 'Chartreuse Family', style: s('squat', CLEAR, '#4c9b45', CREAM, '1605', '#3a6e2e') },
  { name: 'Chartreuse Végétal', category: 'Chartreuse Family', style: s('dasher', '#7a5230', '#7a5230', CREAM, 'VÉGÉTAL', '#2e7a34') },
  // Aperitifs & Vermouth
  { name: 'Campari', category: 'Aperitifs & Vermouth', style: s('standard', CLEAR, '#d9102a', PAPER, 'CAMPARI', '#d9102a') },
  { name: 'St-Germain Elderflower Liqueur', category: 'Aperitifs & Vermouth', style: s('decanter', CLEAR, '#f1e8b8', CREAM, 'ST-GERMAIN', '#b08d2b') },
  { name: 'Lillet Blanc', category: 'Aperitifs & Vermouth', style: s('standard', '#dce8d8', '#f0e9c0', CREAM, 'LILLET', '#c8a64b') },
  { name: 'Dry Vermouth', category: 'Aperitifs & Vermouth', style: s('standard', '#d8e6d6', '#f0ecd0', PAPER, 'DRY VERMOUTH', '#2e6e4e') },
  { name: 'Sweet (Red) Vermouth', category: 'Aperitifs & Vermouth', style: s('standard', CLEAR, '#7a2a1e', PAPER, 'SWEET VERMOUTH', '#8c1d2a') },
  // Amari & Digestifs
  { name: 'Fernet-Branca', category: 'Amari & Digestifs', style: s('standard', CLEAR, '#2a1a12', '#f2ead9', 'FERNET-BRANCA', '#1f4e8c') },
  { name: 'Fernet Branca Menta', category: 'Amari & Digestifs', style: s('standard', CLEAR, '#2a1a12', '#2e9e6b', 'BRANCA MENTA', '#f2ead9') },
  { name: 'Amaro Nonino', category: 'Amari & Digestifs', style: s('tall', CLEAR, '#b8641e', CREAM, 'NONINO', '#7a1e2a') },
  { name: 'Facciabruta Centerbe', category: 'Amari & Digestifs', style: s('tall', CLEAR, '#2e8b3a', '#1e1e1e', 'CENTERBE', '#e8c43a') },
  { name: 'Strega', category: 'Amari & Digestifs', style: s('tall', CLEAR, '#e8d53a', CREAM, 'STREGA', '#2b3f8c') },
  { name: 'DOM Bénédictine', category: 'Amari & Digestifs', style: s('squat', '#4b3a1a', '#4b3a1a', CREAM, 'BÉNÉDICTINE', '#8c1d2a') },
  { name: 'Becherovka', category: 'Amari & Digestifs', style: s('square', '#2e6e3a', '#2e6e3a', CREAM, 'BECHEROVKA', '#1e4d2a') },
  // Brandy & Pisco
  { name: 'Corbel Brandy', category: 'Brandy & Pisco', style: s('standard', CLEAR, '#b8651b', '#1e1e1e', 'CORBEL', '#c9a24b') },
  { name: 'Kirschwasser', category: 'Brandy & Pisco', style: s('tall', CLEAR, WHITE, PAPER, 'KIRSCH', '#8c1d2a') },
  { name: 'Viña de Oro Pisco', category: 'Brandy & Pisco', style: s('standard', CLEAR, '#f0eee6', '#1e3a6e', 'VIÑA DE ORO', '#c9a24b') },
  // Liqueurs
  { name: 'Luxardo Maraschino', category: 'Liqueurs', style: s('squat', '#c9b27a', '#c9b27a', '#2e7a3a', 'LUXARDO', CREAM) },
  { name: 'Mr. Black Coffee Liqueur', category: 'Liqueurs', style: s('apothecary', CLEAR, '#17110e', CREAM, 'MR BLACK', '#17110e') },
  { name: 'Baileys Irish Cream', category: 'Liqueurs', style: s('standard', '#2a1f16', '#2a1f16', '#3a2a1c', 'BAILEYS', '#f1e3c8') },
  { name: 'Velvet Falernum', category: 'Liqueurs', style: s('tall', CLEAR, '#f0e6c8', '#1e5a6e', 'FALERNUM', CREAM) },
  { name: 'Disaronno Amaretto', category: 'Liqueurs', style: s('square', CLEAR, '#b8651b', CREAM, 'DISARONNO', '#1e1e1e') },
  { name: 'DeKuyper Triple Sec', category: 'Liqueurs', style: s('standard', CLEAR, WHITE, PAPER, 'TRIPLE SEC', '#e67e22') },
  { name: 'Peppermint Schnapps', category: 'Liqueurs', style: s('tall', CLEAR, WHITE, PAPER, 'PEPPERMINT', '#1e8e5a') },
  { name: 'Limoncello', category: 'Liqueurs', style: s('tall', CLEAR, '#f2e84a', PAPER, 'LIMONCELLO', '#2b7a3a') },
  { name: 'Licor 43', category: 'Liqueurs', style: s('tall', CLEAR, '#e8b83a', CREAM, '43', '#8c1d2a') },
  { name: 'Edinburgh Rhubarb & Ginger', category: 'Liqueurs', style: s('tall', CLEAR, '#e08aa0', CREAM, 'EDINBURGH', '#b03a5a') },
  { name: 'Crème de Violette', category: 'Liqueurs', style: s('tall', CLEAR, '#5b3a8c', CREAM, 'VIOLETTE', '#5b3a8c') },
  { name: 'Port', category: 'Liqueurs', style: s('standard', '#1a1410', '#1a1410', CREAM, 'PORT', '#6e1e2a') },
  // Bitters & Garnishes
  { name: 'Angostura Bitters', category: 'Bitters & Garnishes', style: s('dasher', CLEAR, '#5a2a14', CREAM, 'ANGOSTURA', '#e8b83a') },
  { name: 'Orange Bitters', category: 'Bitters & Garnishes', style: s('dasher', CLEAR, '#c25a1e', CREAM, 'ORANGE', '#e67e22') },
  { name: "Peychaud's Bitters", category: 'Bitters & Garnishes', style: s('dasher', CLEAR, '#b5121b', CREAM, "PEYCHAUD'S", '#b5121b') },
  { name: 'Luxardo Maraschino Cherries', category: 'Bitters & Garnishes', style: s('jar', CLEAR, '#3a0e14', '#2e7a3a', 'LUXARDO', CREAM) },
]
