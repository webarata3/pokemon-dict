import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Pokemon, PokemonToc } from '../util/Types';
import { getPokemonUrl, getPokemonImgUrl } from '../util/PokemonUtil';

type Params = {
  pokemon: Pokemon,
  pokemonTocs: PokemonToc[]
};

const PokemonHeader = ({ pokemon, pokemonTocs }: Params): JSX.Element => {
  const [beforePokemon, setBeforePokemon] = useState<PokemonToc | null>(null);
  const [afterPokemon, setAfterPokemon] = useState<PokemonToc | null>(null);

  useEffect(() => {
    const index = searchIndex(pokemon, pokemonTocs);
    if (index === 0) {
      setBeforePokemon(null);
    } else {
      setBeforePokemon(pokemonTocs[index - 1]);
    }
    if (index === pokemonTocs.length - 1) {
      setAfterPokemon(null);
    } else {
      setAfterPokemon(pokemonTocs[index + 1]);
    }
  }, [pokemon]);

  const arrowToc = (isLeft: boolean): JSX.Element => {
    const targetPokemon = isLeft ? beforePokemon : afterPokemon;
    const className = isLeft ? 'arrowLeft' : 'arrowRight';

    if (targetPokemon === null) return <div></div>;

    return (
      <div className={className}>
        <Link
          to={getPokemonUrl(targetPokemon.no, targetPokemon.form)}
          className="main__link-head">
          <img
            src={getPokemonImgUrl(targetPokemon.no, targetPokemon.form)}
            className="main__link-image" />
          <img
            src={isLeft ? 'image/arrow-left-long-solid.svg' : 'image/arrow-right-long-solid.svg'}
            className="main__link-image" />
        </Link>
      </div>
    )
  };

  return (
    <div className="pokemon__toc">
      {arrowToc(true)}
      <div className="pokemon__title">
        <h1 className="pokemon__name">{`no.${pokemon.no}`}</h1>
        <h1 className="pokemon__name">{pokemon.name}</h1>
        {
          pokemon.formName === null
            ? <></>
            : <>
              <div></div>
              <h1 className="pokemon__name">{pokemon.formName}</h1>
            </>
        }
      </div>
      {arrowToc(false)}
    </div>
  );
};

const searchIndex = (pokemon: Pokemon, pokemonTocs: PokemonToc[]): number => {
  for (let i = 0; i < pokemonTocs.length; i++) {
    if (pokemon.no === pokemonTocs[i].no
      && pokemon.form === pokemonTocs[i].form) {
      return i;
    }
  }
  return -1;
};

export default PokemonHeader;
