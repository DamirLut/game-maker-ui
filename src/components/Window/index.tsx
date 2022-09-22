import React from 'react';
import { classNames } from '../tools/classNames';
import style from './style.module.scss';

type WindowProps = {
  title?: string;
  collapsible?: boolean;
  children: React.ReactNode;
};

export default function Window(props: WindowProps) {
  const [active, setActive] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const refHeader = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      if (e.target && ref.current) {
        setActive(ref.current.contains(e.target as Node));
      }
    };

    const dragEvent = (e: MouseEvent) => {
      if (refHeader.current) {
        setActive(true);
        const current = refHeader.current;
        const box = current.getBoundingClientRect();
        const shiftX = e.pageX - box.left;
        const shiftY = e.pageY - box.top;

        document.onmousemove = (e: MouseEvent) => {
          if (ref.current) {
            ref.current.style.left = e.pageX - shiftX + 'px';
            ref.current.style.top = e.pageY - shiftY + 'px';
          }
        };

        current.onmouseup = () => {
          document.onmousemove = null;
        };
      }
    };

    window.addEventListener('click', handleWindowClick);
    refHeader.current?.addEventListener('mousedown', dragEvent);

    return () => {
      window.removeEventListener('click', handleWindowClick);
      refHeader.current?.removeEventListener('mousedown', dragEvent);
    };
  }, []);

  return (
    <div className={style.window} ref={ref}>
      <div
        ref={refHeader}
        className={classNames(style.window__header, active && style.window__header__active)}
      >
        {props.collapsible && <button></button>}
        <span>{props.title}</span>
      </div>
      <div className={classNames(style.window__body, active && style.window__body__active)}>
        {props.children}
      </div>
    </div>
  );
}
