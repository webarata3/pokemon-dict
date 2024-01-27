'use client';

import React from 'react';
import Ability from './ability';
import ActualStatus from './actual_status';
import Evolution from './evolution';
import MainPic from './main_pic';
import TypeCompatibility from './type_compatibility';
import { Pokemon, PokemonToc } from './util/type';

type Props = {
  pokemon: Pokemon;
  beforePokemon: PokemonToc | null;
  afterPokemon: PokemonToc | null;
  evolutions: Pokemon[];
};

const Main = ({ pokemon, beforePokemon, afterPokemon, evolutions }: Props): React.ReactElement => {
  return (
    <>
      <MainPic pokemon={pokemon} beforePokemon={beforePokemon} afterPokemon={afterPokemon} />
      <TypeCompatibility pokemonTypes={pokemon.type} />
      <Ability pokemonAbilities={pokemon.ability} />
      <Evolution pokemon={pokemon} evolutions={evolutions} />
      <ActualStatus pokemonStatus={pokemon.status} />
    </>
  );
};
export default Main;
