import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchInput from "./search-input";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href={"/"}>
          <Image src={"/logo.svg"} alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">PeerDocs,</h3>
      </div>
      <SearchInput />
      <div className="flex gap-3 items-center pl-6">
        <OrganizationSwitcher
          // These will cause a refresh of the page - will come in handy during switching, ensuring that we can see only the documents beloninging to the given user/organization. And it will create a new JWT token as well.
          afterCreateOrganizationUrl={"/"}
          afterLeaveOrganizationUrl={"/"}
          afterSelectOrganizationUrl={"/"}
          afterSelectPersonalUrl={"/"}
        />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
