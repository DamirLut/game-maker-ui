import style from './style.module.scss';

type CheckboxProps = {
  label: string;
};

export default function Checkbox(props: CheckboxProps) {
  return (
    <label className={style['checkbox-wrapper']}>
      <input type="checkbox" className={style.checkbox} placeholder="value" />
      {props.label}
    </label>
  );
}
