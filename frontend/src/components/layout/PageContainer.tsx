import { Theme, useStyles } from "bold-ui";
import { Interpolation } from "emotion";
import React, { CSSProperties } from "react";

export interface PageContainerProps {
  fluid?: boolean;
  fixed?: boolean;
  children?: React.ReactNode;
  style?: Interpolation;
}

export function PageContainer(props: PageContainerProps) {
  const { fluid, fixed, children, style } = props;
  const { classes, css } = useStyles(createStyles);

  return (
    <div
      className={css(
        classes.container,
        fluid && classes.fluid,
        fixed && classes.fixed,
        style
      )}
    >
      {children}
    </div>
  );
}

const createStyles = (theme: Theme) => ({
  container: {
    width: "100%",
    margin: "0 auto",
    padding: "0 2rem",
    maxWidth: "calc(1120px + 4rem)",
  } as CSSProperties,
  fluid: {
    width: "100%",
    maxWidth: "1600px",
  },
  //Calc's para considerar cabeçalho e barra lateral
  fixed: {
    padding: 0,
    position: "fixed",
    height: "calc(100% - 7.75rem)",
    width: "100%",

    [theme.breakpoints.up("lg")]: {
      width: "calc(100% - 75px)",
    },
  } as CSSProperties,
});
