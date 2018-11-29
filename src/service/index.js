import content from './ContentService';
import calculation from './CalculationService';
import current from './CurrentService';
import setting from './SettingService';

const services = [
  content,
  calculation,
  current,
  setting,
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
  setting,
};
