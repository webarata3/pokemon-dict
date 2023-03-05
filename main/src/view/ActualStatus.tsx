import React, { useState } from 'react';
import OneStatus from './OneStatus';
import { NatureCorrection, PokemonStatus, STATUS_LIST, ThreeStats } from '../util/Types';
import {
  getEffortValueLabel, getIndividualValueLabel, getNatureCorrectionLabel,
  getNatureCorrectionTitle,
  MAX_EFFORT_VALUE, MAX_INDIVIDUAL_VALUE
} from '../util/PokemonUtil';
import CustomStatus from './CustomStatus';

type Params = {
  pokemonStatus: PokemonStatus | null;
};

const threeStatsList: Array<ThreeStats> = [
  {
    individualValue: MAX_INDIVIDUAL_VALUE,
    effortValue: MAX_EFFORT_VALUE,
    natureCorrection: NatureCorrection.Good
  },
  {
    individualValue: MAX_INDIVIDUAL_VALUE,
    effortValue: 0,
    natureCorrection: NatureCorrection.Good
  },
  {
    individualValue: MAX_INDIVIDUAL_VALUE,
    effortValue: 0,
    natureCorrection: NatureCorrection.Normal
  }
];

const ActualStatus = ({ pokemonStatus }: Params): JSX.Element => {
  const [level, setLevel] = useState(50);
  const [individualValue, setIndividualValue] = useState<number>(MAX_INDIVIDUAL_VALUE);
  const [goodStatusName, setGoodStatusName] = useState<string>('attack');
  const [badStatusName, setBadStatusName] = useState<string>('defence');
  const [effortAll, setEffortAll] = useState<number>(0);
  const [effortValues, setEffortValues] = useState<PokemonStatus>({
    hp: 0, attack: 0, defence: 0, spAttack: 0, spDefence: 0, speed: 0
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
    setEffortAll(effortValues.hp + effortValues.attack + effortValues.defence
      + effortValues.spAttack + effortValues.spDefence + effortValues.speed);
  };

  const getSelectedNatureCorrection = (statusName: string): NatureCorrection => {
    if (statusName === goodStatusName) return NatureCorrection.Good;
    if (statusName === badStatusName) return NatureCorrection.Bad;
    return NatureCorrection.Normal;
  }

  const onClickLevel = (newLevel: number): void => setLevel(newLevel);

  return (
    <>
      {
        pokemonStatus === null ? <div>読込中</div>
          :
          <section className="pokemon__value">
            <h2 className="main__sub-title">実数値詳細</h2>
            <div>
              <label htmlFor="level" className="main__label">LV</label>
              <input type="number" id="level"
                onChange={onChangeLevel}
                className="main__input-level"
                value={level} />
              {
                [1, 5, 50, 100].map((value, index) =>
                  <button className="main__link-button" type="button" key={index}
                    onClick={() => onClickLevel(value)}>{value}</button>
                )
              }
            </div>
            <table>
              <thead>
                <tr>
                  <th className="main__th">個体値</th>
                  {
                    threeStatsList.map((threeStats, index) =>
                      <th className="main__th pokemon__label" key={index}>{
                        getIndividualValueLabel(threeStats.individualValue)}</th>)
                  }
                  <th rowSpan={3}></th>
                  <th className="main__th pokemon__label" colSpan={3}>
                    <input type="radio" id="individualValueMax" name="individualValue"
                      className="main__radio"
                      checked={individualValue === MAX_INDIVIDUAL_VALUE}
                      onChange={() => setIndividualValue(MAX_INDIVIDUAL_VALUE)} />
                    <label htmlFor="individualValueMax" className="main__radio-label">最大</label>
                    <input type="radio" id="individualValueMin" name="individualValue"
                      className="main__radio"
                      checked={individualValue === 0}
                      onChange={() => setIndividualValue(0)} />
                    <label htmlFor="individualValueMin" className="main__radio-label">0</label>
                  </th>
                  <th></th>
                </tr>
                <tr>
                  <th className="main__th">努力値</th>
                  {
                    threeStatsList.map((threeStats, index) =>
                      <th className="main__th pokemon__label"
                        key={index}>{getEffortValueLabel(threeStats.effortValue)}</th>)
                  }
                  <th colSpan={3}></th>
                  <th className="main__th main__th-left">努力値</th>
                </tr>
                <tr>
                  <th className="main__th">性格補正</th>
                  {
                    threeStatsList.map((threeStats, index) =>
                      <th className="main__th pokemon__label" key={index}>{
                        getNatureCorrectionLabel(threeStats.natureCorrection)}</th>)
                  }
                  <th className="main__th main__th-center main__th-nature-correction"
                    colSpan={3}>{getNatureCorrectionTitle(goodStatusName, badStatusName)}</th>
                  <th className="main__th main__th-left">{`残り: ${512 - effortAll}`}</th>
                </tr>
              </thead>
              <tbody>
                {
                  STATUS_LIST.map((s, index) => <tr key={index}>
                    <th className="main__th main__th-center">{s.label}</th>
                    {
                      threeStatsList.map((threeStats, i) =>
                        <OneStatus status={pokemonStatus[s.statusName]} statusName={s.statusName}
                          level={level} threeStats={threeStats} key={i} />)
                    }
                    {
                      index === 0 ?
                        <th rowSpan={6} className="main__th main__th-vertical">詳細計算</th> : <></>
                    }
                    <CustomStatus
                      status={pokemonStatus[s.statusName]} statusName={s.statusName} level={level}
                      threeStats={{
                        individualValue: individualValue,
                        effortValue: effortValues[s.statusName],
                        natureCorrection: getSelectedNatureCorrection(s.statusName)
                      }}
                      goodStatusName={goodStatusName} badStatusName={badStatusName}
                      onChangeNatureCorrection={onChangeNatureCorrection}
                      effortValue={effortValues[s.statusName]}
                      changeEffortValue={changeEffortValue}
                    />
                  </tr>)
                }
              </tbody>
            </table>
          </section>
      }
    </>
  );
};

export default ActualStatus;
