
import Editor from "./editor";
import Toolbar from "./toolbar";

interface DocumentIdProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentId({ params }: DocumentIdProps) {
  // Await the promise
  const { documentId } = await params;

  return (
    <div className="min-h-screen bg-[#FAFBFD] ">
      <Toolbar />
      <Editor />
    </div>
  );
}
