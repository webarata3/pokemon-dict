import { PokemonAbility } from './util/type';

type Params = {
  pokemonAbilities: PokemonAbility[];
};

const Ability = ({ pokemonAbilities }: Params): React.ReactElement => {
  return (
    <section className="p-1">
      <h2 className="headline">特性</h2>
      <div className="max-h-[200px]">
        <table className="border-separate border-spacing-0">
          <tbody>
            {pokemonAbilities.map((ability, index) => (
              <tr key={index}>
                <th className="py-2 px-1 whitespace-nowrap text-center">
                  {ability.hidden ? (
                    <span className="p-1 bg-sky-500 text-white text-xs rounded-[50%]">隠</span>
                  ) : (
                    <></>
                  )}
                  <span>{ability.abilityName}</span>
                </th>
                <td className="py-2 px-1">{ability.abilityEffect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Ability;
