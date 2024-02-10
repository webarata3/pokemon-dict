import Image from 'next/image';
import TypeStrong from './type_strong';
import TypeWeek from './type_week';
import { getTypeImage } from './util/pokemon_util';
import { PokemonType, Scale } from './util/type';

type Params = {
  pokemonTypes: PokemonType[];
};

const TypeCompatibility = ({ pokemonTypes }: Params): React.ReactElement => {
  const scales = getTypeChart(pokemonTypes);

  return (
    <section className="p-2">
      <div className="flex items-start gap-5">
        <h2 className="headline">タイプと弱点</h2>
        <div className="flex gap-1">
          {pokemonTypes.map((pokemonType) => (
            <div className="text-center mb-2" key={pokemonType.typeId}>
              <Image
                src={getTypeImage(pokemonType.typeId)}
                alt=""
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
              />
              <span className="text-xs mt-1">{typeNames[pokemonType.typeId - 1]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        {scales.map((scale, index) => (
          <div key={index}>
            <TypeWeek scale={scale} />
            <img
              src={getTypeImage(index + 1)}
              width={20}
              height={20}
              className="w-[20px] h-[20px]"
              title={typeNames[index]}
            />
            <TypeStrong scale={scale} />
          </div>
        ))}
      </div>
    </section>
  );
};

const typeNames: string[] = [
  'ノーマル',
  'ほのお',
  'みず',
  'くさ',
  'でんき',
  'こおり',
  'かくとう',
  'どく',
  'じめん',
  'ひこう',
  'エスパー',
  'むし',
  'いわ',
  'ゴースト',
  'ドラゴン',
  'あく',
  'はがね',
  'フェアリー',
];

const typeChart: Scale[][] = [
  [
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Zero',
    'Same',
    'Same',
    'Same',
    'Same',
  ],
  [
    'Same',
    'Half',
    'TwoTimes',
    'Half',
    'Same',
    'Half',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Half',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Half',
    'Half',
  ],
  [
    'Same',
    'Half',
    'Half',
    'TwoTimes',
    'TwoTimes',
    'Half',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
  ],
  [
    'Same',
    'TwoTimes',
    'Half',
    'Half',
    'Half',
    'TwoTimes',
    'Same',
    'TwoTimes',
    'Half',
    'TwoTimes',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Half',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
  ],
  [
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Half',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'TwoTimes',
    'Half',
    'Half',
    'Same',
    'Same',
    'Half',
    'Same',
    'TwoTimes',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
    'Same',
    'Half',
    'Half',
    'TwoTimes',
    'Same',
    'TwoTimes',
    'Half',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
  ],
  [
    'Same',
    'Same',
    'TwoTimes',
    'TwoTimes',
    'Zero',
    'TwoTimes',
    'Same',
    'Half',
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Half',
    'TwoTimes',
    'TwoTimes',
    'Half',
    'Same',
    'Zero',
    'Same',
    'Same',
    'Half',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
    'Same',
    'Same',
    'Half',
    'TwoTimes',
    'Same',
    'TwoTimes',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
  ],
  [
    'Same',
    'TwoTimes',
    'Same',
    'Half',
    'Same',
    'Same',
    'Half',
    'Same',
    'Half',
    'TwoTimes',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
  ],
  [
    'Half',
    'Half',
    'TwoTimes',
    'TwoTimes',
    'Same',
    'Same',
    'TwoTimes',
    'Half',
    'TwoTimes',
    'Half',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
  ],
  [
    'Zero',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Zero',
    'Half',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
    'TwoTimes',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
  ],
  [
    'Same',
    'Half',
    'Half',
    'Half',
    'Half',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'TwoTimes',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Zero',
    'TwoTimes',
    'Same',
    'Half',
    'Same',
    'Half',
    'Same',
    'TwoTimes',
  ],
  [
    'Half',
    'TwoTimes',
    'Same',
    'Half',
    'Same',
    'Half',
    'TwoTimes',
    'Zero',
    'TwoTimes',
    'Half',
    'Half',
    'Half',
    'Half',
    'Same',
    'Half',
    'Same',
    'Half',
    'Half',
  ],
  [
    'Half',
    'TwoTimes',
    'Same',
    'Half',
    'Same',
    'Half',
    'TwoTimes',
    'Zero',
    'TwoTimes',
    'Half',
    'Half',
    'Half',
    'Half',
    'Same',
    'Half',
    'Same',
    'Half',
    'Half',
  ],
  [
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Same',
    'Half',
    'TwoTimes',
    'Same',
    'Same',
    'Same',
    'Half',
    'Same',
    'Same',
    'Zero',
    'Half',
    'TwoTimes',
    'Same',
  ],
];

const getTypeChart = (pokemonTypes: PokemonType[]): Scale[] => {
  const scales = pokemonTypes.map((pokemonType) => typeChart[pokemonType.typeId - 1]);
  if (scales.length === 1) return scales[0];
  return scales[0].map((item, index) => calcScale(item, scales[1][index]));
};

const calcScale = (scale1: Scale, scale2: Scale): Scale => {
  if (scale1 === 'Zero' || scale2 === 'Zero') return 'Zero';
  if (scale1 === 'Same') return scale2;
  if (scale2 === 'Same') return scale1;

  if (scale1 === 'TwoTimes') {
    if (scale2 === 'TwoTimes') return 'ForTimes';
    return 'Same';
  }

  // 'Half'のみ
  if (scale2 === 'TwoTimes') return 'Same';
  return 'Quarter';
};
export default TypeCompatibility;
