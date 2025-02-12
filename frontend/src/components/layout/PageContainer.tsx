import { useStyles } from "bold-ui";
import { Interpolation } from "emotion";
import React, { CSSProperties } from "react";

export interface PageContainerProps {
  fluid?: boolean;
  children?: React.ReactNode;
  style?: Interpolation;
}

export function PageContainer(props: PageContainerProps) {
  const { fluid, children, style } = props;
  const { classes, css } = useStyles(createStyles);

  return (
    <div className={css(classes.container, fluid && classes.fluid, style)}>
      {children}
    </div>
  );
}

const createStyles = () => ({
  container: {
    width: "100%",
    margin: "0 auto",
  } as CSSProperties,
  fluid: {
    width: "100%",
    maxWidth: "calc(1280px + 4rem)",
  },
});
