import React from 'react';
import styled from 'styled-components';
import { parseUnits, formatUnits } from '@ethersproject/units';
import { Position } from 'types';
import TokenInput from 'common/token-input';
import { FormattedMessage } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Button from 'common/button';
import Typography from '@material-ui/core/Typography';
import ArrowLeft from 'assets/svg/atom/arrow-left';
import { BigNumber } from 'ethers';
import { formatCurrencyAmount } from 'utils/currency';

const StyledHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
`;

const StyledIconButton = styled(IconButton)`
  margin-right: 5px;
`;

const StyledInputContainer = styled.div`
  flex-grow: 1;
`;

const StyledActionContainer = styled.div`
  flex-grow: 0;
`;

interface RemoveFundsSettingsProps {
  position: Position;
  onWithdraw: (ammountToRemove: string) => void;
  onClose: () => void;
}

const RemoveFundsSettings = ({ position, onWithdraw, onClose }: RemoveFundsSettingsProps) => {
  const [fromValue, setFromValue] = React.useState('');

  const hasError = fromValue && parseUnits(fromValue, position.from.decimals).gte(position.remainingLiquidity);
  const shouldDisable = fromValue && parseUnits(fromValue, position.from.decimals).lte(BigNumber.from(0));
  return (
    <>
      <StyledHeader>
        <StyledIconButton aria-label="close" size="small" onClick={onClose}>
          <ArrowLeft size="20px" />
        </StyledIconButton>
        <Typography variant="h6">
          <FormattedMessage description="withdraw funds" defaultMessage="Withdraw funds" />
        </Typography>
      </StyledHeader>
      <StyledInputContainer>
        <TokenInput
          id="from-value"
          error={!!hasError ? 'Ammount cannot exceed or equal your current funds' : ''}
          value={fromValue}
          label={position.from.symbol}
          onChange={setFromValue}
          withBalance={true}
          isLoadingBalance={false}
          balance={position.remainingLiquidity}
          token={position.from}
        />
        <Typography variant="body2">
          <FormattedMessage
            description="in position"
            defaultMessage="In position: {balance} {symbol}"
            values={{
              balance: formatCurrencyAmount(position.remainingLiquidity, position.from, 4),
              symbol: position.from.symbol,
            }}
          />
        </Typography>
      </StyledInputContainer>
      <StyledActionContainer>
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          disabled={!fromValue || shouldDisable || hasError}
          onClick={() => onWithdraw(fromValue)}
        >
          <FormattedMessage description="withdraw funds" defaultMessage="Withdraw funds" />
        </Button>
      </StyledActionContainer>
    </>
  );
};
export default RemoveFundsSettings;