import MoldInStore from './MoldInStore';
import RFIDStore from './RFIDStore';
import StepStore from './StepStore';
const stores = {
  RFIDStore: new RFIDStore(),
  StepStore: new StepStore(),
  MoldStore: new MoldInStore(),
};

export default stores;
