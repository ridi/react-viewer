import * as React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Loading, EpubReader, EpubProvider, ViewType, PagingState } from '@ridi/react-reader';

const initialSettingState = {
  viewType: ViewType.PAGE12,
  fontSizeInEm: 1,
  lineHeightInEm: 1.67,
  contentPaddingInPercent: 5,
  columnGapInPercent: 5,
  maxWidth: 700,
  containerHorizontalMargin: 50,
  containerVerticalMargin: 60,
};

const initialPagingState: PagingState = {
  totalPage: 0,
  fullHeight: 0,
  fullWidth: 0,
  pageUnit: 0,
  currentPage: 1,
  currentSpineIndex: 1,
  currentPosition: 0,
  spines: [],
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
