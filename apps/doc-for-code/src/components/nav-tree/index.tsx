/**
 * there is vertical collapsed tree component
 * can accept file directory tree or classify set
 */
import { FC } from 'react';

interface NavItem {
  id: string;
  text: string;
  children: NavItem[];
  extra: any;
}

interface VerticalTreeItemProps {
  data: NavItem;
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
}
const VerticalTreeItem: FC<VerticalTreeItemProps> = ({ data, onExpand, onCollapse }) => {
  return <div>{data.text}</div>;
};

interface VerticalTreeProps {
  data: NavItem[];
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
}
export const VerticalTree: FC<VerticalTreeProps> = props => {
  return (
    <div>
      {props.data.map(item => (
        <div key={item.id}>
          <span>{item.text}</span>
          {item.children.length > 0 && (
            <span>
              <span>
                <span onClick={() => props.onExpand(item.id)}>{item.children.length}</span>
              </span>
              <span>
                <span onClick={() => props.onCollapse(item.id)}>-</span>
              </span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
