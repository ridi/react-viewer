import * as React from 'react';
import {
  EpubCalculationProperties,
  EpubProvider,
  EpubReader,
  EpubSettingProperties,
  ViewType,
  ComicReader,
  ComicProvider,
} from '@ridi/react-reader';
import { TYPE } from './constants';
import TypeSwitch from './TypeSwitch';
import ComicHeader from './comic/ComicHeader';
import EpubHeader from './epub/EpubHeader';
import EpubFooter from './epub/EpubFooter';
import ComicFooter from './comic/ComicFooter';
import { ComicLoading, EpubLoading } from './Loading/index';

const initialSettingState = {
  [EpubSettingProperties.VIEW_TYPE]: ViewType.PAGE1,
  [EpubSettingProperties.CONTAINER_HORIZONTAL_MARGIN]: 50,
  [EpubSettingProperties.CONTAINER_VERTICAL_MARGIN]: 60,
};

const initialPagingState = {
  [EpubCalculationProperties.CURRENT_SPINE_INDEX]: 0,
  [EpubCalculationProperties.CURRENT_POSITION]: 0,
};

const App: React.FunctionComponent = () => {
  const [type, setType] = React.useState(TYPE.EPUB);

  return (
    <>
      <TypeSwitch type={type} onTypeChanged={setType}/>
      {type === TYPE.EPUB &&
        <EpubProvider settingState={initialSettingState} pagingState={initialPagingState}>
          <EpubHeader/>
          <EpubReader/>
          <EpubFooter/>
          <EpubLoading/>
        </EpubProvider>
      }
      {type === TYPE.COMIC &&
        <ComicProvider>
          <ComicHeader/>
          <ComicReader/>
          <ComicFooter/>
          <ComicLoading/>
        </ComicProvider>
      }
    </>
  );
};

export default App;
