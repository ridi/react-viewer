import * as React from 'react';
import Footer from './Footer';
import Loading from './reader/components/Loading';
import Header from './Header';
import { EpubReader } from './reader';
import { EpubContextProvider } from './reader/contexts';

const App: React.FunctionComponent = () => (
  <EpubContextProvider>
    <Header />
    <EpubReader />
    <Footer />
    <Loading />
  </EpubContextProvider>
);

export default App;
