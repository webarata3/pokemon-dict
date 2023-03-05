import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getPokemonImgUrl } from '../util/PokemonUtil';
import { PokemonToc, Region } from '../util/Types';
import { asyncFetchGet } from '../util/AjaxUtil';
import { normalizeKana } from '../util/StringUtil';

type Params = {
  pokemonTocs: PokemonToc[] | null,
  no: number | null,
  form: string | null
};

const Toc = ({ pokemonTocs, no, form }: Params): JSX.Element => {
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [regionChecks, setRegionChecks] = useState<boolean[]>([]);
  const selectedPokemonElm = useRef<HTMLAnchorElement | null>(null);
  const [selectedPokemonTocs, setSelectedPokemonTocs] = useState<PokemonToc[]>([]);
  const [searchName, setSearchName] = useState<string>('');

  const viewPokemon = (pokemonToc: PokemonToc): JSX.Element =>
    <Link to={getPokemonUrl(pokemonToc)} key={getPokemonUrl(pokemonToc)}
      className={`toc__link${isSelected(pokemonToc, no, form) ? ' toc__selected' : ''}`}
      ref={isSelected(pokemonToc, no, form) ? selectedPokemonElm : null}>
      <img src={getPokemonImgUrl(pokemonToc.no, pokemonToc.form)}
        alt={pokemonToc.name} loading="lazy" className="pokemon__link" />
    </Link>;

  const onChangeRegion = (index: number) => {
    const newChecks = [...regionChecks];
    newChecks[index] = !regionChecks[index];
    setRegionChecks(newChecks);
  };

  const onChangeSearchName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;
    setSearchName(name);
    const kanaName = normalizeKana(name);

    if (pokemonTocs === null) return;
    const selectedPokemon = pokemonTocs.filter(toc => toc.name.indexOf(kanaName) >= 0);
    setSelectedPokemonTocs(selectedPokemon);
  };

  const viewRegions = (): JSX.Element =>
    <details className="main__details">
      <summary className="main__summary">地方選択</summary>
      <div className="main__region">
        {
          regions!.map((region, index) => (
            <div key={index}>
              <input type="checkbox" id={`region${index}`}
                className="main__checkbox"
                checked={regionChecks[index] ?? true}
                onChange={() => onChangeRegion(index)} />
              <label htmlFor={`region${index}`}
                className="main__checkbox-label">
                {region.regionName}
              </label>
            </div>
          ))
        }
      </div>
    </details>

  useEffect(() => {
    readRegions(setRegions);
  }, []);

  useEffect(() => {
    if (regions === null) return;
    setRegionChecks(Array(regions.length).fill(true));
  }, [regions]);

  useEffect(() => {
    selectedPokemonElm?.current?.scrollIntoView(true);
  }, [no, form]);

  useEffect(() => {
    if (pokemonTocs === null) return;
    const selectedPokemon = pokemonTocs.filter(toc => regionChecks[toc.regionId - 1]);
    setSelectedPokemonTocs(selectedPokemon);
  }, [regionChecks, pokemonTocs]);

  return (
    <>
      {
        pokemonTocs === null || regions === null
          ? <div>読込中</div>
          : <div className="pokemon__search">
            <img src="image/zukan.webp" alt="図鑑のイメージ" />
            {viewRegions()}
            <div className="pokemon__search-input">
              <input type="text" placeholder="ポケモンの名前で検索"
                className="pokemon__input"
                value={searchName} onChange={onChangeSearchName} />
            </div>
            <div className="pokemon__list">
              {selectedPokemonTocs.map(pokemonToc => viewPokemon(pokemonToc))}
            </div>
          </div>
      }
    </>
  );
}

const isSelected = (pokemonToc: PokemonToc, no: number | null,
  form: string | null): boolean => {
  return pokemonToc.no === no && pokemonToc.form === form;
}

const getPokemonUrl = (pokemonToc: PokemonToc): string =>
  `?no=${pokemonToc.no}${pokemonToc.form === null ? '' : '&form=' + pokemonToc.form}`;

const readRegions = (setRegions: React.Dispatch<React.SetStateAction<Region[] | null>>) => {
  asyncFetchGet<Region[]>('api/regions.json', json => {
    setRegions(json);
  }, e => {
    console.log(e);
  });
};

export default Toc;
