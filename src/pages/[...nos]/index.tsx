'use client';

import '@/app/globals.css';
import Main from '@/components/main';
import Toc from '@/components/toc';
import { getPokemonId } from '@/components/util/pokemon_util';
import { Pokemon, PokemonToc, Region } from '@/components/util/type';
import { promises as fs } from 'fs';
import { Kosugi_Maru } from 'next/font/google';

const kosugiMaru = Kosugi_Maru({
  weight: ['400'],
  subsets: ['latin'],
});

type Param = {
  pokemonTocs: PokemonToc[];
  regions: Region[];
  nos: string[];
  pokemon: Pokemon;
  beforePokemon: PokemonToc | null;
  afterPokemon: PokemonToc | null;
  evolutions: Pokemon[];
};

export const getStaticPaths = async () => {
  const file1 = await fs.readFile(process.cwd() + '/api/pokemon-list.json', 'utf8');
  const pokemonTocs: PokemonToc[] = JSON.parse(file1);

  const params = pokemonTocs.map((toc) => {
    const nos = [String(toc.no).padStart(4, '0')];
    if (toc.form !== null) {
      nos.push(toc.form);
    }
    return {
      params: { nos: nos },
    };
  });
  return {
    paths: params,
    fallback: false,
  };
};

export const getStaticProps = async (paths: { params: { nos: string[] } }) => {
  const file1 = await fs.readFile(process.cwd() + '/api/pokemon-list.json', 'utf8');
  const pokemonTocs: PokemonToc[] = JSON.parse(file1);

  const file2 = await fs.readFile(process.cwd() + '/api/regions.json', 'utf8');
  const regions: Region[] = JSON.parse(file2);

  const no = parseInt(paths.params.nos[0]);
  const form = paths.params.nos.length === 1 ? null : paths.params.nos[1];

  const file3 = await fs.readFile(
    process.cwd() + `/api/pokemon/${getPokemonId(no, form)}.json`,
    'utf8',
  );
  const pokemon: Pokemon = JSON.parse(file3);

  let index = -1;
  for (let i = 0; i < pokemonTocs.length; i++) {
    const toc = pokemonTocs[i];
    if (toc.no === no && toc.form === form) {
      index = i;
      break;
    }
  }
  const beforePokemon = index <= 0 ? null : pokemonTocs[index - 1];
  const afterPokemon = index >= pokemonTocs.length - 1 ? null : pokemonTocs[index + 1];

  const evolutions: Pokemon[] = [];
  for (const evo of pokemon.evolution) {
    const file4 = await fs.readFile(process.cwd() + `/api/pokemon/${evo}.json`, 'utf8');
    evolutions.push(JSON.parse(file4));
  }

  return {
    props: {
      pokemonTocs: pokemonTocs,
      regions: regions,
      nos: paths.params.nos,
      pokemon: pokemon,
      beforePokemon: beforePokemon,
      afterPokemon: afterPokemon,
      evolutions: evolutions,
    },
  };
};

const Home = ({
  pokemonTocs,
  regions,
  nos,
  pokemon,
  beforePokemon,
  afterPokemon,
  evolutions,
}: Param) => {
  return (
    <main
      className={`grid grid-cols-[290px_500px_600px] grid-rows-[160px_240px_440px] gap-2 ${kosugiMaru.className}`}
    >
      <Toc
        pokemonTocs={pokemonTocs}
        regions={regions}
        no={parseInt(nos[0])}
        form={nos.length == 1 ? null : nos[1]}
      />
      <Main
        pokemon={pokemon}
        beforePokemon={beforePokemon}
        afterPokemon={afterPokemon}
        evolutions={evolutions}
      />
    </main>
  );
};

export default Home;
