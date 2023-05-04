import { FC, FunctionComponent, SVGProps } from 'react';

export interface IconProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
  size?: 12 | 16 | 24 | 32 | 48 | 64;
}
export const Icon: FC<IconProps> = ({ icon, size = 32 }) => {
  const IconSVG = icon;
  return (
    <div>
      <IconSVG style={{ width: size, height: size }} />
    </div>
  );
};
