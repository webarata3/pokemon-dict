import { Scale } from './util/type';

type Params = {
  scale: Scale;
};

const TypeStrong = ({ scale }: Params): React.ReactElement => {
  return getType(scale);
};

const getType = (scale: Scale): React.ReactElement => {
  if (scale === 'Zero') return <div className="text-center text-blue-600 h-[1.2em]">0</div>;
  if (scale === 'Quarter') return <div className="text-center text-blue-600 h-[1.2em]">¼</div>;
  if (scale === 'Half') return <div className="text-center text-blue-600 h-[1.2em]">½</div>;
  return <div className="text-center h-[1.2em]"></div>;
};

export default TypeStrong;
