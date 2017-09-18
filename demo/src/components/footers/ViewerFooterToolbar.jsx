import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from '../links/ExternalLink';
import SvgIcons from '../icons/SvgIcons';


const ViewerFooterToolbar = props => (
  <div className="viewer_footer_toolbar">
    <div className="viewer_footer_toolbar_title">{props.title}</div>
    <div className="viewer_footer_button_wrapper">
      <ExternalLink
        className={`viewer_footer_button ${(props.isPrevEpisodeAvailable) ? '' : 'disabled'}`}
        to={props.prevEpisodeUrl}
      >
        <SvgIcons
          svgName="svg_arrow_4_left"
          svgClass="viewer_footer_button_arrow left"
        />
        <span className="viewer_footer_button_title"> 이전 편</span>
      </ExternalLink>
      <ExternalLink
        className={`viewer_footer_button ${(props.isNextEpisodeAvailable) ? '' : 'disabled'}`}
        to={props.nextEpisodeUrl}
      >
        <span className="viewer_footer_button_title">다음 편 </span>
        <SvgIcons
          svgName="svg_arrow_4_right"
          svgClass="viewer_footer_button_arrow right"
        />
      </ExternalLink>
    </div>
  </div>
);

ViewerFooterToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  isPrevEpisodeAvailable: PropTypes.bool.isRequired,
  prevEpisodeUrl: PropTypes.string.isRequired,
  isNextEpisodeAvailable: PropTypes.bool.isRequired,
  nextEpisodeUrl: PropTypes.string.isRequired,
};

export default ViewerFooterToolbar;
