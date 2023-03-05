import { PokemonStatus } from '../util/Types';

type Params = {
  values: number[],
  statusName: keyof PokemonStatus,
  callback: (value: number, statusName: keyof PokemonStatus) => void
};

const EffortValueButtons = ({ values, statusName, callback }: Params): JSX.Element => {
  return (
    <>
      {
        values.map(value =>
          <button type="button" className="main__link-button" key={value}
            onClick={() => callback(value, statusName)}>{value}</button>
        )
      }
    </>
  );
};

export default EffortValueButtons;
