import styled from 'styled-components';

const StyledBaseFooter = styled.section`
  box-sizing: border-box;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

export const StyledPageFooter = StyledBaseFooter.extend`
  vertical-align: top;
  white-space: initial;
  overflow: auto;
  display: inline-block;
  width: ${({ width }) => width};
`;

export const StyledScrollFooter = StyledBaseFooter.extend`
  position: absolute;
  top: ${({ startOffset }) => `${startOffset}px`};
  margin: ${({ containerVerticalMargin }) => `${containerVerticalMargin}px 0`};
  width: 100%;
`;
