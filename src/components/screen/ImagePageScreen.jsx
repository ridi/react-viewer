import React from 'react';
import { connect } from 'react-redux';
import {
  selectReaderCurrent,
  selectReaderContents,
  selectReaderContentsCalculations,
  selectReaderFooterCalculations,
  selectReaderBindingType,
  selectReaderCalculationsTotal,
} from '../../redux/selector';
import {
  screenHeight,
  screenWidth,
  setScrollTop,
  waitThenRun,
} from '../../util/BrowserWrapper';
import PropTypes, {
  FooterCalculationsType,
  ContentCalculationsType,
  CurrentType,
  ContentType,
} from '../prop-types';
import BaseScreen, {
  mapStateToProps as readerBaseScreenMapStateToProps,
  mapDispatchToProps as readerBaseScreenMapDispatchToProps,
} from './BaseScreen';
import Connector from '../../service/connector';
import Footer from '../footer/Footer';
import { BindingType, ContentFormat } from '../../constants/ContentConstants';
import { makeSequence } from '../../util/Util';
import ImageContent from '../content/ImageContent';
import { StyledImagePageContent } from '../styled/StyledContent';
import { FOOTER_INDEX, PRE_CALCULATION } from '../../constants/CalculationsConstants';
import { ViewType } from '../../constants/SettingConstants';
import { getStyledFooter } from '../styled';
import EventBus, { Events } from '../../event';

class ImagePageScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount();
    EventBus.on(Events.MOVE_TO_OFFSET, this.moveToOffset.bind(this), this);
    const isCalculated = Connector.calculations.isContentCalculated(1);
    if (!isCalculated) {
      EventBus.emit(Events.CALCULATE_CONTENT, { index: 1 });
    }
  }

  componentDidUpdate() {
    const isCalculated = Connector.calculations.isContentCalculated(1);
    if (!isCalculated) {
      EventBus.emit(Events.CALCULATE_CONTENT, { index: 1 });
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    EventBus.offByTarget(this);
  }

  moveToOffset(offset) {
    waitThenRun(() => {
      const { contentIndex } = this.props.current;
      setScrollTop(0);
      if (contentIndex === FOOTER_INDEX) {
        this.wrapper.current.scrollLeft = this.wrapper.current.scrollWidth;
      } else {
        this.wrapper.current.scrollLeft = 0;
        this.container.current.scrollLeft = offset * screenWidth();
      }
      EventBus.emit(Events.MOVED);
    }, 0);
  }

  renderFooter() {
    const { footer, footerCalculations } = this.props;
    const { containerVerticalMargin } = this.props.setting;
    const startOffset = Connector.calculations.getStartOffset(FOOTER_INDEX);

    return (
      <Footer
        content={footer}
        isCalculated={footerCalculations.total !== PRE_CALCULATION}
        startOffset={startOffset}
        containerVerticalMargin={containerVerticalMargin}
        StyledFooter={getStyledFooter(ContentFormat.IMAGE, ViewType.PAGE)}
      />
    );
  }

  renderContent(content) {
    const {
      current,
      contentFooter,
    } = this.props;

    return (
      <ImageContent
        key={`${content.uri}:${content.index}`}
        content={content}
        currentOffset={current.offset}
        src={content.uri || content.content}
        onContentLoaded={this.onContentLoaded}
        onContentError={this.onContentError}
        contentFooter={Connector.calculations.isLastContent(content.index) ? contentFooter : null}
      />
    );
  }

  getBlankPage(index) {
    return <section className="comic_page" key={`blank:${index}`} />;
  }

  getContents() {
    const { contents, bindingType } = this.props;
    const { columnsInPage, startWithBlankPage } = this.props.setting;
    let result = [];

    if (startWithBlankPage > 0) {
      result = makeSequence(startWithBlankPage).map(index => this.getBlankPage(index + 1));
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
          ...makeSequence(columnsInPage - imagesInLastScreen).map(index => this.getBlankPage(result.length + index)),
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
};

const mapStateToProps = state => ({
  ...readerBaseScreenMapStateToProps(state),
  current: selectReaderCurrent(state),
  contents: selectReaderContents(state),
  contentsCalculations: selectReaderContentsCalculations(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
  footerCalculations: selectReaderFooterCalculations(state),
  bindingType: selectReaderBindingType(state),
});

const mapDispatchToProps = dispatch => ({
  ...readerBaseScreenMapDispatchToProps(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImagePageScreen);
