import {css} from '@emotion/core';

export const header = css`
  position: fixed;
  top: 30px;
  width: 100%;
  display: flex;
  height: 50px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  color: #fff;
  background: #343a40;
  border-bottom: 1px solid #808991;
  
  .navbar_title {
    color: white;
    display: inline-block;
    padding-top: .3125rem;
    padding-bottom: .3125rem;
    padding-left: 1rem;
    margin-right: 1rem;
    font-size: 1.25rem;
    line-height: inherit;
    white-space: nowrap;
  }
  
  .navbar_title:focus {
    text-decoration: none;
  }
  
  .navbar_title:hover {
    text-decoration: none;
  }
`;

export const footer = css`
  position: fixed;
  width: 100%;
  height: 30px;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  color: #fff;
  background: #343a40;
  border-bottom: 1px solid #808991;
`;
