import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getPokemonId, getPokemonImgUrl, getPokemonUrl } from './util/pokemon_util';
import { Pokemon, PokemonStatus } from './util/type';

type Params = {
  pokemon: Pokemon;
  evolutions: Pokemon[];
};

const Evolution = ({ pokemon, evolutions }: Params): React.ReactElement => {
  const [beginAnim, setBeginAnim] = useState<boolean>(false);

  useEffect(() => {
    setBeginAnim(false);
    setTimeout(() => {
      setBeginAnim(true);
    }, 100);
  }, [evolutions]);

  const getHeaderImage = () =>
    evolutions.map((evo, index) => (
      <td
        key={index}
        className={`py-2 px-1${
          samePokemonId(pokemon, evo) ? ' border-x-[3px] border-t-[3px] border-sky-500' : ''
        }`}
      >
        <Link href={getPokemonUrl(evo.no, evo.form)}>
          <Image
            src={getPokemonImgUrl(evo.no, evo.form)}
            alt={evo.name}
            width={100}
            height={100}
            className="min-w-[100px] h-[100px]"
          />
        </Link>
      </td>
    ));

  const getHeaderName = () =>
    evolutions.map((evo, index) => (
      <td
        key={index}
        className={`py-2 px-1${
          samePokemonId(pokemon, evo) ? ' border-x-[3px] border-sky-500' : ''
        }`}
      >
        <div>{evo.name}</div>
        {evo.form === null ? <></> : <div className="text-xs">{evo.formName}</div>}
      </td>
    ));

  const getAllStatus = () => [
    getStatus('HP', 'hp', 1),
    getStatus('こうげき', 'attack', 2),
    getStatus('ぼうぎょ', 'defence', 3),
    getStatus('とくこう', 'spAttack', 4),
    getStatus('とくぼう', 'spDefence', 5),
    getStatus('すばやさ', 'speed', 6),
  ];

  const classNameMap: Map<string, string> = new Map();
  classNameMap.set('1', 'hp');
  classNameMap.set('2', 'attack');
  classNameMap.set('3', 'defence');
  classNameMap.set('4', 'sp-attack');
  classNameMap.set('5', 'sp-defence');
  classNameMap.set('6', 'speed');

  const getStatus = (title: string, statusName: keyof PokemonStatus, styleNo: number) => (
    <tr key={styleNo}>
      <th className="py-2 px-1 text-center whitespace-nowrap sticky left-0 bg-white z-20">
        {title}
      </th>
      {evolutions.map((evo, index) => (
        <td
          className={`table-cell z-10 relative${
            samePokemonId(pokemon, evo) ? ' border-x-[3px] border-sky-500' : ''
          }${samePokemonId(pokemon, evo) && styleNo === 6 ? ' border-b-[3px] border-sky-500' : ''}`}
          key={index}
        >
          <div className="absolute z-20 w-[1.5em] top-[calc(50%_-_1.5em_/_2)] left-[calc(50px_-_1.5em_/_2)] text-right">
            {evo.status[statusName]}
          </div>
          <div
            style={
              beginAnim
                ? {
                    width: getStatusBarWidth(evo.status[statusName]),
                    backgroundColor: getColor(evo.status[statusName]),
                    animation: `slidein 0.8s forwards ${(index * 6 + styleNo) * 0.1 + 0.5}s`,
                  }
                : {}
            }
            className="absolute z-10 top-[calc(50%_-_1.2em_/_2)] h-[1.2em] opacity-60 scale-x-0 scale-y-100 origin-top-left"
          ></div>
        </td>
      ))}
    </tr>
  );

  return (
    <section className="p-2 w-[500px]">
      <h2 className="headline">進化と種族値</h2>
      <div className="w-[480px] overflow-x-scroll">
        <table className="border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="py-2 px-1 sticky left-0 bg-white z-20"></th>
              {getHeaderImage()}
            </tr>
            <tr>
              <th className="py-2 px-1 sticky left-0 bg-white z-20"></th>
              {getHeaderName()}
            </tr>
          </thead>
          <tbody>{getAllStatus()}</tbody>
        </table>
      </div>
    </section>
  );
};

const getColor = (value: number): string => {
  if (value > 150) value = 150;
  const h = Math.floor(150 - value);
  return `hsl(${h}deg 100% 70%)`;
};

const samePokemonId = (pokemon1: Pokemon, pokemon2: Pokemon): boolean =>
  getPokemonId(pokemon1.no, pokemon1.form) === getPokemonId(pokemon2.no, pokemon2.form);

const getStatusBarWidth = (value: number): string => {
  const num = Math.floor((value * 2) / 3);
  const width = num > 100 ? 100 : num;
  return `${width}px`;
};

export default Evolution;
