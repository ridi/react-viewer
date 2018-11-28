import content from './ContentService';
import calculation from './CalculationService';
import current from './CurrentService';

const services = [
  content,
  calculation,
  current,
];

export const unloadAll = () => {
  services.forEach(service => service.beforeUnloaded());
  services.forEach(service => service.unload());
};

export const loadAll = () => {
  services.forEach(service => service.load());
  services.forEach(service => service.afterLoaded());
  window.addEventListener('beforeunload', unloadAll);
};

export default {
  loadAll,
  unloadAll,
  content,
  calculation,
  current,
};
