import React from 'react';
import PropTypes from 'prop-types';
import { isExist } from '../../util/Util';
import { ContentType } from '../prop-types';

export default class BaseContent extends React.PureComponent {
  static propTypes = {
    onContentMount: PropTypes.func,
    content: ContentType.isRequired,
  };

  static defaultProps = {
    onContentMount: null,
  };

  componentDidMount() {
    const { onContentMount, content } = this.props;
    if (isExist(onContentMount)) {
      onContentMount(content.index);
    }
  }
}
