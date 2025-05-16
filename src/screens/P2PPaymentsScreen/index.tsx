import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from '@mui/material';
import { useIntl } from "react-intl";
import { DeleteIcon } from "src/assets/images/DeleteIcon";
import { BigPlusIcon } from "src/assets/images/BigPlusIcon";
import { OverlayTrigger } from 'react-bootstrap';
import { ReportIcon } from 'src/assets/images/ReportIcon';
import { IconButton } from '@mui/material';
import { VerifiedIcon } from 'src/assets/images/VerifiedIcon';
import { TabPanelSliding } from 'src/components/TabPanelUnderlines/TabPanelSliding';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { SetNickIcon } from 'src/assets/images/SetNickIcon';
import { EstimatedValueAvail } from 'src/containers/Wallets/EstimatedValue/EstimatedValueAvail';
import { formatNumber } from "../../components/P2PTrading/Utils";
import { usePaymentsFetch } from "../../hooks";
import { 
  AddPayment, 
  DeletePayment,
  Tooltip,
} from "../../components";
import { AdvertisementMenu, HeaderTrading } from "../../containers";
import { 
  paymentsAddFetch, 
  paymentsDeleteFetch, 
  paymentsFetch,
  selectPayments, 
  selectPaymentsFetchLoading,
  RootState,
  selectUserInfo,
  usernameFetch,
} from "../../modules";
import { setDocumentTitle, localeDate } from '../../helpers';
import { CSSTransition } from "react-transition-group";
import { FillSpinner } from "react-spinners-kit";
import { Payment } from "../../modules/user/payments/types";
import { NoResultData } from 'src/components';
import { Feedbacks } from "../AdvertiserScreen/Feedbacks";
import { advertiserFetch } from "../../modules/public/advertiser";
import { SetUsername } from '../../components/SetUsername';
import { truncateEmail } from '../../helpers';

export const P2PPaymentsScreen = () => {
  const { formatMessage } = useIntl();
 
  useEffect(() => {
    setDocumentTitle(formatMessage({id: 'page.body.p2p.advertisement.content.payments'}))
  }, []);
  const { uid } = useParams<{ uid: string }>();
  const paymLimits = 20;

  const [addModal, setAddModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [showUsernameModal, setShowUsernameModal] = React.useState(false);

  const [paymentChoose, setPaymentChoose] = React.useState({} as Payment);
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const payments = useSelector(selectPayments);
  const paymentsFetching = useSelector(selectPaymentsFetchLoading);
  const [currentPaymentsPageIndex, setCurrentPaymentsPageIndex] = React.useState(0);
  usePaymentsFetch(currentPaymentsPageIndex + 1, paymLimits)

  const onClickPaymentsPrevPage = () => {
    setCurrentPaymentsPageIndex(currentPaymentsPageIndex - 1);
  };

  const onClickPaymentsNextPage = () => {
    setCurrentPaymentsPageIndex(currentPaymentsPageIndex + 1);
  };

  const user = useSelector(selectUserInfo);

  const [paymentsData, setPaymentsData] = useState(payments);

  const dispatch = useDispatch();

  useEffect(() => {
    if (uid) {
        dispatch(advertiserFetch(uid));
      }
  }, [uid]);

  useEffect(() => {
    dispatch(paymentsFetch({ page: 1, limit: paymLimits }));
  }, [dispatch]);

  useEffect(() => {
		setPaymentsData(payments); 
	}, [payments]); 

  const renderTable = () => {
    return paymentsData.length <= 0 ? (
        <NoResultData class="themes" title={formatMessage({id: 'page.body.p2p.payments.nopayments'})}/>
    ) : (
      <React.Fragment>
        {paymentsData.map((payment, index) => (
          <div key={index} className="payments-list__block">
            <div key={index} className="payments-list__block__head">
              <h5>{formatMessage({id: `page.body.p2p.payments.type.${payment.payment_type}`})}</h5>
              <div className="payments-screen-delete" onClick={() => toggleDeleteModal(payment)}>
              <Button
                  className="little-button themes red"
                  onClick={() => toggleDeleteModal(payment)}
              >
                {formatMessage({id: 'page.body.p2p.payments.delete'})}
                <DeleteIcon className="delete-icon"/>
              </Button>
              </div>
            </div>
            <div className="payments-list__block__body">
              <div className="cell">
                <div className="name">
                  {formatMessage({id: 'page.body.p2p.payments.account_name'})}
                </div>
                <div className="detail">
                  {payment.account_name}
                </div>
              </div>
              {Object.keys(payment.data).map((key, index) => (
                <div key={index} className="cell">
                  <div className="name">
                    {formatMessage({id: `page.body.p2p.payments.${key}`})}
                  </div>
                  <div className="detail">
                    {payment.data[key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </React.Fragment>              
    )
  }

  const renderPayments = () => {
    return paymentsFetching ? (
			<div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>
		) : 
    <div className="payments-list">
      <div className="payments-list__header">
        <div className="payments-list__header__left">
          <h2>{formatMessage({id: 'page.body.p2p.payments.title'})}</h2>
          <p>{formatMessage({id: 'page.body.p2p.payments.description'})}</p>
        </div>
        <div className="payments-list__header__right">
          {paymentsData.length >= paymLimits ? (
              <Button
                className="small-button themes black"
                disabled={true}
              >
                <BigPlusIcon className="bigplus"/>
                {formatMessage({id: 'page.body.p2p.payments.add'})}
              </Button>
          ) : (
            <Button
              className="small-button themes black"
              onClick={toggleAddModal}
            >
              <BigPlusIcon className="bigplus"/>
              {formatMessage({id: 'page.body.p2p.payments.add'})}
            </Button>
          )}
          {paymentsData.length >= paymLimits && (
            <OverlayTrigger 
              placement="auto"
              delay={{ show: 250, hide: 300 }} 
              overlay={<Tooltip className="themes" title="page.body.p2p.payments.add.reachedout" />}>
                <div><ReportIcon className="report-icon themes"/></div>
            </OverlayTrigger>
          )}
        </div>
      </div>
      {renderTable()}
    </div>
  }

  const handleAddPayment = ({ payment_type, account_name, data }) => {
    dispatch(paymentsAddFetch({ 
      payment_type,
      account_name,
      data,
    }))
    dispatch(paymentsFetch({ page: 1, limit: paymLimits }));
    toggleAddModal()
  }

  const handleDeletePayment = (id) => {
    dispatch(paymentsDeleteFetch({id}))
    dispatch(paymentsFetch({ page: 1, limit: paymLimits }));
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

  const toggleDeleteModalClose = () => {
    setDeleteModal(!deleteModal)
  }

  const advertiser = useSelector((state: RootState) => state.public.advertiser);
  const positiveFeedbackCount = advertiser.advertiser?.positive_feedback_count ?? 0;
  const negativeFeedbackCount = advertiser.advertiser?.negative_feedback_count ?? 0;
  const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);
  const positiveFeedbackRate = positiveFeedbackCount > 0 ? Math.round((positiveFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;

  const totalBuyCount = advertiser.advertiser?.total_buy_trades_count ?? 0;
  const totalSellCount = advertiser.advertiser?.total_sell_trades_count ?? 0;
  const totalTradeCount = totalBuyCount + totalSellCount;

  const avtChar = user.username ? user.username.charAt(0).toUpperCase() : 'A';

  const tabsData = [
    {
      label: formatMessage({id: 'page.body.p2p.payments.title.button'}),
      content: renderPayments(),
    },
    {
      label: <React.Fragment>{formatMessage({id: 'page.body.p2p.advertisement.content.feedbacks' })} ({totalFeedback})</React.Fragment>,
      content: <Feedbacks />,
    },
  ];

  const handleSetUsername = payload => {
    if (payload) {
        dispatch(usernameFetch(payload));
    }
    window.location.reload();
  };

  return (
    <div className="p2pscreen">
      <HeaderTrading />
      <AdvertisementMenu />
      <div className="advertiser-screen">
          <div className="p2pscreen__userinfo">
              <div className="p2pscreen__userinfo__wrapper">
                  <div className="p2pscreen__userinfo__head">
                      <div className="p2pscreen__userinfo__head__left">
                          <div className="avatar">{avtChar}</div> 
                          <div className="row">
                              <span className="email">
                                  {truncateEmail(user.email)}
                                  { user.level === 3 ? ( 
                                      <div className="verified">
                                          <OverlayTrigger 
                                              placement="auto"
                                              delay={{ show: 250, hide: 300 }} 
                                              overlay={<Tooltip className="themes" title="page.body.profile.header.account.verifieduser" />}>
                                                  <div><VerifiedIcon className='ver-icon'/></div>
                                          </OverlayTrigger>
                                      </div>
                                      ) : (
                                      <div className="unverified">
                                          <OverlayTrigger 
                                              placement="auto"
                                              delay={{ show: 250, hide: 300 }} 
                                              overlay={<Tooltip className="themes" title="page.body.profile.header.account.unverifieduser" />}>
                                                  <div><VerifiedIcon className='ver-icon'/></div>
                                          </OverlayTrigger>
                                      </div>
                                  )} 
                              </span>
                              <span className="username">
                                  {user.username ? user.username : formatMessage({id: 'page.body.profile.username.anonymous'})}
                                  {!user.username && <OverlayTrigger 
                                      placement="auto"
                                      delay={{ show: 250, hide: 300 }} 
                                      overlay={<Tooltip className="themes" title="page.body.profile.username.title" />}>
                                      <IconButton
                                          onClick={() => setShowUsernameModal(!showUsernameModal)} 
                                          sx={{
                                              width: '34px',
                                              height: '34px',
                                              marginLeft: '3px',
                                              color: 'var(--color-accent)',
                                              '&:hover': {
                                                  color: 'var(--color-accent)'
                                              }
                                          }}
                                      >
                                          <div><SetNickIcon /></div>
                                      </IconButton>
                                  </OverlayTrigger>}
                              </span>
                              {advertiser.advertiser?.first_trade_at ? (
                                  <div className="created_at">
                                      {formatMessage({ id: "page.body.p2p.advertisement.content.first_trade" })}
                                      {localeDate(advertiser.advertiser?.first_trade_at, "date")}
                                  </div>
                              ) : null} 
                          </div>
                      </div>
                      <div className="p2pscreen__userinfo__head__right">
                          <EstimatedValueAvail />
                      </div>
                  </div> 
                  <div className="p2pscreen__userinfo__body">
                      <div className="p2pscreen__userinfo__body__block">
                          <h5>
                              {formatMessage({ id: "page.body.p2p.advertisement.content.all_trade" })}
                              <OverlayTrigger 
                                  placement="auto"
                                  delay={{ show: 250, hide: 300 }} 
                                  overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.alltrades" />}>
                                      <div className="tip_icon_container themes">
                                          <InfoIcon />
                                      </div>
                              </OverlayTrigger>
                          </h5>
                          <span>{totalTradeCount} {formatMessage({ id: "page.body.p2p.advertisement.content.time" })}</span>
                          <div className="bootom-stat">
                              <p className="success">{formatMessage({ id: "page.body.p2p.advertisement.content.buy" })} {formatNumber(totalBuyCount)}</p>/
                              <p className="danger">{formatMessage({ id: "page.body.p2p.advertisement.content.sell" })} {formatNumber(totalSellCount)}</p>
                          </div>
                      </div>
                      <div className="p2pscreen__userinfo__body__block">
                          <h5>
                              {formatMessage({ id: "page.body.p2p.advertisement.content.trades" })}
                              <OverlayTrigger 
                                  placement="auto"
                                  delay={{ show: 250, hide: 300 }} 
                                  overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.30dtrades" />}>
                                      <div className="tip_icon_container themes">
                                          <InfoIcon />
                                      </div>
                              </OverlayTrigger>
                          </h5>
                          <span>
                              {formatNumber(advertiser.advertiser?.trades_count_30d ?? 0)} {formatMessage({ id: "page.body.p2p.advertisement.content.time" })}
                          </span>
                      </div>
                      <div className="p2pscreen__userinfo__body__block">
                          <h5>
                              {formatMessage({ id: "page.body.p2p.advertisement.content.success_rate" })}
                              <OverlayTrigger 
                                  placement="auto"
                                  delay={{ show: 250, hide: 300 }} 
                                  overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.30dcompletion" />}>
                                      <div className="tip_icon_container themes">
                                          <InfoIcon />
                                      </div>
                              </OverlayTrigger>
                          </h5>
                          <span>
                              {advertiser.advertiser?.success_rate_30d ?? 0} %
                          </span>
                      </div>
                      <div className="p2pscreen__userinfo__body__block">
                          <h5>
                              {formatMessage({ id: "page.body.p2p.advertisement.content.positive_feedbacks" })}
                              <OverlayTrigger 
                                  placement="auto"
                                  delay={{ show: 250, hide: 300 }} 
                                  overlay={<Tooltip className="themes" title="page.body.p2p.advertisement.content.descr.feedbacks" />}>
                                      <div className="tip_icon_container themes">
                                          <InfoIcon />
                                      </div>
                              </OverlayTrigger>
                          </h5>
                          <span>{positiveFeedbackRate}% ({formatNumber(totalFeedback)})</span>
                          <div className="bootom-stat">
                              <p className="success">
                                  {formatMessage({ id: "page.body.p2p.advertisement.content.positive" })}
                                  {advertiser.advertiser?.positive_feedback_count ?? 0}
                              </p> / 
                              <p className="danger">
                                  {formatMessage({ id: "page.body.p2p.advertisement.content.negative" })} 
                                  {advertiser.advertiser?.negative_feedback_count ?? 0}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
              <CSSTransition
                  in={showUsernameModal}
                  timeout={{
                      enter: 100,
                      exit: 400
                    }}
                  unmountOnExit
              >
                  <div className="themes modal-window"> 
                      <SetUsername
                          handleSetUsername={handleSetUsername}
                          title={formatMessage({ id: 'page.body.profile.username.title' })}
                          closeModal={() => setShowUsernameModal(!showUsernameModal)}
                      /> 
                  </div>
              </CSSTransition>
          </div>
      </div>
      
        <div className="p2pscreen__wrapper">
          <CSSTransition
            in={addModal}
            timeout={{
              enter: 100,
              exit: 400
            }}
            unmountOnExit
          >
            <div className="themes modal-window"> 
              <AddPayment
                handleAddPayment={handleAddPayment}
                title={formatMessage({id: 'page.body.p2p.payments.modal.add.title'})}
                closeModal={toggleAddModal}
              /> 
            </div>
          </CSSTransition>
          <CSSTransition
            in={deleteModal}
            appear={true}
            timeout={{
              enter: 100,
              exit: 400
            }}
            unmountOnExit
          >
            <div className="themes modal-window"> 
              <DeletePayment
                handleDeletePayment={handleDeletePayment}
                title={formatMessage({id: 'page.body.p2p.payments.modal.delete.title'})}
                closeModal={toggleDeleteModalClose}
                payment={paymentChoose}
              />
            </div>
          </CSSTransition>
          <TabPanelSliding
            panels={tabsData}
            currentTabIndex={currentTabIndex}
            onCurrentTabChange={setCurrentTabIndex}
            themes={true}
            borders={true}
          />
        </div> 
    </div>
  )
}
