/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { EpubCalculationContext, EpubCurrentContext, EpubService, EpubSettingContext } from '@ridi/react-reader';

const isKeyboardEvent = (e: React.KeyboardEvent | React.ChangeEvent): e is React.KeyboardEvent => !!(e as React.KeyboardEvent).key;
const isHtmlInputElement = (target: any): target is HTMLInputElement => !!(target as HTMLInputElement).value;

const EpubFooter: React.FunctionComponent = () => {
  // 전역 context
  const currentState = React.useContext(EpubCurrentContext);
  const settingState = React.useContext(EpubSettingContext);
  const calculationState = React.useContext(EpubCalculationContext);

  // 로컬에서만 유지되는 값
  const [currentPage, setCurrentPage] = React.useState(currentState.currentPage);
  const [fontSizeInEm, setFontSizeInEm] = React.useState(settingState.fontSizeInEm);


  const onInputCurrentPage = (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (isKeyboardEvent(e) && e.key === 'Enter') {
      EpubService.get().goToPage(currentPage);
    } else if (isHtmlInputElement(e.target)) {
      setCurrentPage(parseInt(e.target.value || '1', 10));
    }
  };

  const onInputFontSizeInEm = (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (isKeyboardEvent(e) && e.key === 'Enter') {
      EpubService.get().updateSetting({ fontSizeInEm });
    } else if (isHtmlInputElement(e.target)) {
      setFontSizeInEm(parseFloat(e.target.value || '1.0'));
    }
  };

  React.useEffect(() => {
    setCurrentPage(currentState.currentPage);
  }, [currentState]);

  return (
    <div css={styles.footer}>
      <div className="footer_paging_status">
        <input
          type="number"
          value={currentPage}
          onKeyUp={onInputCurrentPage}
          onChange={onInputCurrentPage}
        />
        / {calculationState.totalPage}
      </div>
      <div className="footer_text_setting">
        FontSize: {settingState.fontSizeInEm}
        <input
          type="number"
          value={fontSizeInEm}
          onKeyUp={onInputFontSizeInEm}
          onChange={onInputFontSizeInEm}
        />
      </div>
    </div>
  );
};

export default EpubFooter;
