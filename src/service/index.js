import ContentService from './ContentService';
import EventBus from '../event/EventBus';
import { LOADED, UNLOADED } from '../event/CoreEvents';
import CalculationService from './CalculationService';

const services = [
  ContentService,
  CalculationService,
];

export const unloadAll = () => {
  services.forEach(service => service.beforeUnloaded());
  services.forEach(service => service.unload());

  EventBus.emit(UNLOADED);
};

export const loadAll = () => {
  services.forEach(service => service.load());
  services.forEach(service => service.afterLoaded());
  window.addEventListener('beforeunload', unloadAll);

  EventBus.emit(LOADED);
};

export default {
  loadAll,
  unloadAll,
};
