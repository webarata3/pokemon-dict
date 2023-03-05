import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon, PokemonStatus } from '../util/Types';
import { getPokemonId, getPokemonImgUrl, getPokemonUrl } from '../util/PokemonUtil';

type Params = {
  pokemon: Pokemon
};

const Evolution = ({ pokemon }: Params): JSX.Element => {
  const [evolutions, setEvolutions] = useState<Pokemon[]>([]);
  const [beginAnim, setBeginAnim] = useState<boolean>(false);

  useEffect(() => {
    readEvolutions(pokemon.evolution, setEvolutions);
  }, [pokemon]);

  useEffect(() => {
    setBeginAnim(false);
    setTimeout(() => {
      setBeginAnim(true);
    }, 1000);
  }, [evolutions]);

  const getHeaderImage = () => (
    evolutions.map((evo, index) =>
      <td key={index} className={`main__td${samePokemonId(pokemon, evo)
        ? ' main__td-selected main__td-selected-top'
        : ''}`}>
        <Link to={getPokemonUrl(evo.no, evo.form)}>
          <img src={getPokemonImgUrl(evo.no, evo.form)} alt={evo.name}
            className="pokemon__evolution-image" />
        </Link>
      </td>));

  const getHeaderName = () => (
    evolutions.map((evo, index) =>
      <td key={index} className={`main__td${samePokemonId(pokemon, evo)
        ? ' main__td-selected'
        : ''}`}>
        <div>{evo.name}</div>
        {
          evo.form === null
            ? <></>
            : <div className="main__form-name">{evo.formName}</div>
        }
      </td>));

  const getAllStatus = () => (
    [getStatus('HP', 'hp', '1'),
    getStatus('こうげき', 'attack', '2'),
    getStatus('ぼうぎょ', 'defence', '3'),
    getStatus('とくこう', 'spAttack', '4'),
    getStatus('とくぼう', 'spDefence', '5'),
    getStatus('すばやさ', 'speed', '6')]
  );

  const getStatus =
    (title: string, statusName: keyof PokemonStatus, styleNo: string) => (
      <tr key={styleNo}>
        <th className="main__th main__th-center main__th-nowrap">{title}</th>
        {
          evolutions.map((evo, index) => (
            <td className={`main__td main__td-status${samePokemonId(pokemon, evo) ? ' main__td-selected' : ''
              }${samePokemonId(pokemon, evo) && styleNo === '6'
                ? ' main__td-selected-bottom' : ''}`} key={index}>
              <div className="main__td-status-value">{evo.status[statusName]}</div>
              <div
                style={beginAnim ? {
                  width: getStatusBarWidth(evo.status[statusName])
                } : {}}
                className={'main__td-status-bar' + (
                  beginAnim ? ` main__td-status-bar-anim${styleNo}` : '')}></div>
            </td>
          ))
        }
      </tr>
    );

  return (
    <section className="pokemon__evolution">
      <h2 className="main__sub-title">進化と種族値</h2>
      <div className="pokemon__evolution-table">
        <table className="main__table">
          <thead>
            <tr>
              <th className="main__th"></th>
              {getHeaderImage()}
            </tr>
            <tr>
              <th className="main__th"></th>
              {getHeaderName()}
            </tr>
          </thead>
          <tbody>
            {getAllStatus()}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const samePokemonId = (pokemon1: Pokemon, pokemon2: Pokemon): boolean =>
  getPokemonId(pokemon1.no, pokemon1.form) ===
  getPokemonId(pokemon2.no, pokemon2.form)

const getStatusBarWidth = (value: number): string => {
  const num = Math.floor(value * 2 / 3);
  const width = num > 100 ? 100 : num;
  return `${width}px`;
};

const readEvolutions = (pokemonIds: string[], setEvolutions: React.Dispatch<React.SetStateAction<Pokemon[]>>) => {
  Promise.all(pokemonIds.map(item => fetchPokemon(item)))
    .then(values => Promise.all(values.map(value => value.json())))
    .then(jsons => setEvolutions(jsons))
    .catch(e => console.log(e));
};

const fetchPokemon = (id: string): Promise<Response> => {
  return fetch(`api/pokemon/${id}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default Evolution;
