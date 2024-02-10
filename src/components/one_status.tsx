import { useEffect, useState } from 'react';
import { calcHp, calcStatus } from './util/pokemon_util';
import { PokemonStatus, ThreeStats } from './util/type';

type Params = {
  status: number;
  statusName: keyof PokemonStatus;
  level: number;
  threeStats: ThreeStats;
};

const OneStatus = ({ status, statusName, level, threeStats }: Params): React.ReactElement => {
  const [beginAnim1, setBeginAnim1] = useState<boolean>(false);
  const [beginAnim2, setBeginAnim2] = useState<boolean>(false);
  const [beginAnim3, setBeginAnim3] = useState<boolean>(false);

  const value = calc(status, statusName, level, threeStats);
  const nums = splitValue(value);

  useEffect(() => {
    if (beginAnim1 || beginAnim2 || beginAnim3) return;
    setBeginAnim1(false);
    setTimeout(() => {
      setBeginAnim1(true);
    }, 100);
    setBeginAnim2(false);
    setTimeout(() => {
      setBeginAnim2(true);
    }, 150);
    setBeginAnim3(false);
    setTimeout(() => {
      setBeginAnim3(true);
    }, 200);
  }, [value]);

  return (
    <td className="py-2 px-1 text-right">
      <div
        className={`relative h-[1.6em] w-[2.5em] after:transition-[all] after:ease-in after:delay-0 after:duration-200 after:content-[''] after:inline-block after:h-full after:w-full${
          beginAnim1 || beginAnim2 || beginAnim3 ? ' after:bg-amber-500 after:blur-lg' : ''
        }`}
      >
        <span
          onTransitionEnd={() => setBeginAnim1(false)}
          className={`absolute top-0 left-0 z-20 transition-[all] ease-in delay-0 duration-100${
            beginAnim1 ? ' top-[-0.7em]' : ''
          }`}
        >
          {nums[0]}
        </span>
        <span
          onTransitionEnd={() => setBeginAnim2(false)}
          className={`absolute top-0 left-[0.5em] z-20 transition-[all] ease-in delay-0 duration-100${
            beginAnim2 ? ' top-[-0.7em]' : ''
          }`}
        >
          {nums[1]}
        </span>
        <span
          onTransitionEnd={() => setBeginAnim3(false)}
          className={`absolute top-0 left-[1em] z-20 transition-[all] ease-in delay-0 duration-100${
            beginAnim3 ? ' top-[-0.7em]' : ''
          }`}
        >
          {nums[2]}
        </span>
      </div>
    </td>
  );
};

const calc = (
  status: number,
  statusName: keyof PokemonStatus,
  level: number,
  threeStats: ThreeStats,
): number => {
  if (statusName === 'hp') {
    return calcHp(status, level, threeStats);
  }
  return calcStatus(status, level, threeStats);
};

const splitValue = (value: number): Array<string> => {
  const nums: Array<string> = [];

  let current = value;
  if (value >= 100) {
    nums.push(String(Math.floor(current / 100)));
    current = current % 100;
  } else {
    nums.push('');
  }
  if (value >= 10) {
    nums.push(String(Math.floor(current / 10)));
    current = current % 10;
  } else {
    nums.push('');
  }
  nums.push(String(current));

  return nums;
};

export default OneStatus;
