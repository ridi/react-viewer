/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { ComicCalculationContext, ComicService, ComicSettingContext } from '@ridi/react-reader';


const isKeyboardEvent = (e: React.KeyboardEvent | React.ChangeEvent): e is React.KeyboardEvent => !!(e as React.KeyboardEvent).key;
const isHtmlInputElement = (target: any): target is HTMLInputElement => !!(target as HTMLInputElement).value;

const ComicFooter: React.FunctionComponent = () => {
  // 전역 context
  const pagingState = React.useContext(ComicCalculationContext);
  const settingState = React.useContext(ComicSettingContext);

  // 로컬에서만 유지되는 값
  const [currentPage, setCurrentPage] = React.useState(pagingState.currentPage);

  const onInputCurrentPage = (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (isKeyboardEvent(e) && e.key === 'Enter') {
      ComicService.goToPage({
        page: currentPage,
        settingState,
        pagingState,
      });
    } else if (isHtmlInputElement(e.target)) {
      setCurrentPage(parseInt(e.target.value || '1', 10));
    }
  };

  React.useEffect(() => {
    setCurrentPage(pagingState.currentPage);
  }, [pagingState]);

  return (
    <div css={styles.footer}>
      <div>
        <input
          type="number"
          value={currentPage}
          onKeyUp={onInputCurrentPage}
          onChange={onInputCurrentPage}
        />
        / {pagingState.totalPage}
      </div>
    </div>
  );
};

export default ComicFooter;
