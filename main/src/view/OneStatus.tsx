import React, { useState } from 'react';
import {
  calcHp, calcStatus
} from '../util/PokemonUtil';
import { NatureCorrection, PokemonStatus, ThreeStats } from '../util/Types';

type Params = {
  status: number,
  statusName: keyof PokemonStatus,
  level: number,
  threeStats: ThreeStats
};

const OneStatus = ({ status, statusName, level, threeStats }: Params): JSX.Element => {
  return (
    <td className="main__td number">{
      calc(status, statusName, level, threeStats)
    }</td>
  );
};

const calc = (status: number, statusName: keyof PokemonStatus,
  level: number, threeStats: ThreeStats): number => {
  if (statusName === 'hp') {
    return calcHp(status, level, threeStats)
  }
  return calcStatus(status, level, threeStats);
};

export default OneStatus;
