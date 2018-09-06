import styled from 'styled-components';
import Connector from '../../util/connector';
import PropTypes from '../prop-types';
import { PRE_CALCULATION } from '../../constants/CalculationsConstants';

const StyledBaseContent = styled.article`
  box-sizing: border-box;
  margin: ${() => `${Connector.setting.getContainerVerticalMargin(true)} ${Connector.setting.getContainerHorizontalMargin(true)}`};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')}
  
  width: ${() => Connector.setting.getContainerWidth(true)};
  height: ${() => Connector.setting.getContainerHeight(true)};
  
  .content_footer {
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    padding: 15px;
    height: ${() => `${Connector.setting.getContentFooterHeight(true)}`};
    small {
      font-size: 11px;
    }
  }
`;

const StyledHtmlContent = () => `
  @font-face {
    font-family: os_specific;
    font-style: normal;
    font-weight: 300;
    src: local(".SFNSText-Light"),
         local(".HelveticaNeueDeskInterface-Light"),
         local(".LucidaGrandeUI"),
         local("Ubuntu Light"),
         local("Segoe UI Light"),
         local("Roboto-Light"),
         local("DroidSans"),
         local("Tahoma");
  }

  font-size: ${Connector.setting.getFontSize(true)};
  line-height: ${Connector.setting.getLineHeight(true)};
  font-family: ${Connector.setting.getFont()};
  
  h1, h2, h3, h4, h5, h6, p, th, td, div, label, textarea, a, li, input, button, textarea, select, address {
    font-size: 1em;
    line-height: inherit;
    font-family: inherit;
    text-align: justify;
  }
  
  img {
    max-width: 100%;
  }
`;

const StyledImageContent = ({ visible }) => `
  img {
    display: block;
    transition: opacity 1s linear;
    opacity: ${visible ? '1' : '0'};
  }
`;

const StyledScrollContent = () => `
`;

const StyledPageContent = () => `
  vertical-align: top;
  white-space: initial;
  display: inline-block;
  overflow: hidden;
  
  .content_container {
    height: 100%;
    column-fill: auto;
    column-gap: ${Connector.setting.getColumnGap(true)};
    column-width: ${Connector.setting.getColumnWidth(true)};
  }
`;

export const StyledHtmlScrollContent = StyledBaseContent.extend`
  ${StyledHtmlContent}
  ${StyledScrollContent}

  position: absolute;
  top: ${({ startOffset }) => `${startOffset !== PRE_CALCULATION ? startOffset : -999}px`};
`;

export const StyledHtmlPageContent = StyledBaseContent.extend`
  ${StyledHtmlContent}
  ${StyledPageContent}
  
  .content_container {
    width: ${({ index }) => Connector.setting.getContentWidth(index, true)}
  }
`;

export const StyledImageScrollContent = StyledBaseContent.extend`
  ${StyledImageContent}
  ${StyledScrollContent}
  margin: 0 auto;
  .content_container {
    margin: 0 auto;
    width: ${() => Connector.setting.getContentWidth(1, true)};
    img {
      width: 100%;
    }
  }
`;

export const StyledImagePageContent = StyledBaseContent.extend`
  ${StyledImageContent}
  ${StyledPageContent}
  
  margin: 0 auto;
  .content_container {
    &.two_images_in_page {
      .comic_page {
        &:nth-child(odd) { img { margin-right: 0; } }
        &:nth-child(even) { img { margin-left: 0; } }
      }
    } 
    
    .comic_page {
      height: 100%;
      img {
        width: auto; height: auto;
        max-width: 100%; max-height: 100%;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        position: relative;
        margin: 0 auto;
      }
      &.has_content_footer {
        img {
          max-height: calc(100% - ${() => Connector.setting.getContentFooterHeight(true)});
          top: calc(50% - ${() => Connector.setting.getContentFooterHeight() / 2}px);
        }
        .content_footer {
          text-align: center;
        }
      }
    }
  }
`;

const propTypes = {
  index: PropTypes.number,
  visible: PropTypes.bool,
  startOffset: PropTypes.number,
};

StyledHtmlScrollContent.propTypes = propTypes;
StyledHtmlPageContent.propTypes = propTypes;
StyledImageScrollContent.propTypes = propTypes;
StyledImagePageContent.propTypes = propTypes;
