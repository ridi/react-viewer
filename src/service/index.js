import load from './LoadService';
import calculation from './CalculationService';
import current from './CurrentService';

const services = [
  load,
  calculation,
  current,
];

export const unloadAll = () => {
  services.forEach(service => service.beforeUnloaded());
  services.forEach(service => service.unload());
};

export const loadAll = (restoreState) => {
  services.forEach(service => service.load(restoreState));
  services.forEach(service => service.afterLoaded(restoreState));
  window.addEventListener('beforeunload', unloadAll);
};

export default {
  loadAll,
  unloadAll,
  load,
  calculation,
  current,
};
