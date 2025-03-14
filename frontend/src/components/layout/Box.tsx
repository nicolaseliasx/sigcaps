import { ExternalStyles, Omit, useStyles } from "bold-ui";
import React from "react";

export interface BoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  style?: ExternalStyles;
}

export function Box(props: BoxProps) {
  const { style, ...rest } = props;

  const { css, classes } = useStyles((theme) => ({
    box: {
      background: theme.pallete.surface.main,
      padding: "1rem",
      borderRadius: "2px",
      border: `1px solid ${theme.pallete.divider}`,
    },
  }));

  return <div className={css(classes.box, style)} {...rest} />;
}
