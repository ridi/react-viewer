import * as React from 'react';
import Footer from './Footer';
import Header from './Header';
import {
  Loading,
  EpubReader,
  EpubProvider,
  ViewType,
  EpubSettingProperties,
  EpubPagingProperties,
} from '@ridi/react-reader';

const initialSettingState = {
  [EpubSettingProperties.VIEW_TYPE]: ViewType.PAGE1,
  [EpubSettingProperties.CONTAINER_HORIZONTAL_MARGIN]: 50,
  [EpubSettingProperties.CONTAINER_VERTICAL_MARGIN]: 60,
};

const initialPagingState = {
  [EpubPagingProperties.CURRENT_SPINE_INDEX]: 1,
  [EpubPagingProperties.CURRENT_POSITION]: 0,
};

const App: React.FunctionComponent = () => (
  <EpubProvider settingState={initialSettingState} pagingState={initialPagingState}>
    <Header/>
    <EpubReader/>
    <Footer/>
    <Loading/>
  </EpubProvider>
);

export default App;
