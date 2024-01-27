import { NatureCorrection, ThreeStats } from './type';

const getPokemonId = (no: number, form: string | null): string =>
  `${no}${form === null ? '' : '-' + form}`;

const getPokemonUrl = (no: number, form: string | null): string =>
  `/${String(no).padStart(4, '0')}${form === null ? '' : '/' + form}`;

const getPokemonImgUrl = (no: number, form: string | null): string =>
  `/image/pokemon/${String(no).padStart(4, '0')}${form == null ? '' : '-' + form}.webp`;

const getTypeImage = (typeId: number): string => `/image/type/${typeId}.svg`;

const natureCorrectionMap = new Map<NatureCorrection, number>();
natureCorrectionMap.set(NatureCorrection.Good, 1.1);
natureCorrectionMap.set(NatureCorrection.Normal, 1.0);
natureCorrectionMap.set(NatureCorrection.Bad, 0.9);

const calcHp = (baseStats: number, level: number, threeStats: ThreeStats): number => {
  const effortTemp = Math.floor(threeStats.effortValue / 4);
  return (
    Math.floor(((baseStats * 2 + threeStats.individualValue + effortTemp) * level) / 100) +
    level +
    10
  );
};

const calcStatus = (baseStats: number, level: number, threeStats: ThreeStats): number => {
  const nature = natureCorrectionMap.get(threeStats.natureCorrection);
  const effortTemp = Math.floor(threeStats.effortValue / 4);
  const base =
    Math.floor(((baseStats * 2 + threeStats.individualValue + effortTemp) * level) / 100) + 5;
  return Math.floor(base * (nature ?? 1));
};

const MAX_INDIVIDUAL_VALUE = 31;
const MAX_EFFORT_VALUE = 252;

const getIndividualValueLabel = (individualValue: number): string => {
  if (individualValue === MAX_INDIVIDUAL_VALUE) return '最大';
  return String(individualValue);
};

const getEffortValueLabel = (effortValue: number): string => {
  if (effortValue === MAX_EFFORT_VALUE) return '最大';
  return String(effortValue);
};

const getNatureCorrectionLabel = (natureCorrection: NatureCorrection): string => {
  if (natureCorrection === NatureCorrection.Good) return '＋';
  if (natureCorrection === NatureCorrection.Bad) return '−';
  return '無';
};

const natureCorrectionNameMap: Map<string, Map<string, string>> = new Map([
  [
    'attack',
    new Map([
      ['defence', 'さみしがり'],
      ['spAttack', 'いじっぱり'],
      ['spDefence', 'やんちゃ'],
      ['speed', 'ゆうかん'],
    ]),
  ],
  [
    'defence',
    new Map([
      ['attack', 'ずぶとい'],
      ['spAttack', 'わんぱく'],
      ['spDefence', 'のうてんき'],
      ['speed', 'のんき'],
    ]),
  ],
  [
    'spAttack',
    new Map([
      ['attack', 'ひかえめ'],
      ['defence', 'おっとり'],
      ['spDefence', 'うっかりや'],
      ['speed', 'れいせい'],
    ]),
  ],
  [
    'spDefence',
    new Map([
      ['attack', 'おだやか'],
      ['defence', 'おとなしい'],
      ['spAttack', 'しんちょう'],
      ['speed', 'なまいき'],
    ]),
  ],
  [
    'speed',
    new Map([
      ['attack', 'おくびょう'],
      ['defence', 'せっかち'],
      ['spAttack', 'ようき'],
      ['spDefence', 'むじゃき'],
    ]),
  ],
]);

const getNatureCorrectionTitle = (
  goodStatusName: string,
  badStatusName: string,
): string | undefined => natureCorrectionNameMap.get(goodStatusName)?.get(badStatusName);

export {
  MAX_EFFORT_VALUE,
  MAX_INDIVIDUAL_VALUE,
  calcHp,
  calcStatus,
  getEffortValueLabel,
  getIndividualValueLabel,
  getNatureCorrectionLabel,
  getNatureCorrectionTitle,
  getPokemonId,
  getPokemonImgUrl,
  getPokemonUrl,
  getTypeImage,
};
