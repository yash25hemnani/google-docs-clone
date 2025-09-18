
import Link from "next/link";
import React from "react";


const Documents = () => {
  return (
    <div>
      <Link href={"/documents/123"}>Click here to redirect</Link>
    </div>
  );
};

export default Documents;
