import * as React from 'react';
import { EpubSettingContext, EpubPagingContext, SettingUtil, EpubService } from '@ridi/react-reader';

const isKeyboardEvent = (e: React.KeyboardEvent | React.ChangeEvent): e is React.KeyboardEvent => !!(e as React.KeyboardEvent).key;
const isHtmlInputElement = (target: any): target is HTMLInputElement => !!(target as HTMLInputElement).value;

const Footer: React.FunctionComponent = () => {
  // 전역 context
  const pagingState = React.useContext(EpubPagingContext);
  const settingState = React.useContext(EpubSettingContext);

  // 로컬에서만 유지되는 값
  const [currentPage, setCurrentPage] = React.useState(pagingState.currentPage);


  const onInputCurrentPage = (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (isKeyboardEvent(e) && e.key === 'Enter') {
      EpubService.goToPage({
        page: currentPage,
        pageUnit: pagingState.pageUnit,
        isScroll: SettingUtil.isScroll(settingState),
      });
    } else if (isHtmlInputElement(e.target)) {
      setCurrentPage(parseInt(e.target.value || '1', 10));
    }
  };

  React.useEffect(() => {
    setCurrentPage(pagingState.currentPage);
  }, [pagingState]);

  return (
    <div id="footer" className="footer_area">
      <div className="footer_paging_status">
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

export default Footer;
