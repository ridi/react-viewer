import styled from 'styled-components';

const StyledBaseFooter = styled.section`
  box-sizing: border-box;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const StyledScrollFooter = StyledBaseFooter.extend`
  margin: ${({ containerVerticalMargin }) => `${containerVerticalMargin}px 0`};
`;

export const StyledPageFooter = StyledBaseFooter.extend`
  vertical-align: top;
  white-space: initial;
  overflow: auto;
  display: inline-block;
  width: ${({ width }) => width};
`;

export const StyledHtmlScrollFooter = StyledScrollFooter.extend`
  position: absolute;
  top: ${({ startOffset }) => `${startOffset}px`};
  width: 100%;
`;

export const StyledImageScrollFooter = StyledScrollFooter.extend``;
