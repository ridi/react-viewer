import React from 'react';
import ViewerScreen from '../../../../lib';
import Loading from '../loadings/Loading';


const ViewerDummyBody = () => (
  <ViewerScreen fontDomain="resources/fonts/">
    <Loading />
  </ViewerScreen>
);

export default ViewerDummyBody;
