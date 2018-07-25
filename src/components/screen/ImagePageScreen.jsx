import React from 'react';
import { connect } from 'react-redux';
import {
  selectCurrent,
  selectContents,
  selectContentsCalculations,
  selectFooterCalculations,
  selectBindingType,
  selectCalculationsTotal,
} from '../../redux/selector';
import { screenHeight, screenWidth, setScrollTop } from '../../util/BrowserWrapper';
import { updateContent, updateContentError } from '../../redux/action';
import PropTypes, { FooterCalculationsType, ContentCalculationsType, CurrentType, ContentType } from '../prop-types';
import BaseScreen, { mapStateToProps as readerBaseScreenMapStateToProps } from './BaseScreen';
import Connector from '../../util/connector/';
import Footer from '../footer/Footer';
import PageTouchable, { Position } from './PageTouchable';
import { BindingType } from '../../constants/ContentConstants';
import { isExist, makeSequence } from '../../util/Util';
import ImageContent from '../content/ImageContent';
import ContentFooter from '../footer/ContentFooter';
import { StyledImagePageContent } from '../styled/StyledContent';
import { FOOTER_INDEX } from '../../constants/CalculationsConstant';

class ImagePageScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    Connector.calculations.setTotal(1, Math.ceil(this.container.current.scrollWidth / screenWidth()));
  }

  onTouchableScreenTouched({ position }) {
    super.onTouchableScreenTouched({ position });

    const { bindingType, calculationsTotal, onMoveWrongDirection } = this.props;
    const { offset: currentOffset } = this.props.current;

    if (position === Position.MIDDLE) return;
    if (position === Position.RIGHT
      && bindingType === BindingType.RIGHT
      && currentOffset === 0) {
      if (isExist(onMoveWrongDirection)) {
        onMoveWrongDirection();
      }
      return;
    }

    let nextOffset = currentOffset;
    if (position === Position.LEFT) {
      nextOffset = bindingType === BindingType.LEFT ? currentOffset - 1 : currentOffset + 1;
    } else if (position === Position.RIGHT) {
      nextOffset = bindingType === BindingType.LEFT ? currentOffset + 1 : currentOffset - 1;
    }

    nextOffset = Math.max(0, Math.min(nextOffset, calculationsTotal));
    if (currentOffset === nextOffset) return;

    Connector.calculations.updateCurrentPosition(nextOffset);
  }

  getTouchableScreen() {
    return PageTouchable;
  }

  moveToOffset() {
    const { contentIndex, offset } = this.props.current;
    setScrollTop(0);
    if (contentIndex === FOOTER_INDEX) {
      this.wrapper.current.scrollLeft = this.wrapper.current.scrollWidth;
    } else {
      this.wrapper.current.scrollLeft = 0;
      this.container.current.scrollLeft = offset * screenWidth();
    }
  }

  renderFooter() {
    const { footer } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);
    return (
      <Footer
        content={footer}
        startOffset={startOffset}
        onContentRendered={() => Connector.calculations.setTotal(FOOTER_INDEX, 1)}
        containerVerticalMargin={containerVerticalMargin}
      />
    );
  }

  renderContent(content) {
    const {
      current,
      actionUpdateContent,
      actionUpdateContentError,
      contentFooter,
    } = this.props;

    return (
      <ImageContent
        key={`${content.uri}:${content.index}`}
        content={content}
        currentOffset={current.offset}
        src={content.uri}
        onContentLoaded={actionUpdateContent}
        onContentError={actionUpdateContentError}
        contentFooter={Connector.calculations.isLastContent(content.index) ?
          <ContentFooter content={contentFooter} /> : null}
      />
    );
  }

  getBlankPage() {
    return <section className="comic_page" />;
  }

  getContents() {
    const { contents, bindingType } = this.props;
    const { columnsInPage, startWithBlankPage } = this.props.setting;
    let result = [];

    if (startWithBlankPage > 0) {
      result = makeSequence(startWithBlankPage).map(() => this.getBlankPage());
    }
    result = [
      ...result,
      ...contents.map(content => this.renderContent(content)),
    ];
    if (columnsInPage > 1 && bindingType === BindingType.RIGHT) {
      const imagesInLastScreen = result.length % columnsInPage;
      if (imagesInLastScreen > 0) {
        result = [
          ...result,
          ...makeSequence(columnsInPage - imagesInLastScreen).map(() => this.getBlankPage()),
        ];
      }

      let reversed = [];
      for (let i = 0; i < result.length / columnsInPage; i += 1) {
        const reversingUnit = result.slice(i * columnsInPage, (i + 1) * columnsInPage);
        reversed = [...reversed, ...reversingUnit.reverse()];
      }
      return reversed;
    }
    return result;
  }

  renderContents() {
    const { columnsInPage } = this.props.setting;
    return (
      <StyledImagePageContent
        setting={this.props.setting}
        innerRef={this.container}
        width={`${screenWidth()}px`}
        height={`${screenHeight()}px`}
        visible
      >
        <div className={`content_container ${columnsInPage === 2 ? 'two_images_in_page' : ''}`}>
          {this.getContents()}
        </div>
      </StyledImagePageContent>
    );
  }
}

ImagePageScreen.defaultProps = {
  ...BaseScreen.defaultProps,
  footer: null,
  contentFooter: null,
  onMoveWrongDirection: null,
};

ImagePageScreen.propTypes = {
  ...BaseScreen.propTypes,
  current: CurrentType,
  contents: PropTypes.arrayOf(ContentType).isRequired,
  contentsCalculations: PropTypes.arrayOf(ContentCalculationsType).isRequired,
  actionUpdateContent: PropTypes.func.isRequired,
  actionUpdateContentError: PropTypes.func.isRequired,
  footer: PropTypes.node,
  contentFooter: PropTypes.node,
  footerCalculations: FooterCalculationsType.isRequired,
  bindingType: PropTypes.oneOf(BindingType.toList()).isRequired,
  calculationsTotal: PropTypes.number.isRequired,
  onMoveWrongDirection: PropTypes.func,
};

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  current: selectCurrent(state),
  contents: selectContents(state),
  contentsCalculations: selectContentsCalculations(state),
  calculationsTotal: selectCalculationsTotal(state),
  footerCalculations: selectFooterCalculations(state),
  bindingType: selectBindingType(state),
});

const mapDispatchToProps = dispatch => ({
  actionUpdateContent: (index, content) => dispatch(updateContent(index, content)),
  actionUpdateContentError: (index, error) => dispatch(updateContentError(index, error)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImagePageScreen);
