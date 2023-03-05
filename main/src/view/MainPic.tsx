import PokemonHeader from './PokemonHeader';
import { Pokemon, PokemonToc } from '../util/Types';
import { getPokemonImgUrl } from '../util/PokemonUtil';

type Params = {
  pokemon: Pokemon,
  pokemonTocs: PokemonToc[]
};

const MainPic = ({ pokemon, pokemonTocs }: Params): JSX.Element => {
  return (
    <section className="pokemon__info">
      <PokemonHeader pokemon={pokemon} pokemonTocs={pokemonTocs} />
      <div className="main__pic">
        <img src={getPokemonImgUrl(pokemon!.no ?? 0, pokemon!.form)}
          alt={pokemon!.name} className="main__pic-image" />
      </div>
    </section>
  );
}

export default MainPic;
