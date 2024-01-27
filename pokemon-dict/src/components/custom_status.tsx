import EffortValueButtons from './effort_value_button';
import OneStatus from './one_status';
import { PokemonStatus, ThreeStats } from './util/type';

type Params = {
  status: number;
  statusName: keyof PokemonStatus;
  level: number;
  threeStats: ThreeStats;
  goodStatusName: string;
  badStatusName: string;
  onChangeNatureCorrection: (value: string, isGood: boolean) => void;
  effortValue: number;
  changeEffortValue: (value: number, statusName: keyof PokemonStatus) => void;
};

const CustomStatus = ({
  status,
  statusName,
  level,
  threeStats,
  goodStatusName,
  badStatusName,
  onChangeNatureCorrection,
  effortValue,
  changeEffortValue,
}: Params): React.ReactElement => {
  const onChangeEffortValue = (value: string, statusName: keyof PokemonStatus) => {
    let parseValue = parseInt(value);
    changeEffortValue(parseValue, statusName);
  };

  const onClickEffortValue = (newEffortValue: number, statusName: keyof PokemonStatus): void =>
    changeEffortValue(newEffortValue, statusName);

  return (
    <>
      <OneStatus status={status} statusName={statusName} level={level} threeStats={threeStats} />
      {statusName === 'hp' ? (
        <td className="py-2 px-1 text-center" colSpan={2}>
          性格
        </td>
      ) : (
        <>
          <td className="py-2 px-1 text-center">
            <input
              type="radio"
              name="natureCorrectionGood"
              value={statusName}
              id={`good-${statusName}`}
              className="hidden peer"
              checked={goodStatusName === statusName}
              onChange={(e) => onChangeNatureCorrection(e.target.value, true)}
              disabled={badStatusName === statusName}
            />
            <label
              htmlFor={`good-${statusName}`}
              className="cursor-pointer border border-main text-main py-[2px] px-1 peer-checked:bg-main peer-checked:text-white"
            >
              +
            </label>
          </td>
          <td className="py-2 px-1 text-center">
            <input
              type="radio"
              name="natureCorrectionBad"
              value={statusName}
              id={`bad-${statusName}`}
              className="hidden peer"
              checked={badStatusName === statusName}
              onChange={(e) => onChangeNatureCorrection(e.target.value, false)}
              disabled={goodStatusName === statusName}
            />
            <label
              htmlFor={`bad-${statusName}`}
              className="cursor-pointer border border-main text-main py-[2px] px-1 peer-checked:bg-main peer-checked:text-white"
            >
              -
            </label>
          </td>
        </>
      )}
      <td>
        <input
          type="number"
          className="w-[4em] text-right"
          value={effortValue}
          onChange={(e) => onChangeEffortValue(e.target.value, statusName)}
          min={0}
          max={252}
        />
        <EffortValueButtons
          values={[252, 8, 0]}
          statusName={statusName}
          callback={onClickEffortValue}
        />
      </td>
    </>
  );
};

export default CustomStatus;
