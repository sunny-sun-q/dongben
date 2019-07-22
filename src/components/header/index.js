import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import React, { Component } from 'react';
import { Col, Row } from 'tinper-bee';
import PropTypes from 'prop-types';
import './index.less';
import classnames from 'classnames';

const propTypes = {
    back: PropTypes.bool,
    backFn: PropTypes.func,
    title: PropTypes.string.isRequired
};

const defaultProps = {
    back: false,
    title: ''
};

const headerStyle = classnames({
    'title': true,
    'title-develop': true
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.mdmNowUrl = window.mdmNowUrl + '';
    }
    componentDidMount() {}

    render() {
        let { backFn, title, back, children } = this.props;
        if(!backFn)
            backFn  = () => {
                window.location.href = this.mdmNowUrl;
                // window.history.go(-1);
            }
        return (
            <Row className={"title title-develop position-relative"}>
                    {
                        back ? (
                            <span onClick={backFn} className="back-icon">
                                <i className={classnames({ 'uf uf-arrow-left pull-left': true, 'hide': !back })} />
                                <FormattedMessage id="js.com.hea.0001" defaultMessage="返回" />
                        </span>) : ''
                    }
                    <span className="main-title">
                        {title}
                    </span>
                    {children}
            </Row>
        )
    }
}
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
export default Header;
