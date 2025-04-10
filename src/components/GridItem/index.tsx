import classnames from 'classnames';
import * as React from 'react';

export interface GridItemProps {
  /*
  * Children node for GridItem component
  */
  children: React.ReactNode | GridChildInterface;
  /**
   * Additional class name. By default element receives `grid-item` class
   * @default empty
   */
  className?: string;
  /*
  * Children node for GridItem component
  */
  title?: string;
}

export interface GridChildInterface {
  i: number;
  render: () => React.ReactNode | GridChildInterface;
  title?: string;
}

const GridItem: React.FunctionComponent<GridItemProps> = (props: GridItemProps) => {
  const { className, children, title } = props;
  const cx = classnames('grid-item', className);

  return (
    <div className={cx}>
      {title ? <div className="grid-item__header">
        <div className="grid-item__title">
          {title}
        </div>
      </div>
      : null}
      {children}
    </div>
  );
};

export {
  GridItem,
};
