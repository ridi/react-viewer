import PropTypes from 'prop-types';

export default PropTypes;

export const ContentType = PropTypes.shape({
  index: PropTypes.number.isRequired,
  uri: PropTypes.string.isRequired,
  isContentLoaded: PropTypes.bool.isRequired,
  isContentOnError: PropTypes.bool.isRequired,
  content: PropTypes.string,
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
  fontSizeLevel: PropTypes.number.isRequired,
  paddingLevel: PropTypes.number.isRequired,
  contentWidthLevel: PropTypes.number.isRequired,
  lineHeightLevel: PropTypes.number.isRequired,
  viewType: PropTypes.string.isRequired,
  columnsInPage: PropTypes.number.isRequired,
  columnGap: PropTypes.number.isRequired,
});
