import React, { useState, useEffect } from 'react';
import TypeWeek from './TypeWeek';
import TypeStrong from './TypeStrong';
import { PokemonType, Scale } from '../util/Types';
import { getTypeImage } from '../util/PokemonUtil';

type Params = {
  pokemonTypes: PokemonType[];
};

const TypeCompatibility = ({ pokemonTypes }: Params): JSX.Element => {
  const [scales, setScales] = useState<Scale[]>([]);

  useEffect(() => {
    setScales(getTypeChart(pokemonTypes));
  }, [pokemonTypes]);

  return (
    <section className="pokemon__types">
      <div className="type__header">
        <h2 className="main__sub-title">タイプと弱点</h2>
        <div className="main__types">
          {
            pokemonTypes.map(pokemonType =>
              <div className="main__type main__continue-content"
                key={pokemonType.typeId}>
                <img src={getTypeImage(pokemonType.typeId)} className="type_image" />
                <br />
                <span className="type__name">{typeNames[pokemonType.typeId - 1]}</span>
              </div>
            )
          }
        </div>
      </div>
      <div className="type__scale">
        {
          scales.map((scale, index) =>
            <div key={index}>
              <TypeWeek scale={scale} />
              <img
                src={getTypeImage(index + 1)}
                className="type__image-small"
                title={typeNames[index]} />
              <TypeStrong scale={scale} />
            </div>
          )
        }
      </div>
    </section>
  );
};

const typeNames: string[] = [
  'ノーマル', 'ほのお', 'みず', 'くさ', 'でんき', 'こおり',
  'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
  'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'];

const typeChart: Scale[][] =
  [['Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'TwoTimes', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Same', 'Zero', 'Same', 'Same', 'Same', 'Same']
    , ['Same', 'Half', 'TwoTimes', 'Half', 'Same', 'Half',
    'Same', 'Same', 'TwoTimes', 'Same', 'Same', 'Half',
    'TwoTimes', 'Same', 'Same', 'Same', 'Half', 'Half']
    , ['Same', 'Half', 'Half', 'TwoTimes', 'TwoTimes', 'Half',
    'Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Same', 'Same', 'Same', 'Same', 'Half', 'Same']
    , ['Same', 'TwoTimes', 'Half', 'Half', 'Half', 'TwoTimes',
    'Same', 'TwoTimes', 'Half', 'TwoTimes', 'Same', 'TwoTimes',
    'Same', 'Same', 'Same', 'Same', 'Same', 'Same']
    , ['Same', 'Same', 'Same', 'Same', 'Half', 'Same',
    'Same', 'Same', 'TwoTimes', 'Half', 'Same', 'Same',
    'Same', 'Same', 'Same', 'Same', 'Half', 'Same']
    , ['Same', 'TwoTimes', 'Same', 'Same', 'Same', 'Half',
    'TwoTimes', 'Same', 'Same', 'Same', 'Same', 'Same',
    'TwoTimes', 'Same', 'Same', 'Same', 'TwoTimes', 'Same']
    , ['Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Same', 'Same', 'Same', 'TwoTimes', 'TwoTimes', 'Half',
    'Half', 'Same', 'Same', 'Half', 'Same', 'TwoTimes']
    , ['Same', 'Same', 'Same', 'Half', 'Same', 'Same',
    'Half', 'Half', 'TwoTimes', 'Same', 'TwoTimes', 'Half',
    'Same', 'Same', 'Same', 'Same', 'Same', 'Half']
    , ['Same', 'Same', 'TwoTimes', 'TwoTimes', 'Zero', 'TwoTimes',
    'Same', 'Half', 'Same', 'Same', 'Same', 'Same',
    'Half', 'Same', 'Same', 'Same', 'Same', 'Same']
    , ['Same', 'Same', 'Same', 'Half', 'TwoTimes', 'TwoTimes',
    'Half', 'Same', 'Zero', 'Same', 'Same', 'Half',
    'TwoTimes', 'Same', 'Same', 'Same', 'Same', 'Same']
    , ['Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Half', 'Same', 'Same', 'Same', 'Half', 'TwoTimes',
    'Same', 'TwoTimes', 'Same', 'TwoTimes', 'Same', 'Same']
    , ['Same', 'TwoTimes', 'Same', 'Half', 'Same', 'Same',
    'Half', 'Same', 'Half', 'TwoTimes', 'Same', 'Same',
    'TwoTimes', 'Same', 'Same', 'Same', 'Same', 'Same']
    , ['Half', 'Half', 'TwoTimes', 'TwoTimes', 'Same', 'Same',
    'TwoTimes', 'Half', 'TwoTimes', 'Half', 'Same', 'Same',
    'Same', 'Same', 'Same', 'Same', 'TwoTimes', 'Same']
    , ['Zero', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Zero', 'Half', 'Same', 'Same', 'Same', 'Half',
    'Same', 'TwoTimes', 'Same', 'TwoTimes', 'Same', 'Same']
    , ['Same', 'Half', 'Half', 'Half', 'Half', 'TwoTimes',
    'Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Same', 'Same', 'TwoTimes', 'Same', 'Same', 'TwoTimes']
    , ['Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'TwoTimes', 'Same', 'Same', 'Same', 'Zero', 'TwoTimes',
    'Same', 'Half', 'Same', 'Half', 'Same', 'TwoTimes'],
  ['Half', 'TwoTimes', 'Same', 'Half', 'Same', 'Half',
    'TwoTimes', 'Zero', 'TwoTimes', 'Half', 'Half', 'Half',
    'Half', 'Same', 'Half', 'Same', 'Half', 'Half']
    , ['Half', 'TwoTimes', 'Same', 'Half', 'Same', 'Half',
    'TwoTimes', 'Zero', 'TwoTimes', 'Half', 'Half', 'Half',
    'Half', 'Same', 'Half', 'Same', 'Half', 'Half']
    , ['Same', 'Same', 'Same', 'Same', 'Same', 'Same',
    'Half', 'TwoTimes', 'Same', 'Same', 'Same', 'Half',
    'Same', 'Same', 'Zero', 'Half', 'TwoTimes', 'Same']
  ];

const getTypeChart = (pokemonTypes: PokemonType[]): Scale[] => {
  const scales = pokemonTypes.map(pokemonType => typeChart[pokemonType.typeId - 1]);
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
