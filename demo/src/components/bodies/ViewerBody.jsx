import React from 'react';
import PropTypes from 'prop-types';
import ViewerScreen from '../../../../lib/index';
import ViewerScreenFooter from '../footers/ViewerScreenFooter';


const ViewerBody = ({ content, episode }) => (
  <ViewerScreen
    content={content}
    episode={episode}
    footer={<ViewerScreenFooter content={content} episode={episode} />}
    fontDomain="resources/fonts/"
  />
);

ViewerBody.propTypes = {
  content: PropTypes.object.isRequired,
  episode: PropTypes.object.isRequired,
};

export default ViewerBody;
