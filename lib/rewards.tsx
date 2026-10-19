'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Ctx = { coins: number; earn: (amount: number) => void; redeem: (cost: number) => boolean; spin: () => number };
const RewardsContext = createContext<Ctx | null>(null);

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(0);
  useEffect(() => { setCoins(Number(localStorage.getItem('ck_reward_coins') || '0')); }, []);
  const earn = (amount: number) => {
    const add = Math.floor(amount / 10);
    setCoins(c => { const n = c + add; localStorage.setItem('ck_reward_coins', String(n)); return n; });
  };
  const redeem = (cost: number) => {
    if (coins < cost) return false;
    setCoins(c => { const n = c - cost; localStorage.setItem('ck_reward_coins', String(n)); return n; });
    return true;
  };
  const spin = () => {
    const last = localStorage.getItem('ck_spin_date');
    const today = new Date().toDateString();
    if (last === today) return 0;
    localStorage.setItem('ck_spin_date', today);
    const win = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
    setCoins(c => { const n = c + win; localStorage.setItem('ck_reward_coins', String(n)); return n; });
    return win;
  };
  return <RewardsContext.Provider value={{ coins, earn, redeem, spin }}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  const c = useContext(RewardsContext);
  if (!c) throw new Error('useRewards outside provider');
  return c;
}
