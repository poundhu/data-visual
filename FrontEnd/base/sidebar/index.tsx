import * as React from 'react';
import { Panel, IPanelProps } from './panel';
import * as classNames from 'classnames';
import './style.styl';

type SidebarMode = 'left' | 'right';

type OpenState = 'open' | 'close';

interface IOnOpenChange {
  (state?: OpenState): void;
}

interface ISidebarProps {
  width?: string;
  height?: string;
  mode?: SidebarMode;
  className?: string;
  onOpenChange?: IOnOpenChange;
  onOpenChangeAfter?: IOnOpenChange;
}

interface ISidebarState {
  selectKey: number;
  isCollapsed: boolean;
}

export default class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  constructor(props: ISidebarProps) {
    super(props);
    this.renderIconBar = this.renderIconBar.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.collapsePanel = this.collapsePanel.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
  }

  state = {
    selectKey: 0,
    isCollapsed: false
  };

  static defaultProps = {
    mode: 'left',
    width: '100%',
    height: '100%'
  };

  static Panel = Panel;

  private isRenderByOpenChange = false;

  private barNode: HTMLDivElement;

  public barWidth: string;

  handleIconClick(idx: number) {
    if (this.state.isCollapsed) {
      this.props.onOpenChange && this.props.onOpenChange('open');
      this.isRenderByOpenChange = true;
    }

    this.setState({ selectKey: idx, isCollapsed: false });
  }

  renderIconBar(c: React.ReactElement<IPanelProps>, i: number) {
    const { icon, title } = c.props;
    return (
      <li key={i} className={classNames(
        { bright: !this.state.isCollapsed && this.state.selectKey === i })}
        onClick={() => this.handleIconClick(i)}>
        <span className={icon}>{typeof (icon) === 'undefined' && title}</span>
      </li>
    );
  }

  collapsePanel(event: React.MouseEvent<HTMLElement>) {
    this.setState({ isCollapsed: true }, () => {
      this.props.onOpenChange && this.props.onOpenChange('close');
    });
  }

  renderPanel(c: React.ReactElement<IPanelProps>, i: number) {
    let newProps = {
      collapse: this.collapsePanel,
      isShow: i === this.state.selectKey
    };
    return React.cloneElement(c, newProps as IPanelProps);
  }

  componentDidMount() {
    const style = document.defaultView.getComputedStyle(this.barNode, null);
    this.barWidth = style.width;
  }

  componentDidUpdate() {
  }

  render() {
    const { height, children, mode, className } = this.props;
    const width = this.state.isCollapsed ? this.barWidth : this.props.width;
    const sidebarCls = classNames('sidebar_container', className, {
      'sidebar_container_right': this.props.mode === 'right'
    });

    return (
      <div style={{ width: width, minWidth: width, height: height }} className={sidebarCls}>
        <div className='sidebar_bar' ref={(node) => this.barNode = node}>
          <ul>
            {React.Children.map(children, this.renderIconBar)}
          </ul>
        </div>
        <div className={classNames('sidebar_panels', { collapse: this.state.isCollapsed })}>
          {React.Children.map(children, this.renderPanel)}
        </div>
      </div>
    );
  }
}