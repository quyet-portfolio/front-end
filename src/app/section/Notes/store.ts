import { GetFlashCardsParams } from "@/src/lib/api/notes";
import { create } from "zustand";

export const useFlashCardsStore = create<GetFlashCardsParams>( () => ({
    page: 1,
    limit: 10,
    search: undefined,
    createdBy: undefined
}))