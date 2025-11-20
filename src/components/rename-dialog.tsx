"use client";

import { Id } from "../../convex/_generated/dataModel";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface RenameDialogProps {
  documentId: Id<"documents">;
  iniitalTitle: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  iniitalTitle,
  children,
}: RenameDialogProps) => {
  const update = useMutation(api.documents.updateById);
  const [isUpdating, setIsUpdating] = useState(false);

  const [title, setTitle] = useState(iniitalTitle);
  const [open, setOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    update({
      id: documentId,
      title: title.trim() || "Untitiled Document",
    })
      .catch(() => toast.error("Something Went Wrong!"))
      .then(() => {
        toast.success("Document Removed");
        setOpen(false);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for this document
            </DialogDescription>
            <div className="my-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document Name"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              disabled={isUpdating}
              className="cursor-pointer"
              variant={"ghost"}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </Button>{" "}
            {/* No inbuilt component available */}
            <Button
              type="submit"
              disabled={isUpdating}
              className="cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
