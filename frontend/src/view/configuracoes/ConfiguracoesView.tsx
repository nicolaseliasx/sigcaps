import { HeadingSection, VFlow } from "bold-ui";
import { PageContent } from "../../components/layout/PageContent";

export default function ConfiguracoesView() {
  return (
    <PageContent type="filled">
      <HeadingSection level={1} title="Configs" />
      <VFlow></VFlow>
    </PageContent>
  );
}
