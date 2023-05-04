import { FC } from 'react';
import { Icon, IconCollapse } from './icons';

export const App: FC = () => {
  return (
    <div className="w-screen h-screen bg-primary flex flex-col">
      <div className="h-50 bg-secondary flex">
        <div className="w-260 border-1 border-primary flex justify-center items-center">
          <div className="flex-1"></div>
          <div className="w-32 h-32">
            <Icon icon={IconCollapse} />
          </div>
        </div>
        <div className="flex-1 border-1 border-primary"></div>
      </div>
      <div className="flex-1 flex">
        <div className="left-panel w-260 bg-tertiary border-1 border-primary"></div>
        <div className="right-panel flex-1 border-1 border-primary"></div>
      </div>
    </div>
  );
};
