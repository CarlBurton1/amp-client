//@flow
import type { RemoveTokensAction, UpdateTokensAction } from '../../types/tokens';

const actionTypes = {
  updateTokens: 'tokens/UPDATE_TOKENS',
  removeTokens: 'tokens/REMOVE_TOKENS',
};

export function updateTokens(address: string, symbol: string): UpdateTokensAction {
  return {
    type: actionTypes.updateTokens,
    payload: { address, symbol },
  };
}

export function removeTokens(symbol: string): RemoveTokensAction {
  return {
    type: actionTypes.removeTokens,
    payload: { symbol },
  };
}

export default actionTypes;