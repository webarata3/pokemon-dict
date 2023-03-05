import { Scale } from "../util/Types";

type Params = {
  scale: Scale
};

const TypeStrong = ({ scale }: Params): JSX.Element => {
  return getType(scale);
};

const getType = (scale: Scale): JSX.Element => {
  if (scale === 'Zero') return (
    <div className="type__times type__strong">0</div>
  );
  if (scale === 'Quarter') return (
    <div className="type__times type__strong">¼</div>
  );
  if (scale === 'Half') return (
    <div className="type__times type__strong">½</div>
  );
  return <div className="type__times"></div>
};

export default TypeStrong;
