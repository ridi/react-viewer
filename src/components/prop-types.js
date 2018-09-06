import PropTypes from 'prop-types';

export default PropTypes;

export const ContentType = PropTypes.shape({
  index: PropTypes.number.isRequired,
  uri: PropTypes.string,
  content: PropTypes.string,
  isContentLoaded: PropTypes.bool.isRequired,
  isContentOnError: PropTypes.bool.isRequired,
});

export const ContentCalculationsType = PropTypes.shape({
  index: PropTypes.number.isRequired,
  total: PropTypes.number,
  isCalculated: PropTypes.bool.isRequired,
});

export const FooterCalculationsType = PropTypes.shape({
  total: PropTypes.number,
  isCalculated: PropTypes.bool.isRequired,
});

export const CurrentType = PropTypes.shape({
  contentIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  position: PropTypes.number,
  offset: PropTypes.number.isRequired,
});

export const SettingType = PropTypes.shape({
  colorTheme: PropTypes.string.isRequired,
  font: PropTypes.string.isRequired,
  fontSizeInPx: PropTypes.number.isRequired,
  contentPaddingInPercent: PropTypes.number.isRequired,
  contentWidthInPercent: PropTypes.number.isRequired,
  lineHeightInEm: PropTypes.number.isRequired,
  viewType: PropTypes.string.isRequired,
  columnsInPage: PropTypes.number.isRequired,
  columnGapInPercent: PropTypes.number.isRequired,
  startWithBlankPage: PropTypes.number,
  maxWidth: PropTypes.number,
  containerHorizontalMargin: PropTypes.number,
  containerVerticalMargin: PropTypes.number,
});
