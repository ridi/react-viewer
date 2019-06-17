export async function measure(run: () => Promise<any> | any, message: string, ...optionalParams: Array<any>): Promise<any> {
  const startTime = new Date().getTime();
  const result = await run();
  console.log(`${message}`, ...optionalParams, `- (${(new Date().getTime() - startTime)}ms)`);
  return result;
}

export const getRootElement = (): Element | null => {
  if (document.scrollingElement) return document.scrollingElement;
  return document.documentElement || document.body;
};
export const getContentRootElement = (): Element | null => document.getElementById('content_root');

export const getScrollWidth = (): number => {
  const rootElement = getContentRootElement();
  return rootElement ? rootElement.scrollWidth : 0;
};

export const getScrollHeight = () : number => {
  const rootElement = getRootElement();
  return rootElement ? rootElement.scrollHeight : 0;
};

export const getScrollLeft = (): number => {
  const rootElement = getContentRootElement();
  return rootElement ? rootElement.scrollLeft : 0;
};

export const getScrollTop = () : number => {
  const rootElement = getRootElement();
  return rootElement ? rootElement.scrollTop : 0;
};

export const setScrollLeft = (scrollLeft: number): void => {
  const rootElement = getContentRootElement();
  if (rootElement) {
    rootElement.scrollLeft = scrollLeft;
  }
};

export const setScrollTop = (scrollTop: number): void => {
  const rootElement = getRootElement();
  if (rootElement) {
    rootElement.scrollTop = scrollTop;
  }
};

export const getClientWidth = (): number => document.documentElement.clientWidth;

export const getClientHeight = (): number => document.documentElement.clientHeight;
