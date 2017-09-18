/* eslint max-len: 0 */
import styled from 'styled-components';
import SvgIconConstants from '../constants/SvgIconConstants';


const svgBuild = (width, height, color, svgStr) => {
  let tmpStr = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width}px ${height}px"><style>path, polygon { fill: ${color}; }</style>${svgStr}</svg>`;
  tmpStr = encodeURI(tmpStr);
  return tmpStr;
};

const svgIcons = {
  [SvgIconConstants.PICTURE_1]: color => svgBuild(
    66, 52, color,
    `<path fill='${color}' d='M61,0H5C2.25,0,0,2.25,0,5v42c0,2.75,2.25,5,5,5h56c2.75,0,5-2.25,5-5V5C66,2.25,63.75,0,61,0z M64,47c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V5c0-1.654,1.346-3,3-3h56c1.654,0,3,1.346,3,3V47z'/><path fill='${color}' d='M43.825,26.971c-0.176-0.221-0.437-0.356-0.719-0.375c-0.269-0.016-0.557,0.083-0.76,0.28l-7.572,7.349l-8.134-10.321c-0.187-0.237-0.472-0.377-0.773-0.381c-0.004,0-0.008,0-0.012,0c-0.298,0-0.581,0.133-0.771,0.363L11.877,39.887c-0.352,0.426-0.291,1.057,0.135,1.408c0.426,0.351,1.056,0.29,1.408-0.135l12.418-15.045l8.052,10.219c0.175,0.222,0.437,0.359,0.719,0.379c0.277,0.012,0.559-0.083,0.763-0.28l7.577-7.353l9.621,12.083c0.197,0.248,0.488,0.377,0.783,0.377c0.218,0,0.438-0.071,0.622-0.218c0.432-0.344,0.503-0.973,0.159-1.405L43.825,26.971z'/><path fill='${color}' d='M47.91,22.46c3.309,0,6-2.691,6-6s-2.691-6-6-6s-6,2.691-6,6S44.602,22.46,47.91,22.46z M47.91,12.46c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S45.704,12.46,47.91,12.46z'/>`
  )
};

// language=SCSS prefix=dummy{ suffix=}
const Svg = styled.span`
  display: inline-block;
  text-indent: -444px;
  font-size: 0;
  overflow: hidden;
  background: url("data:image/svg+xml,${props => svgIcons[props.type](props.color)}") center center no-repeat;
  background-size: 100% 100%;
  width: ${props => props.width};
  height: ${props => props.height};
`;

export { Svg, svgIcons };
