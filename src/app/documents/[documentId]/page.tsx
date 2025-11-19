import Editor from "./editor";
import Navbar from "./navbar";
import { Room } from "./room";
import Toolbar from "./toolbar";

interface DocumentIdProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentId({ params }: DocumentIdProps) {
  // Await the promise
  const { documentId } = await params;

  return (
    <div className="min-h-screen bg-[#FAFBFD] ">
      <div className="flex flex-col px-2 gap-y-2 fixed top-0 left-0 z-10 bg-[#FAFBFD] print:hidden min-w-screen">
        <Navbar />
        <Toolbar />
      </div>
      <div className="pt-[114px] print:pt-0">
        <Room>
          <Editor />
        </Room>
      </div>
    </div>
  );
}
