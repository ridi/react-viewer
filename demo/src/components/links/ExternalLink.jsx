import React from 'react';
import PropTypes from 'prop-types';
import { redirect } from '../../../../src/util/CommonUi';


const ExternalLink = (props) => {
  const { to } = props;
  const restProps = Object.assign({}, props);
  delete restProps.to;

  return (
    <a
      role="button"
      tabIndex={0}
      onClick={() => {
        if (to === '') {
          return;
        }
        redirect(to);
      }}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          if (to === '') {
            return;
          }
          redirect(to);
        }
      }}
      {...restProps}
    >
      {props.children}
    </a>
  );
};


ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
};

ExternalLink.defaultProps = {
  children: null,
};

export default ExternalLink;
