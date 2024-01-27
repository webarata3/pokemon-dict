type PokemonToc = {
  name: string;
  no: number;
  form: string | null;
  regionId: number;
};

type PokemonStatus = {
  hp: number;
  attack: number;
  defence: number;
  spAttack: number;
  spDefence: number;
  speed: number;
};

type PokemonType = {
  typeId: number;
  typeName: string;
};

type PokemonAbility = {
  abilityName: string;
  abilityEffect: string;
  hidden: boolean;
};

type Pokemon = {
  no: number;
  form: string | null;
  name: string;
  formName: string | null;
  status: PokemonStatus;
  type: PokemonType[];
  ability: PokemonAbility[];
  regionId: number;
  evolution: string[];
};

enum NatureCorrection {
  Good,
  Normal,
  Bad,
}

type ThreeStats = {
  individualValue: number;
  effortValue: number;
  natureCorrection: NatureCorrection;
};

type Scale = 'ForTimes' | 'TwoTimes' | 'Same' | 'Half' | 'Quarter' | 'Zero';

const STATUS_LIST: Array<{ label: string; statusName: keyof PokemonStatus }> = [
  {
    label: 'HP',
    statusName: 'hp',
  },
  {
    label: 'こうげき',
    statusName: 'attack',
  },
  {
    label: 'ぼうぎょ',
    statusName: 'defence',
  },
  {
    label: 'とくこう',
    statusName: 'spAttack',
  },
  {
    label: 'とくぼう',
    statusName: 'spDefence',
  },
  {
    label: 'すばやさ',
    statusName: 'speed',
  },
];

type Region = {
  regionId: number;
  regionName: string;
  softwareMain: string;
  softwareSub: string | null;
};

export type {
  Pokemon,
  PokemonAbility,
  PokemonStatus,
  PokemonToc,
  PokemonType,
  Region,
  Scale,
  ThreeStats,
};

export { NatureCorrection, STATUS_LIST };
