import React from 'react';
import { create } from 'zustand'
import Index from '../index'
interface storeNavigation {
    navigate : React.ReactNode ;
    updateNavigate : (val : React.ReactNode) => void;
}
export const storeNavigation = create<storeNavigation>((set)=>({
    navigate : Index(),
  updateNavigate : (val) => set({ navigate : val })
}))
