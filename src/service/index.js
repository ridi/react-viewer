import load from './LoadService';
import calculation from './CalculationService';
import current from './CurrentService';
import selection from './SelectionService';

const services = [
  load,
  calculation,
  current,
  selection,
];

export const unloadAll = () => {
  services.forEach(service => service.beforeUnloaded());
  services.forEach(service => service.unload());
};

export const loadAll = (restoreState) => {
  services.forEach(service => service.load(restoreState));
  services.forEach(service => service.afterLoaded(restoreState));
};

export default {
  loadAll,
  unloadAll,
  load,
  calculation,
  current,
  selection,
};
