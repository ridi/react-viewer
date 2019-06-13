import * as React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Loading, EpubReader, EpubContextProvider } from '@ridi/react-viewer';

const App: React.FunctionComponent = () => (
  <EpubContextProvider>
    <Header />
    <EpubReader />
    <Footer />
    <Loading />
  </EpubContextProvider>
);

export default App;
