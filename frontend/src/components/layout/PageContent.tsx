import { Theme, useStyles } from "bold-ui";
import { Interpolation } from "emotion";
import React from "react";

import { PageContainer } from "./PageContainer";

export interface PageContentProps {
  type?: "transparent" | "filled";
  style?: Interpolation;
  containerStyle?: Interpolation;
  children: React.ReactNode;
  fluid: boolean;
  loading?: boolean;
}

export const PageContent = (props: PageContentProps) => {
  const { style, type, children, fluid, loading, containerStyle } = props;
  const { classes, css } = useStyles(createStyles, props);

  return (
    <div
      className={css(classes.container, classes[type ?? "transparent"], style)}
    >
      <PageContainer fluid={fluid} style={containerStyle}>
        {!loading && children}
      </PageContainer>
    </div>
  );
};

PageContent.defaultProps = {
  type: "transparent",
} as Partial<PageContentProps>;

const createStyles = (theme: Theme) => ({
  container: {
    padding: "1rem 0",
    flexGrow: 1,
    marginTop: "2rem",
  },
  transparent: {
    backgroundColor: theme.pallete.surface.background,
  },
  filled: {
    backgroundColor: theme.pallete.surface.main,
  },
});
