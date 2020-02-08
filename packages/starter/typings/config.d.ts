type styles = { [className: string]: string };

declare module '*.css' {
  const classNames: styles;
  export default classNames;
}

declare module '*.scss' {
  const classNames: styles;
  export default classNames;
}
