import * as React from 'react';

import {
    Subheader,
} from '../../components';
import { useHistory } from 'react-router-dom';
import { AddPayment, DeletePayment, Pagination } from '../../../components';
import { useDispatch, useSelector} from 'react-redux';
import {RootState, paymentsAddFetch, paymentsDeleteFetch, paymentsFetch, selectPayments, selectPaymentsFetchLoading, selectPaymentsFirstElemIndex, selectPaymentsLastElemIndex, selectPaymentsNextPageExists} from '../../../modules';
import { useEffect, useState } from 'react';
import { usePaymentsFetch } from '../../../hooks';
import { useIntl } from 'react-intl';
import { Payment } from '../../../modules/user/payments/types';
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from 'src/components';

const ProfileP2PPaymentsScreenComponent: React.FC = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const [addModal, setAddModal] = React.useState(false)
  const [deleteModal, setDeleteModal] = React.useState(false)
  const [paymentChoose, setPaymentChoose] = React.useState({} as Payment)

  const payments = useSelector(selectPayments);
  const paymentsFetching = useSelector(selectPaymentsFetchLoading);
  const [currentPaymentsPageIndex, setCurrentPaymentsPageIndex] = React.useState(0);
  const paymentsFirstElemIndex = useSelector((state: RootState) => selectPaymentsFirstElemIndex(state, 25));
  const paymentsLastElemIndex = useSelector((state: RootState) => selectPaymentsLastElemIndex(state, 25));
  const paymentsNextPageExists = useSelector(selectPaymentsNextPageExists); 
  usePaymentsFetch(currentPaymentsPageIndex + 1, 25)

  const onClickPaymentsPrevPage = () => {
    setCurrentPaymentsPageIndex(currentPaymentsPageIndex - 1);
  };

  const onClickPaymentsNextPage = () => {
    setCurrentPaymentsPageIndex(currentPaymentsPageIndex + 1);
  };

  const [paymentsData, setPaymentsData] = useState(payments);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(paymentsFetch({ page: 1, limit: 25 }));
  }, [dispatch]);

  useEffect(() => {
		setPaymentsData(payments); 
	}, [payments]);

  const renderTable = () => {
    return (
      <div>
        {paymentsData.map((payment, index) => (
          <div key={index} className='payments-screen-box-mobile'>
            <div className="flex justify-between items-center mb-3">
              <div className="payments-screen-type text-lg">
                {formatMessage({id: `page.body.p2p.payments.type.${payment.payment_type}`})}
              </div>
              <div className="payments-screen-delete text-sm" onClick={() => toggleDeleteModal(payment)}>
                {formatMessage({id: 'page.body.p2p.payments.delete'})}
              </div>
            </div>
            <div className='payments-screen-box-mobile-row'>
              <div className='payments-screen-box-mobile-row-label'>{formatMessage({id: 'page.body.p2p.payments.account_name'})}:</div>
              <div className='payments-screen-box-mobile-row-value'>{payment.account_name}</div>
            </div>
            {Object.keys(payment.data).map(key => (
              <div key={key} className='payments-screen-box-mobile-row'>
                <div className='payments-screen-box-mobile-row-label'>{formatMessage({id: `page.body.p2p.payments.${key}`})}:</div>
                <div className='payments-screen-box-mobile-row-value'>{payment.data[key]}</div>
              </div>
            ))}
          </div>
        ))}
        <Pagination
            firstElemIndex={paymentsFirstElemIndex}
            lastElemIndex={paymentsLastElemIndex}
            page={currentPaymentsPageIndex}
            nextPageExists={paymentsNextPageExists}
            onClickPrevPage={onClickPaymentsPrevPage}
            onClickNextPage={onClickPaymentsNextPage}
        />
      </div>
    )
  }

  const render = () => (
    <div>
      {paymentsFetching ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : paymentsData.length > 0 ? renderTable() : <NoResultData class="themes"/>}
    </div>
  );

  const handleAddPayment = ({ payment_type, account_name, data }) => {
    dispatch(paymentsAddFetch({ 
      payment_type,
      account_name,
      data,
    }))
    dispatch(paymentsFetch({ page: 1, limit: 25 }));
    toggleAddModal()
  }

  const handleDeletePayment = ({id}) => {
    dispatch(paymentsDeleteFetch({id}))
    dispatch(paymentsFetch({ page: 1, limit: 25 }));
    toggleDeleteModal()
  }

  const toggleAddModal = () => {
    setAddModal(!addModal)
  }

  const toggleDeleteModal = (payment?: Payment) => {
    if (payment) {
      setPaymentChoose(payment)
    }

    setDeleteModal(!deleteModal)
  }

  const modalAddPayment = addModal ? (
    <div className="pg-mobile-profile-p2p-payments-screen">
      <AddPayment
        handleAddPayment={handleAddPayment}
        title={formatMessage({id: 'page.body.p2p.payments.modal.add.title'})}
        closeModal={toggleAddModal}
      /> 
    </div>
  ) : null;

  const modalDeletePayment = deleteModal ? (
    <div className="pg-mobile-profile-p2p-payments-screen">
      <DeletePayment
        handleDeletePayment={handleDeletePayment}
        title={formatMessage({id: 'page.body.p2p.payments.modal.delete.title'})}
        closeModal={toggleDeleteModal}
        payment={paymentChoose}
      /> 
    </div>
  ) : null;

  return (
      <React.Fragment>
        <Subheader
          title={formatMessage({id: 'page.body.p2p.payments.title'})}
          onGoBack={() => history.push('/p2p')}
          rightElement={<div className='payments-screen-mobile-add' onClick={toggleAddModal}>{formatMessage({id: 'page.body.p2p.payments.add.mobile'})}</div>}
          close={false}
        />
        {render()}
        {modalAddPayment}
        {modalDeletePayment}
      </React.Fragment>
  );
};

export const ProfileP2PPaymentsScreen = React.memo(ProfileP2PPaymentsScreenComponent);
