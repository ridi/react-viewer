import * as React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Loading, EpubReader, EpubProvider, ViewType, SettingProperties, PagingProperties } from '@ridi/react-reader';

const initialSettingState = {
  [SettingProperties.VIEW_TYPE]: ViewType.PAGE1,
  // fontSizeInEm: 1,
  // lineHeightInEm: 1.67,
  // contentPaddingInPercent: 5,
  // columnGapInPercent: 5,
  // maxWidth: 700,
  [SettingProperties.CONTAINER_HORIZONTAL_MARGIN]: 50,
  [SettingProperties.CONTAINER_VERTICAL_MARGIN]: 60,
};

const initialPagingState = {
  [PagingProperties.CURRENT_SPINE_INDEX]: 1,
  [PagingProperties.CURRENT_POSITION]: 0,
};

const App: React.FunctionComponent = () => (
  <EpubProvider settingState={initialSettingState} pagingState={initialPagingState}>
    <Header />
    <EpubReader />
    <Footer />
    <Loading />
  </EpubProvider>
);

export default App;
