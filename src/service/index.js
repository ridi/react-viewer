import ContentService from './ContentService';
import EventBus, { Events } from '../event';
import CalculationService from './CalculationService';

const services = [
  ContentService,
  CalculationService,
];

export const unloadAll = () => {
  services.forEach(service => service.beforeUnloaded());
  services.forEach(service => service.unload());

  EventBus.emit(Events.core.UNLOADED);
};

export const loadAll = () => {
  services.forEach(service => service.load());
  services.forEach(service => service.afterLoaded());
  window.addEventListener('beforeunload', unloadAll);

  EventBus.emit(Events.core.LOADED);
};

export default {
  loadAll,
  unloadAll,
};
