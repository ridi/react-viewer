import * as React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Loading, EpubReader, EpubProvider, ViewType } from '@ridi/react-reader';

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

const App: React.FunctionComponent = () => (
  <EpubProvider settingState={initialSettingState}>
    <Header />
    <EpubReader />
    <Footer />
    <Loading />
  </EpubProvider>
);

export default App;
