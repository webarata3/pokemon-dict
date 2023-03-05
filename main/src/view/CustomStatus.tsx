import EffortValueButtons from './EffortValueButton';
import OneStatus from './OneStatus';
import { PokemonStatus, ThreeStats } from '../util/Types';

type Params = {
  status: number,
  statusName: keyof PokemonStatus,
  level: number,
  threeStats: ThreeStats,
  goodStatusName: string,
  badStatusName: string,
  onChangeNatureCorrection: (value: string, isGood: boolean) => void,
  effortValue: number,
  changeEffortValue: (value: number, statusName: keyof PokemonStatus) => void
};

const CustomStatus = ({ status, statusName, level, threeStats,
  goodStatusName, badStatusName, onChangeNatureCorrection,
  effortValue, changeEffortValue }: Params): JSX.Element => {

  const onChangeEffortValue = (value: string, statusName: keyof PokemonStatus) => {
    let parseValue = parseInt(value);
    changeEffortValue(parseValue, statusName);
  };

  const onClickEffortValue = (newEffortValue: number, statusName: keyof PokemonStatus): void =>
    changeEffortValue(newEffortValue, statusName);

  return (
    <>
      <OneStatus status={status} statusName={statusName}
        level={level} threeStats={threeStats} />
      {
        statusName === 'hp' ?
          <td className="main__td-center" colSpan={2}>性格</td>
          :
          <>
            <td className="main__td-center">
              <input type="radio" name="natureCorrectionGood" value={statusName}
                id={`good-${statusName}`} className="main__radio"
                checked={goodStatusName === statusName}
                onChange={e => onChangeNatureCorrection(e.target.value, true)}
                disabled={badStatusName === statusName} />
              <label htmlFor={`good-${statusName}`} className="main__radio-label">+</label>
            </td>
            <td className="main__td-center">
              <input type="radio" name="natureCorrectionBad" value={statusName}
                id={`bad-${statusName}`} className="main__radio"
                checked={badStatusName === statusName}
                onChange={e => onChangeNatureCorrection(e.target.value, false)}
                disabled={goodStatusName === statusName} />
              <label htmlFor={`bad-${statusName}`} className="main__radio-label">-</label>
            </td>
          </>
      }
      <td>
        <input type="number" className="main__input-effort-value"
          value={effortValue}
          onChange={(e) => onChangeEffortValue(e.target.value, statusName)}
          min={0} max={252} />
        <EffortValueButtons values={[252, 8, 0]} statusName={statusName}
          callback={onClickEffortValue} />
      </td>
    </>
  );
};

export default CustomStatus;
