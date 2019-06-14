import * as React from 'react';
import Footer from './Footer';
import Header from './Header';
import { Loading, EpubReader, EpubProvider } from '@ridi/react-reader';

const App: React.FunctionComponent = () => (
  <EpubProvider>
    <Header />
    <EpubReader />
    <Footer />
    <Loading />
  </EpubProvider>
);

export default App;
