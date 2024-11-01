import { VFlow, HeadingSection } from "bold-ui";
import { PageContent } from "./components/layout/PageContent";

function App() {
  return (
    <PageContent type="filled">
      <HeadingSection level={1} title="SIGCAPS" />
      <VFlow>testando...</VFlow>
    </PageContent>
  );
}

export default App;
