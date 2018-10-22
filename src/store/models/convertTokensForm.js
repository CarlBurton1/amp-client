// @flow
import { Contract } from 'ethers';
import {
  getAccountBalancesDomain,
  getAccountDomain,
  getSignerDomain,
  getTokenDomain,
  getConvertTokensFormDomain,
} from '../domains';

import * as actionCreators from '../actions/convertTokensForm'
import { getSigner } from '../services/signer';
import { EXCHANGE_ADDRESS, WETH_ADDRESS } from '../../config/contracts';
import { WETH } from '../../config/abis';

import type { Token } from '../../types/common';
import type { State, ThunkAction } from '../../types';

export default function convertTokensFormSelector(state: State) {
  let accountDomain = getAccountDomain(state);
  let tokenDomain = getTokenDomain(state);
  let accountBalancesDomain = getAccountBalancesDomain(state);
  let convertTokensFormDomain = getConvertTokensFormDomain(state)
  let signerDomain = getSignerDomain(state);

  let tokens = tokenDomain.bySymbol()
  tokens['ETH'] = { symbol: 'ETH', address: '0x0' }

  return {
    accountAddress: () => accountDomain.address(),
    tokens: () => tokens,
    balances: () => accountBalancesDomain.formattedBalances(),
    networkId: () => signerDomain.getNetworkId(),
    convertTokensFormState: (tokenSymbol: string) => convertTokensFormDomain.convertTokensFormState(tokenSymbol),
  };
}

export const convertFromWETHtoETH = (convertAmount: number): ThunkAction => {
  return async (dispatch, getState) => {
    try {
      dispatch(actionCreators.confirm('WETH'))
      let signer = getSigner()
      let network = convertTokensFormSelector(getState()).networkId()
      let weth = new Contract(WETH_ADDRESS[network], WETH, signer)

      let tx = await weth.withdraw(convertAmount)
      dispatch(actionCreators.sendConvertTx('WETH', tx.hash))

      let txReceipt = await signer.provider.waitForTransaction(tx.hash)

      txReceipt.status === '0x0'
        ? dispatch(actionCreators.revertConvertTx('WETH', txReceipt))
        : dispatch(actionCreators.confirmConvertTx('WETH', txReceipt))

    } catch (error) {
      console.log(error.message)
    }
  }
}

export const convertFromETHtoWETH = (shouldAllow: boolean, convertAmount: number): ThunkAction => {
  return async (dispatch, getState) => {
    try {
      dispatch(actionCreators.confirm('ETH'));
      let signer = getSigner();
      let network = convertTokensFormSelector(getState()).networkId();
      let weth = new Contract(WETH_ADDRESS[network], WETH, signer);

      if (shouldAllow) {
        let convertTxPromise = weth.deposit();
        let allowTxPromise = weth.approve(EXCHANGE_ADDRESS[network], -1, {});

        let [convertTx, allowTx] = await Promise.all([convertTxPromise, allowTxPromise]);

        dispatch(actionCreators.sendConvertTx('ETH', convertTx.hash));
        dispatch(actionCreators.sendAllowTx('ETH', allowTx.hash));

        let [convertTxReceipt, allowTxReceipt] = await Promise.all([
          signer.provider.waitForTransaction(convertTx.hash),
          signer.provider.waitForTransaction(allowTx.hash),
        ]);

        convertTxReceipt.status === '0x0'
          ? dispatch(actionCreators.revertConvertTx('ETH', convertTxReceipt))
          : dispatch(actionCreators.confirmConvertTx('ETH', convertTxReceipt));

        allowTxReceipt.status === '0x0'
          ? dispatch(actionCreators.revertAllowTx('ETH', allowTxReceipt))
          : dispatch(actionCreators.confirmAllowTx('ETH', allowTxReceipt));
      } else {
        let convertTx = await weth.convert();
        dispatch(actionCreators.sendConvertTx('ETH', convertTx.hash));
        let convertTxReceipt = await signer.provider.waitForTransaction(convertTx.hash);

        convertTxReceipt.status === '0x0'
          ? dispatch(actionCreators.revertConvertTx('ETH', convertTxReceipt))
          : dispatch(actionCreators.confirmConvertTx('ETH', convertTxReceipt));
      }

    } catch (error) {
      console.log(error.message);
    }
  };
};
