import { ExternalStyles, Omit, useStyles } from "bold-ui";
import React from "react";
import { useConfig } from "../../provider/useConfig";
import { useFontScale } from "../../hooks/useFontScale";

export interface BoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  style?: ExternalStyles;
}

export function Box(props: BoxProps) {
  const { style, ...rest } = props;
  const { config } = useConfig();
  const fontSizes = useFontScale(config?.fontSize || 1);

  const { css, classes } = useStyles((theme) => ({
    box: {
      background: theme.pallete.surface.main,
      border: `${fontSizes.xsmall}px solid ${theme.pallete.divider}`,
      padding: "1rem",
      paddingRight: "2rem",
      borderRadius: `${1 + fontSizes.xsmall}px`,
    },
  }));

  return <div className={css(classes.box, style)} {...rest} />;
}
