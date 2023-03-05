import React, { useState, useEffect } from 'react';
import MainPic from './MainPic';
import TypeCompatibility from './TypeCompatibility';
import Evolution from './Evolution';
import Ability from './Ability';
import ActualStatus from './ActualStatus';
import { Pokemon, PokemonToc } from '../util/Types';
import { asyncFetchGet } from '../util/AjaxUtil';
import { getPokemonId } from '../util/PokemonUtil';

type Params = {
  no: number | null,
  form: string | null,
  pokemonTocs: PokemonToc[] | null
};

const Main = ({ no, form, pokemonTocs }: Params): JSX.Element => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (no !== null) {
      readPokemon(no, form, setPokemon);
    } else {
      setPokemon(null);
    }
  }, [no, form]);

  return (
    <>
      {
        pokemonTocs === null || pokemon === null
          ? <div className="main__start-page">
            <h1 className="main__title">ポケモン図鑑</h1>
          </div>
          : <>
            <MainPic pokemon={pokemon} pokemonTocs={pokemonTocs} />
            <TypeCompatibility pokemonTypes={pokemon.type} />
            <Ability pokemonAbilities={pokemon.ability} />
            <Evolution pokemon={pokemon} />
            <ActualStatus pokemonStatus={pokemon.status} />
          </>
      }
    </>
  );
};

const readPokemon = (no: number, form: string | null,
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>) => {
  asyncFetchGet<Pokemon>(`api/pokemon/${getPokemonId(no, form)}.json`, json => {
    setPokemon(json);
  }, e => {
    console.log(e);
  });
};

export default Main;
