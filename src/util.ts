export async function measure(run: () => Promise<any> | any, message: string, ...optionalParams: Array<any>): Promise<any> {
  const startTime = new Date().getTime();
  const result = await run();
  console.log(`${message}`, ...optionalParams, `- (${(new Date().getTime() - startTime)}ms)`);
  return result;
}

export function withMeasure(run: () => Promise<any> | any, message: string, ...optionalParams: Array<any>): () => Promise<any> {
  return async (): Promise<any> => {
    const startTime = new Date().getTime();
    const result = await run();
    console.log(`${message}`, ...optionalParams, `- (${(new Date().getTime() - startTime)}ms)`);
    return result;
  };
}


export function getRootElement(): HTMLElement | null {
  return document.getElementById('content');
}

export function getScrollWidth(): number {
  const rootElement = getRootElement();
  return rootElement ? rootElement.scrollWidth : 0;
}

export function getScrollHeight(): number {
  const rootElement = getRootElement();
  return rootElement ? rootElement.scrollHeight : 0;
}

export function getClientWidth(): number {
  return document.documentElement.clientWidth;
}

export function getClientHeight(): number {
  return document.documentElement.clientHeight;
}
