
import React, { useEffect } from "react";
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

export {
  React,
  useEffect,
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
};
