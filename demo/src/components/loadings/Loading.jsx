import React from 'react';


const Loading = props => (
  <div className="loading_wrapper">
    <div className="cover_spinner js_cover_spinner active white_transparent_theme">
      <div className="bounce_spinner">
        <div className="bounce_ele double-bounce1" />
        <div className="bounce_ele double-bounce2" />
      </div>
    </div>
  </div>
);

export default Loading;
