import { Scale } from "../util/Types";

type Params = {
  scale: Scale
};

const TypeWeek = ({ scale }: Params): JSX.Element => {
  return getType(scale);
};

const getType = (scale: Scale): JSX.Element => {
  if (scale === 'ForTimes') return (
    <div className="type__times type__week">4</div>
  );
  if (scale === 'TwoTimes') return (
    <div className="type__times type__week">2</div>
  );
  return <div className="type__times"></div>
};

export default TypeWeek;
