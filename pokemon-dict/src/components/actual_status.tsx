import React, { useState } from 'react';
import CustomStatus from './custom_status';
import OneStatus from './one_status';
import {
  MAX_EFFORT_VALUE,
  MAX_INDIVIDUAL_VALUE,
  getEffortValueLabel,
  getIndividualValueLabel,
  getNatureCorrectionLabel,
  getNatureCorrectionTitle,
} from './util/pokemon_util';
import { NatureCorrection, PokemonStatus, STATUS_LIST, ThreeStats } from './util/type';

type Params = {
  pokemonStatus: PokemonStatus;
};

const threeStatsList: Array<ThreeStats> = [
  {
    individualValue: MAX_INDIVIDUAL_VALUE,
    effortValue: MAX_EFFORT_VALUE,
    natureCorrection: NatureCorrection.Good,
  },
  {
    individualValue: MAX_INDIVIDUAL_VALUE,
    effortValue: 0,
    natureCorrection: NatureCorrection.Good,
  },
  {
    individualValue: MAX_INDIVIDUAL_VALUE,
    effortValue: 0,
    natureCorrection: NatureCorrection.Normal,
  },
];

const ActualStatus = ({ pokemonStatus }: Params): React.ReactElement => {
  const [level, setLevel] = useState(50);
  const [individualValue, setIndividualValue] = useState<number>(MAX_INDIVIDUAL_VALUE);
  const [goodStatusName, setGoodStatusName] = useState<string>('attack');
  const [badStatusName, setBadStatusName] = useState<string>('defence');
  const [effortAll, setEffortAll] = useState<number>(0);
  const [effortValues, setEffortValues] = useState<PokemonStatus>({
    hp: 0,
    attack: 0,
    defence: 0,
    spAttack: 0,
    spDefence: 0,
    speed: 0,
  });

  const onChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formLevel = e.target.value;
    const parseLevel = parseInt(formLevel);
    const inputLevel = parseLevel === undefined ? 1 : parseLevel;
    if (inputLevel < 1) {
      setLevel(1);
    } else if (inputLevel > 100) {
      setLevel(100);
    } else {
      setLevel(inputLevel);
    }
  };

  const onChangeNatureCorrection = (value: string, isGood: boolean) => {
    const otherValue = isGood ? badStatusName : goodStatusName;
    if (value === otherValue) {
      return;
    }
    if (isGood) {
      setGoodStatusName(value);
    } else {
      setBadStatusName(value);
    }
  };

  const changeEffortValue = (value: number, statusName: keyof PokemonStatus): void => {
    value = value > MAX_EFFORT_VALUE ? MAX_EFFORT_VALUE : value;
    const diff = 512 - (effortAll - effortValues[statusName]);
    value = value > diff ? diff : value;

    effortValues[statusName] = value;
    setEffortValues(effortValues);
    setEffortAll(
      effortValues.hp +
        effortValues.attack +
        effortValues.defence +
        effortValues.spAttack +
        effortValues.spDefence +
        effortValues.speed,
    );
  };

  const getSelectedNatureCorrection = (statusName: string): NatureCorrection => {
    if (statusName === goodStatusName) return NatureCorrection.Good;
    if (statusName === badStatusName) return NatureCorrection.Bad;
    return NatureCorrection.Normal;
  };

  const onClickLevel = (newLevel: number): void => setLevel(newLevel);

  return (
    <>
      <section className="p-2">
        <h2 className="headline">実数値詳細</h2>
        <div>
          <label htmlFor="level" className="mr-1">
            LV
          </label>
          <input
            type="number"
            id="level"
            onChange={onChangeLevel}
            className="border border-slate-200 w-[4em] text-right"
            value={level}
          />
          {[1, 5, 50, 100].map((value, index) => (
            <button
              className="button-link"
              type="button"
              key={index}
              onClick={() => onClickLevel(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr>
              <th className="py-2 px-1">個体値</th>
              {threeStatsList.map((threeStats, index) => (
                <th className="py-2 px-1 text-main" key={index}>
                  {getIndividualValueLabel(threeStats.individualValue)}
                </th>
              ))}
              <th rowSpan={3}></th>
              <th className="py-2 px-1 text-main" colSpan={3}>
                <span>
                  <input
                    type="radio"
                    id="individualValueMax"
                    name="individualValue"
                    className="hidden peer"
                    checked={individualValue === MAX_INDIVIDUAL_VALUE}
                    onChange={() => setIndividualValue(MAX_INDIVIDUAL_VALUE)}
                  />
                  <label
                    htmlFor="individualValueMax"
                    className="cursor-pointer border border-stone-200 py-[2px] px-1 peer-checked:text-white peer-checked:bg-main"
                  >
                    最大
                  </label>
                </span>
                <span>
                  <input
                    type="radio"
                    id="individualValueMin"
                    name="individualValue"
                    className="hidden peer"
                    checked={individualValue === 0}
                    onChange={() => setIndividualValue(0)}
                  />
                  <label
                    htmlFor="individualValueMin"
                    className="cursor-pointer border border-stone-200 py-[2px] px-1 peer-checked:text-white peer-checked:bg-main"
                  >
                    0
                  </label>
                </span>
              </th>
              <th></th>
            </tr>
            <tr>
              <th className="py-2 px-1">努力値</th>
              {threeStatsList.map((threeStats, index) => (
                <th className="py-2 px-1 text-main" key={index}>
                  {getEffortValueLabel(threeStats.effortValue)}
                </th>
              ))}
              <th colSpan={3}></th>
              <th className="py-2 px-1 text-left">努力値</th>
            </tr>
            <tr>
              <th className="py-2 px-1">性格補正</th>
              {threeStatsList.map((threeStats, index) => (
                <th className="py-2 px-1 text-main" key={index}>
                  {getNatureCorrectionLabel(threeStats.natureCorrection)}
                </th>
              ))}
              <th className="py-2 px-1 text-center min-w-[6rem]" colSpan={3}>
                {getNatureCorrectionTitle(goodStatusName, badStatusName)}
              </th>
              <th className="py-2 px-1 text-left">{`残り: ${512 - effortAll}`}</th>
            </tr>
          </thead>
          <tbody>
            {STATUS_LIST.map((s, index) => (
              <tr key={index}>
                <th className="py-2 px-1 text-center">{s.label}</th>
                {threeStatsList.map((threeStats, i) => (
                  <OneStatus
                    status={pokemonStatus[s.statusName]}
                    statusName={s.statusName}
                    level={level}
                    threeStats={threeStats}
                    key={i}
                  />
                ))}
                {index === 0 ? (
                  <th rowSpan={6} className="py-2 pr-1 pl-4 [writing-mode:vertical-rl]">
                    詳細計算
                  </th>
                ) : (
                  <></>
                )}
                <CustomStatus
                  status={pokemonStatus[s.statusName]}
                  statusName={s.statusName}
                  level={level}
                  threeStats={{
                    individualValue: individualValue,
                    effortValue: effortValues[s.statusName],
                    natureCorrection: getSelectedNatureCorrection(s.statusName),
                  }}
                  goodStatusName={goodStatusName}
                  badStatusName={badStatusName}
                  onChangeNatureCorrection={onChangeNatureCorrection}
                  effortValue={effortValues[s.statusName]}
                  changeEffortValue={changeEffortValue}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default ActualStatus;
