import { PokemonStatus } from './util/type';

type Params = {
  values: number[];
  statusName: keyof PokemonStatus;
  callback: (value: number, statusName: keyof PokemonStatus) => void;
};

const EffortValueButtons = ({ values, statusName, callback }: Params): React.ReactElement => {
  return (
    <>
      {values.map((value) => (
        <button
          type="button"
          className="button-link"
          key={value}
          onClick={() => callback(value, statusName)}
        >
          {value}
        </button>
      ))}
    </>
  );
};

export default EffortValueButtons;
