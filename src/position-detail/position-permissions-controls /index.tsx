import React from 'react';
import styled from 'styled-components';
import Button from 'common/button';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { buildEtherscanTransaction } from 'utils/etherscan';
import useCurrentNetwork from 'hooks/useCurrentNetwork';
import { FullPosition } from 'types';
import useWeb3Service from 'hooks/useWeb3Service';
import AddIcon from '@material-ui/icons/Add';

const PositionControlsContainer = styled.div`
  display: flex;
  align-self: flex-end;
  * {
    margin: 0px 5px;
  }
`;

interface PositionPermissionsControlsProps {
  pendingTransaction: string | null;
  position: FullPosition;
  shouldDisable: boolean;
  onSave: () => void;
  onDiscardChanges: () => void;
  onAddAddress: () => void;
}

const PositionPermissionsControls = ({
  pendingTransaction,
  position,
  shouldDisable,
  onSave,
  onDiscardChanges,
  onAddAddress,
}: PositionPermissionsControlsProps) => {
  const currentNetwork = useCurrentNetwork();
  const isPending = pendingTransaction !== null;
  const web3Service = useWeb3Service();
  const account = web3Service.getAccount();

  if (!account || account.toLowerCase() !== position.user.toLowerCase()) return null;

  return isPending ? (
    <Button variant="contained" color="pending" size="large">
      <Link
        href={buildEtherscanTransaction(pendingTransaction as string, currentNetwork.chainId)}
        target="_blank"
        rel="noreferrer"
        underline="none"
        color="inherit"
      >
        <Typography variant="body2" component="span">
          <FormattedMessage description="pending transaction" defaultMessage="Pending transaction" />
        </Typography>
        <CallMadeIcon style={{ fontSize: '1rem' }} />
      </Link>
    </Button>
  ) : (
    <>
      <Button onClick={onAddAddress} variant="outlined" color="default" size="large">
        <FormattedMessage description="add new address" defaultMessage="Add new address" />
        <AddIcon />
      </Button>
      {!shouldDisable && (
        <PositionControlsContainer>
          <Button onClick={onDiscardChanges} variant="contained" color="secondary" size="large">
            <FormattedMessage description="discard changes" defaultMessage="Discard changes" />
          </Button>

          <Button onClick={onSave} disabled={shouldDisable} variant="contained" color="primary" size="large">
            <FormattedMessage description="save" defaultMessage="Save" />
          </Button>
        </PositionControlsContainer>
      )}
    </>
  );
};

export default PositionPermissionsControls;