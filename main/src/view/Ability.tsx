import { PokemonAbility } from '../util/Types';

type Params = {
  pokemonAbilities: PokemonAbility[]
};

const Ability = ({ pokemonAbilities }: Params): JSX.Element => {

  return (
    <section className="abilities">
      <h2 className="main__sub-title">特性</h2>
      <div className="abilities__table">
        <table className="main__table">
          <tbody>
            {
              pokemonAbilities.map((ability, index) => <tr key={index}>
                <th className="main__th main__th-nowrap">{
                  (ability.hidden
                    ? <span className="hidden-ability">隠</span>
                    : <></>)
                }
                  <span>{ability.abilityName}</span>
                </th>
                <td className="main__td">{ability.abilityEffect}</td>
              </tr>)
            }
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Ability;
