import React from 'react';
import Paper from '@material-ui/core/Paper';
import { ethers, Signer, BigNumber } from 'ethers';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoadingIndicator from 'common/centered-loading-indicator';
import { Token, Web3Service, EstimatedPairResponse } from 'types';
import { FormattedMessage } from 'react-intl';
import usePromise from 'hooks/usePromise';
import useTransactionModal from 'hooks/useTransactionModal';

const StyledPaper = styled(Paper)`
  padding: 20px;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
`;

interface CreatePairModalProps {
  web3Service: Web3Service;
  from: Token;
  to: Token;
  onCancel: () => void;
  open: boolean;
}

const CreatePairModal = ({ from, to, web3Service, open, onCancel }: CreatePairModalProps) => {
  const [estimatedPrice, isLoadingEstimatedPrice, estimatedPriceErrors] = usePromise<EstimatedPairResponse>(
    web3Service,
    'getEstimatedPairCreation',
    // [from, to],
    ['0xc778417E063141139Fce010982780140Aa0cD5Ab', '0x1efc75f5c6e29b18489b5a5e1e66a91427b661d8'],
    !from || !to || !web3Service.getAccount()
  );

  const [setModalSuccess, setModalLoading, setModalError, setClosedConfig] = useTransactionModal();

  const handleCreatePair = async () => {
    try {
      // const result = await web3Service.createPair(from.address, to.address)
      setModalSuccess({});
      // console.log(result)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <FormattedMessage
          description="Create pair"
          defaultMessage="Create pair with {from} and {to}"
          values={{ from: (from && from.symbol) || '', to: (to && to.symbol) || '' }}
        />
      </DialogTitle>
      <DialogContent>
        {isLoadingEstimatedPrice || !estimatedPrice ? (
          <LoadingIndicator />
        ) : (
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage
              description="Create pair"
              defaultMessage="The estimated cost of the operation is {cost} gwei (aprox. {costUsd} USD or {costEth} ETH)"
              values={{
                cost: estimatedPrice.gas,
                costUsd: estimatedPrice.gasUsd.toFixed(2),
                costEth: estimatedPrice.gasEth,
              }}
            />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          <FormattedMessage description="Cancel" defaultMessage="Cancel" />
        </Button>
        <Button color="primary" disabled={isLoadingEstimatedPrice} onClick={handleCreatePair} autoFocus>
          <FormattedMessage description="Create pair submit" defaultMessage="Create pair" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreatePairModal;