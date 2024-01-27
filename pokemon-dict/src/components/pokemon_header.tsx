import Image from 'next/image';
import Link from 'next/link';
import { getPokemonImgUrl, getPokemonUrl } from './util/pokemon_util';
import { Pokemon, PokemonToc } from './util/type';

type Params = {
  pokemon: Pokemon;
  beforePokemon: PokemonToc | null;
  afterPokemon: PokemonToc | null;
};

const PokemonHeader = ({ pokemon, beforePokemon, afterPokemon }: Params): React.ReactElement => {
  const arrowToc = (isLeft: boolean): React.ReactElement => {
    const targetPokemon = isLeft ? beforePokemon : afterPokemon;
    const className = isLeft ? 'text-left' : 'text-right';

    if (targetPokemon === null) return <div></div>;

    return (
      <div className={className}>
        <Link
          href={getPokemonUrl(targetPokemon.no, targetPokemon.form)}
          className="inline-block text-main border border-transparent hover:border-main rounded-[10px] group"
        >
          {isLeft && <span>◀</span>}
          <Image
            src={getPokemonImgUrl(targetPokemon.no, targetPokemon.form)}
            alt={''}
            className="inline-block w-[50px] h-[50px] group-hover:scale-150"
            width={50}
            height={50}
          />
          {!isLeft && <span>▶</span>}
        </Link>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[calc(50px_+_1.2em)_1fr_calc(50px_+_1.2em)] mx-auto items-center">
      {arrowToc(true)}
      <div className="headline-name mx-auto">
        <h1>{`No.${pokemon.no}`}</h1>
        <h1>{pokemon.name}</h1>
        {pokemon.formName === null ? (
          <></>
        ) : (
          <>
            <div></div>
            <h1>{pokemon.formName}</h1>
          </>
        )}
      </div>
      {arrowToc(false)}
    </div>
  );
};

export default PokemonHeader;
