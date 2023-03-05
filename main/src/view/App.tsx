import React, { useState, useEffect } from 'react';
import {
  useSearchParams
} from "react-router-dom";
import Toc from './Toc';
import Main from './Main';
import { PokemonToc } from '../util/Types';
import { asyncFetchGet } from '../util/AjaxUtil';

const App = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const [pokemonTocs, setPokemonTocs] = useState<PokemonToc[] | null>(null);
  const [no, setNo] = useState<number | null>(null);
  const [form, setForm] = useState<string | null>(null);

  useEffect(() => {
    const tempNo = searchParams.get('no');
    setNo(tempNo === null ? null : parseInt(tempNo));
    setForm(searchParams.get('form'));
  }, [searchParams]);

  useEffect(() => {
    readPokemonTocs(setPokemonTocs);
  }, []);

  return (
    <main className="main">
      <Toc pokemonTocs={pokemonTocs} no={no} form={form} />
      <Main no={no} form={form} pokemonTocs={pokemonTocs} />
    </main>
  );
};

const readPokemonTocs = (setPokemonTocs: React.Dispatch<React.SetStateAction<PokemonToc[] | null>>) => {
  asyncFetchGet<PokemonToc[]>('api/pokemon-list.json', json => {
    setPokemonTocs(json);
  }, e => {
    console.log(e);
  });
};

export default App;
