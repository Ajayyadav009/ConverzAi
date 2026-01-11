"use client";

import { Dispatch, SetStateAction } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
// import { CommandDialog } from "cmdk";
// import { Dialog, DialogContent } from "@/components/ui/dialog";


interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  return(
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
      placeholder="Find a meeting or agents"
      />
      <CommandList>
        <CommandItem>
          Test
        </CommandItem>
      </CommandList>

    </CommandDialog>
  )
};
