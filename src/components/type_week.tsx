import { Scale } from './util/type';

type Params = {
  scale: Scale;
};

const TypeWeek = ({ scale }: Params): React.ReactElement => {
  return getType(scale);
};

const getType = (scale: Scale): React.ReactElement => {
  if (scale === 'ForTimes') return <div className="text-center text-red-600 h-[1.2em]">4</div>;
  if (scale === 'TwoTimes') return <div className="text-center text-red-600 h-[1.2em]">2</div>;
  return <div className="text-center h-[1.2em]"></div>;
};

export default TypeWeek;
