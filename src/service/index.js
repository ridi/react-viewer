import ContentService from './ContentService';
import CalculationService from './CalculationService';

const services = [
  ContentService,
  CalculationService,
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
};
