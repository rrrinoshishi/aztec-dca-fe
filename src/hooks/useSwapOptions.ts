import React from 'react';
import { SwapOption, Token } from 'types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import usePrevious from 'hooks/usePrevious';
import { useHasPendingTransactions } from 'state/transactions/hooks';
import { parseUnits } from '@ethersproject/units';
import {
  GasKeys,
  SORT_LEAST_GAS,
  SORT_MOST_PROFIT,
  SORT_MOST_RETURN,
  SwapSortOptions,
} from 'config/constants/aggregator';
import { useBlockNumber } from 'state/block-number/hooks';
import { BigNumber } from 'ethers';
import useAggregatorService from './useAggregatorService';
import useWalletService from './useWalletService';
import useSelectedNetwork from './useSelectedNetwork';

export const ALL_SWAP_OPTIONS_FAILED = 'all swap options failed';

function useSwapOptions(
  from: Token | undefined | null,
  to: Token | undefined | null,
  value?: string,
  isBuyOrder?: boolean,
  sorting?: SwapSortOptions,
  transferTo?: string | null,
  slippage?: number,
  gasSpeed?: GasKeys
): [SwapOption[] | undefined, boolean, string | undefined, () => void] {
  const walletService = useWalletService();
  const [{ result, isLoading, error }, setState] = React.useState<{
    isLoading: boolean;
    result?: SwapOption[];
    error?: string;
  }>({ isLoading: false, result: undefined, error: undefined });
  const hasPendingTransactions = useHasPendingTransactions();
  const aggregatorService = useAggregatorService();
  const prevFrom = usePrevious(from);
  const prevTo = usePrevious(to);
  const prevValue = usePrevious(value);
  const prevIsBuyOrder = usePrevious(isBuyOrder);
  const prevPendingTrans = usePrevious(hasPendingTransactions);
  const prevAccount = usePrevious(walletService.getAccount());
  const account = walletService.getAccount();
  const currentNetwork = useSelectedNetwork();
  const blockNumber = useBlockNumber(currentNetwork.chainId);
  const prevBlockNumber = usePrevious(blockNumber);
  const prevTransferTo = usePrevious(transferTo);
  const prevNetwork = usePrevious(currentNetwork.chainId);
  const prevResult = usePrevious(result, false);
  const prevGasSpeed = usePrevious(gasSpeed);
  const prevSlippage = usePrevious(slippage);
  const debouncedCall = React.useCallback(
    debounce(
      async (
        debouncedFrom?: Token | null,
        debouncedTo?: Token | null,
        debouncedValue?: string,
        debouncedIsBuyOrder?: boolean,
        debouncedTransferTo?: string | null,
        debouncedGasSpeed?: GasKeys,
        debouncedSlippage?: number,
        debouncedAccount?: string,
        debouncedChainId?: number
      ) => {
        if (debouncedFrom && debouncedTo && debouncedValue) {
          const sellBuyValue = debouncedIsBuyOrder
            ? parseUnits(debouncedValue, debouncedTo.decimals)
            : parseUnits(debouncedValue, debouncedFrom.decimals);

          if (sellBuyValue.lte(BigNumber.from(0))) {
            return;
          }

          setState({ isLoading: true, result: undefined, error: undefined });

          try {
            const promiseResult = await aggregatorService.getSwapOptions(
              debouncedFrom,
              debouncedTo,
              debouncedIsBuyOrder ? undefined : parseUnits(debouncedValue, debouncedFrom.decimals),
              debouncedIsBuyOrder ? parseUnits(debouncedValue, debouncedTo.decimals) : undefined,
              SORT_MOST_PROFIT,
              debouncedTransferTo,
              debouncedSlippage,
              debouncedGasSpeed,
              debouncedAccount,
              debouncedChainId
            );

            if (promiseResult.length) {
              setState({ result: promiseResult, error: undefined, isLoading: false });
            } else {
              setState({ result: undefined, error: ALL_SWAP_OPTIONS_FAILED, isLoading: false });
            }
          } catch (e) {
            setState({ result: undefined, error: e as string, isLoading: false });
          }
        }
      },
      750
    ),
    [setState]
  );

  const fetchOptions = React.useCallback(
    () => debouncedCall(from, to, value, isBuyOrder, transferTo, gasSpeed, slippage, account, currentNetwork.chainId),
    [from, to, value, isBuyOrder, transferTo, slippage, gasSpeed, account, currentNetwork.chainId]
  );

  React.useEffect(() => {
    if (
      (!isLoading && !result && !error) ||
      !isEqual(prevFrom, from) ||
      !isEqual(account, prevAccount) ||
      !isEqual(prevTo, to) ||
      !isEqual(prevValue, value) ||
      !isEqual(prevIsBuyOrder, isBuyOrder) ||
      !isEqual(prevTransferTo, transferTo) ||
      !isEqual(prevGasSpeed, gasSpeed) ||
      !isEqual(prevNetwork, currentNetwork.chainId) ||
      !isEqual(prevSlippage, slippage)
    ) {
      if (from && to && value) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchOptions();
      }
    }
  }, [
    from,
    prevFrom,
    isLoading,
    result,
    error,
    prevTo,
    prevIsBuyOrder,
    prevValue,
    value,
    to,
    isBuyOrder,
    prevAccount,
    account,
    prevPendingTrans,
    prevBlockNumber,
    blockNumber,
    walletService,
    fetchOptions,
    prevTransferTo,
    transferTo,
    slippage,
    prevSlippage,
    gasSpeed,
    prevGasSpeed,
    prevNetwork,
    currentNetwork.chainId,
  ]);

  if (!from) {
    return [undefined, false, undefined, fetchOptions];
  }

  let resultToReturn = !error ? result || prevResult : undefined;

  if (sorting === SORT_LEAST_GAS && resultToReturn) {
    resultToReturn = [...resultToReturn].sort((a, b) => (a.gas.estimatedCost.lt(b.gas.estimatedCost) ? -1 : 1));
  }

  if (sorting === SORT_MOST_RETURN && resultToReturn) {
    if (isBuyOrder) {
      resultToReturn = [...resultToReturn].sort((a, b) => (a.sellAmount.amount.lt(b.sellAmount.amount) ? -1 : 1));
    } else {
      resultToReturn = [...resultToReturn].sort((a, b) => (a.buyAmount.amount.gt(b.buyAmount.amount) ? -1 : 1));
    }
  }

  return [resultToReturn, isLoading, error, fetchOptions];
}

export default useSwapOptions;
