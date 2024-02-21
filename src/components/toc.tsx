'use client';

import { PokemonToc, Region } from '@/components/util/type';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { getPublicPath } from './util/get-public-path';
import { getPokemonImgUrl } from './util/pokemon_util';
import { normalizeKana } from './util/string_util';

type Props = {
  pokemonTocs: PokemonToc[];
  regions: Region[];
  no: number | null;
  form: string | null;
};

const Toc = ({ pokemonTocs, regions, no, form }: Props): React.ReactElement => {
  const [regionChecks, setRegionChecks] = useState<boolean[]>(Array(regions.length).fill(true));
  const selectedPokemonElm = useRef<HTMLAnchorElement | null>(null);
  const [selectedPokemonTocs, setSelectedPokemonTocs] = useState<PokemonToc[]>(pokemonTocs);
  const [searchName, setSearchName] = useState<string>('');

  const viewPokemon = (pokemonToc: PokemonToc): React.ReactElement => (
    <Link
      href={getPokemonUrl(pokemonToc)}
      key={getPokemonUrl(pokemonToc)}
      className={`inline-block transition hover:scale-150${
        isSelected(pokemonToc, no, form) ? ' border border-sky-500 bg-sky-100 rounded-[50%]' : ''
      }`}
      ref={isSelected(pokemonToc, no, form) ? selectedPokemonElm : null}
    >
      <Image
        src={getPokemonImgUrl(pokemonToc.no, pokemonToc.form)}
        alt={pokemonToc.name}
        width={90}
        height={90}
      />
    </Link>
  );

  const onChangeRegion = (index: number) => {
    const newChecks = [...regionChecks];
    newChecks[index] = !regionChecks[index];
    setRegionChecks(newChecks);

    search(newChecks, searchName);
  };

  const search = (regionChecks: Array<boolean>, name: string) => {
    const regionIds: Array<number> = [];
    for (let i = 0; i < regionChecks.length; i++) {
      if (regionChecks[i]) {
        regionIds.push(regions[i].regionId);
      }
    }
    const kanaName = normalizeKana(name);
    const selectedPokemon = pokemonTocs
      .filter((toc) => (regionIds ?? regions.map((v) => v.regionId)).includes(toc.regionId))
      .filter((toc) => toc.name.indexOf(kanaName) >= 0);
    setSelectedPokemonTocs(selectedPokemon);
  };

  const onChangeSearchName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;
    setSearchName(name);
    search(regionChecks, name);
  };

  const viewRegions = (): React.ReactElement => (
    <details className="mx-2 mb-2">
      <summary className="mb-2">地方選択</summary>
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {regions.map((region, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`region${index}`}
              className="main__checkbox"
              checked={regionChecks[index] ?? true}
              onChange={() => onChangeRegion(index)}
            />
            <label htmlFor={`region${index}`} className="main__checkbox-label">
              {region.regionName}
            </label>
          </div>
        ))}
      </div>
    </details>
  );

  useEffect(() => {
    selectedPokemonElm?.current?.scrollIntoView(true);
  }, [no, form]);

  return (
    <div className="m-0 col-start-1 col-end-2 row-start-1 row-end-4 flex flex-col border border-nutral-300">
      <Link href="/">
        <Image
          src={`${getPublicPath('/image/zukan.webp')}`}
          alt="図鑑のイメージ"
          width={364}
          height={233}
        />
      </Link>
      {viewRegions()}
      <div className="pokemon__search-input">
        <input
          type="text"
          placeholder="ポケモンの名前で検索"
          className="border border-slate-200 mx-1"
          value={searchName}
          onChange={onChangeSearchName}
        />
      </div>
      <div className="flex flex-wrap overflow-x-hidden overflow-y-scroll">
        {selectedPokemonTocs.map((pokemonToc) => viewPokemon(pokemonToc))}
      </div>
    </div>
  );
};

const isSelected = (pokemonToc: PokemonToc, no: number | null, form: string | null): boolean => {
  return pokemonToc.no === no && pokemonToc.form === form;
};

const getPokemonUrl = (pokemonToc: PokemonToc): string =>
  `/${String(pokemonToc.no).padStart(4, '0')}${
    pokemonToc.form === null ? '' : '/' + pokemonToc.form
  }`;

export default Toc;
