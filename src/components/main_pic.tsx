'use client';

import Image from 'next/image';
import React from 'react';
import PokemonHeader from './pokemon_header';
import { getPokemonImgUrl } from './util/pokemon_util';
import { Pokemon, PokemonToc } from './util/type';

type Props = {
  pokemon: Pokemon;
  beforePokemon: PokemonToc | null;
  afterPokemon: PokemonToc | null;
};

const MainPic = ({ pokemon, beforePokemon, afterPokemon }: Props): React.ReactElement => {
  return (
    <section className="p-2 col-start-2 col-end-3 row-start-1 row-end-3">
      <PokemonHeader pokemon={pokemon} beforePokemon={beforePokemon} afterPokemon={afterPokemon} />
      <div className="text-center">
        <Image
          src={getPokemonImgUrl(pokemon!.no ?? 0, pokemon!.form)}
          alt={pokemon!.name}
          width={570}
          height={570}
          className="inline-block w-[300px] h-[300px]"
        />
      </div>
    </section>
  );
};
export default MainPic;
