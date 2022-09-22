import style from './style.module.scss';

type ButtonProps = {
  bordered?: boolean;
  children?: React.ReactNode;
};

export default function Button(props: ButtonProps) {
  return <button className={style.button}>{props.children}</button>;
}
