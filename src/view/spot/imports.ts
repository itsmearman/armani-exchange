
import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePrices, setPricesState } from "@/src/store/slices/pricesSlice";
import {
  updateCashBalance,
  updateCryptoBalance,
  setBalancesState,
} from "@/src/store/slices/balancesSlice";
import { addOrder, setOrdersState } from "@/src/store/slices/ordersSlice";
import { openModal, closeModal } from "@/src/store/slices/modalSlice";
import LivePrices from "./livePrices";
import Balances from "./balances";
import TradeForm from "./tradeForm";
import OrderList from "./orderList";
import Modal from "@/src/components/modal";
import { useTranslations } from "next-intl";
import { RootState } from "@/src/store/store";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient'
import { useBalanceSync } from "@/src/hooks/useBalanceSync";

export {
  React,
  type RootState,
  useEffect,
  useState,
  useDispatch,
  useSelector,
  updatePrices,
  setPricesState,
  updateCashBalance,
  updateCryptoBalance,
  setBalancesState,
  addOrder,
  setOrdersState,
  openModal,
  closeModal,
  LivePrices,
  Balances,
  TradeForm,
  OrderList,
  Modal,
  useTranslations,
  useRouter,
  supabase,
  useBalanceSync,
};
