/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { ComicCalculationContext, ComicCurrentContext, ComicService } from '@ridi/react-reader';


const isKeyboardEvent = (e: React.KeyboardEvent | React.ChangeEvent): e is React.KeyboardEvent => !!(e as React.KeyboardEvent).key;
const isHtmlInputElement = (target: any): target is HTMLInputElement => !!(target as HTMLInputElement).value;

const ComicFooter: React.FunctionComponent = () => {
  // 전역 context
  const currentState = React.useContext(ComicCurrentContext);
  const calculationState = React.useContext(ComicCalculationContext);

  // 로컬에서만 유지되는 값
  const [currentPage, setCurrentPage] = React.useState(currentState.currentPage);

  const onInputCurrentPage = (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (isKeyboardEvent(e) && e.key === 'Enter') {
      ComicService.get().goToPage(currentPage);
    } else if (isHtmlInputElement(e.target)) {
      setCurrentPage(parseInt(e.target.value || '1', 10));
    }
  };

  React.useEffect(() => {
    setCurrentPage(currentState.currentPage);
  }, [currentState]);

  return (
    <div css={styles.footer}>
      <div>
        <input
          type="number"
          value={currentPage}
          onKeyUp={onInputCurrentPage}
          onChange={onInputCurrentPage}
        />
        / {calculationState.totalPage}
      </div>
    </div>
  );
};

export default ComicFooter;
