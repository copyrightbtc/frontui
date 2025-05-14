import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { ArrowBackIcon } from 'src/assets/images/ArrowBackIcon';
import { IconButton, Button } from '@mui/material';
import { TabPanelMobile } from 'src/components/TabPanelMobile';
import { QRCode, NoResultData } from 'src/components';
import { TabPanelUnderlines } from 'src/components';
import { 
  alertPush,
  commissionsFetch,
  invitesFetch,
  invitesOverviewFetch,
  RootState,
  selectCommissions,
  selectCommissionsFetchLoading,
  selectCommissionsFirstElemIndex,
  selectCommissionsLastElemIndex,
  selectCommissionsNextPageExists,
  selectInvites,
  selectInvitesFetchLoading,
  selectInvitesFirstElemIndex,
  selectInvitesLastElemIndex,
  selectInvitesNextPageExists,
  selectOverview,
  selectOverviewLoading,
  selectUserInfo,
} from "src/modules";

import { useCommissionsFetch, useInvitesFetch, useOverview, useDocumentTitle } from "src/hooks";
 
import { Pagination } from "src/components";
import { FillSpinner } from "react-spinners-kit"; 
import { copyToClipboard, localeDate } from "src/helpers";

import step1 from 'src/assets/images/invites/refferal-step1.svg';
import step2 from 'src/assets/images/invites/refferal-step2.svg';
import step3 from 'src/assets/images/invites/refferal-step3.svg';

export const InvitesScreenMobile: FC = (): ReactElement => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  useDocumentTitle('Referral program');
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const user = useSelector(selectUserInfo);
  const link = `${window.location.origin}/signup?referral_uid=${user.uid}`;

  const overview = useSelector(selectOverview);
  const overviewFetching = useSelector(selectOverviewLoading);
  useOverview();

  const commissions = useSelector(selectCommissions);
  const commissionsFetching = useSelector(selectCommissionsFetchLoading);
  const [currentCommissionsPageIndex, setCurrentCommissionsPageIndex] = React.useState(0);
  const commissionsFirstElemIndex = useSelector((state: RootState) => selectCommissionsFirstElemIndex(state, 25));
  const commissionsLastElemIndex = useSelector((state: RootState) => selectCommissionsLastElemIndex(state, 25));
  const commissionsNextPageExists = useSelector(selectCommissionsNextPageExists); 
  useCommissionsFetch(currentCommissionsPageIndex + 1, 25);

  const invites = useSelector(selectInvites);
  const invitesFetching = useSelector(selectInvitesFetchLoading);
  const [currentInvitesPageIndex, setCurrentInvitesPageIndex] = React.useState(0);
  const invitesFirstElemIndex = useSelector((state: RootState) => selectInvitesFirstElemIndex(state, 25));
  const invitesLastElemIndex = useSelector((state: RootState) => selectInvitesLastElemIndex(state, 25));
  const invitesNextPageExists = useSelector(selectInvitesNextPageExists); 
  useInvitesFetch(currentInvitesPageIndex + 1, 25);

  const onClickCommissionsPrevPage = () => {
    setCurrentCommissionsPageIndex(currentCommissionsPageIndex - 1);
  };

  const onClickCommissionsNextPage = () => {
    setCurrentCommissionsPageIndex(currentCommissionsPageIndex + 1);
  };

  const onClickInvitesPrevPage = () => { 
    setCurrentInvitesPageIndex(currentInvitesPageIndex - 1);
  };

  const onClickInvitesNextPage = () => {
    setCurrentInvitesPageIndex(currentInvitesPageIndex + 1);
  };

  const [commissionsData, setCommissionsData] = useState(commissions);
  const [invitesData, setInvitesData] = useState(invites);
  const [overviewData, setOverviewData] = useState(overview); 

  useEffect(() => {
    dispatch(commissionsFetch({ page: 1, limit: 25 })); 
    dispatch(invitesFetch({ page: 1, limit: 25 })); 
    dispatch(invitesOverviewFetch()); 
  }, [dispatch]);

  useEffect(() => {
		setCommissionsData(commissions); 
	}, [commissions]); 

  useEffect(() => {
		setInvitesData(invites); 
	}, [invites]); 

  useEffect(() => {
		setOverviewData(overview); 
	}, [overview]); 

  const emptyData = () => {
    return commissionsData.length === 0 ? (
      <NoResultData class="themes"/>
    ) : null;
  };
  const emptyDataInvite = () => {
    return invitesData.length === 0 ? (
      <NoResultData class="themes"/>
    ) : null;
  };

  const renderCommissionsPagination = () => {
		return commissionsData.length > 0 ? (
            <React.Fragment> 
                <Pagination
                    firstElemIndex={commissionsFirstElemIndex}
                    lastElemIndex={commissionsLastElemIndex}
                    page={currentCommissionsPageIndex}
                    nextPageExists={commissionsNextPageExists}
                    onClickPrevPage={onClickCommissionsPrevPage}
                    onClickNextPage={onClickCommissionsNextPage}
                />
            </React.Fragment>
		) : null;
	};

  const renderInvitesPagination = () => {
		return invitesData.length > 0 ? (
            <React.Fragment> 
                <Pagination
                    firstElemIndex={invitesFirstElemIndex}
                    lastElemIndex={invitesLastElemIndex}
                    page={currentInvitesPageIndex}
                    nextPageExists={invitesNextPageExists}
                    onClickPrevPage={onClickInvitesPrevPage}
                    onClickNextPage={onClickInvitesNextPage}
                />
            </React.Fragment>
		) : null;
	};
 
  const renderInviteeList = () => {
    if (invitesFetching) return null;

    return invitesFetching ? (
			<div className="empty-loader"><FillSpinner size={19} color="var(--color-accent)"/></div>
		) : (
      <React.Fragment>
        <div className="invite-mobile-table">
              {invitesData.map((invited, i) => (
                <div className="invite-mobile-table__row" key={i}>
                  <div className="cell invitee">
                    <span>{invited.email}</span>
                    {invited.uid}
                  </div>
                  <div className="cell">
                    <div className="total"><span>{formatMessage({ id: 'page.body.invite.intotalusdt'})}:</span>{invited.total}</div>
                    <div className="date">{localeDate(invited.created_at, 'date')}<span>{localeDate(invited.created_at, 'time')}</span></div>
                  </div>
                </div>
              ))}
            {emptyDataInvite()}
        </div>
        {renderInvitesPagination()}
      </React.Fragment>
    )
  };

  const renderCommissionHistory = () => {
    if (commissionsFetching) return null;

    return commissionsFetching ? (
			<div className="empty-loader"><FillSpinner size={19} color="var(--color-accent)"/></div>
		) : (
      <React.Fragment>
        <div className="invite-mobile-table">
          {commissionsData.map((commission, i) => (
            <div className="invite-mobile-table__row" key={i}>
              <div className="cell">
                <div className="amounts">{`${commission.amount} ${commission.currency.toUpperCase()}`}</div> 
                <div className="amounts"><span>{formatMessage({ id: 'page.body.invite.intotalusdt'})}:</span>{commission.total}</div> 
              </div>
              <div className="cell">
                <div className="uid">{commission.friend_uid}</div>
                <div className="date">{localeDate(commission.created_at, 'date')}<span>{localeDate(commission.created_at, 'time')}</span></div>
              </div>
            </div>
          ))}
          {emptyData()}
        </div>
        {renderCommissionsPagination()} 
      </React.Fragment>                 
    )
  }; 

  const renderTabs = () => {
    return [
        {
            content: currentTabIndex === 0 ? renderInviteeList() : null,
            label: formatMessage({ id: 'page.body.invite.invitee_list'}),
        },
        {
            content: currentTabIndex === 1 ? renderCommissionHistory() : null,
            label: formatMessage({ id: 'page.body.invite.commission_history'}),
        }
      ];
  };

  const copyUID = () => {
    copyToClipboard(user.uid);
    dispatch(alertPush({ message: ['success.invite.copied.uid'], type: 'success'}))
  };

  const onCopy = (link?: string) => {
    copyToClipboard(link);
    dispatch(alertPush({message: ['success.invite.copied.link'], type: 'success'}));
  };
 
  const renderInfo = () => {
    if (overviewFetching) return null;

    return (
      <div className="invite-mobile__info"> 
        <div className="invite-mobile__info__head">
          <h1>{formatMessage({ id: 'page.body.invite.title'})}</h1>
          <p>{formatMessage({ id: 'page.body.invite.title1'})}</p>
          <p>{formatMessage({ id: 'page.body.invite.title2'})}</p>
          <h6>{formatMessage({ id: 'page.body.invite.default_link.share'})}</h6>
        </div>
        <div className="invite-mobile__info__body">
          <div className="qrcode"> 
            <QRCode dimensions={206} data={link}/> 
          </div> 
          <fieldset className="invite-mobile-address-input">
              <div className='invite-mobile-address-input__adress'>{link}</div>
              <Button 
                  onClick={() => onCopy(link)}
                  className='invite-mobile-address-input__copy'
              >
                  {formatMessage({ id: 'page.body.wallets.tabs.deposit.copy.button.tap'})}
              </Button>
          </fieldset> 

          <div className="invite-mobile__info__body__bottom">
            <div className="row"> 
              <span>{formatMessage({ id: 'page.body.invite.referral_uid'})}</span> 
              <div className="copy-uid">
                  <p>{user.uid}</p>
                  <IconButton
                      onClick={copyUID}
                      className="copy_button"
                  >
                      <CopyIcon className="copy-iconprop"/> 
                  </IconButton>
              </div> 
            </div>
            <div className="row">
              <span>{formatMessage({ id: 'page.body.invite.comissions'})}</span>
              20%
            </div>
            <div className="row">
              <span>{formatMessage({ id: 'page.body.invite.number_invitations'})}</span>
              {overviewData.invites === 0 ? formatMessage({ id: 'page.body.invite.number_invitations.empty'}) : overviewData.invites}
            </div>
            <div className="row">
              <span>{formatMessage({ id: 'page.body.invite.total'})}</span>
              {overviewData.total} USDT
            </div>
          </div>
        </div>
        <h2 className="tips">{formatMessage({ id: 'page.body.invite.tips'})}</h2>
        <div className="invite-mobile__steps"> 
          <div className="invite-mobile__steps__block">
            <img alt="step1" src={step1} />
            <span>{formatMessage({ id: 'page.body.invite.step1'})}</span>
          </div>
          <div className="invite-mobile__steps__block">
            <img alt="step1" src={step2} />
            <span>{formatMessage({ id: 'page.body.invite.step2'})}</span>
          </div>
          <div className="invite-mobile__steps__block">
            <img alt="step1" src={step3} />
            <span>{formatMessage({ id: 'page.body.invite.step3'})}</span>
          </div> 
        </div> 
      </div>
    )
  };

  const goBack = () => {
    window.history.back();
  }

  return (
    <div className="invite-mobile">
      <div className="invite-mobile--top__close">
          <IconButton 
              onClick={goBack}
              sx={{
                  width: '40px',
                  height: '40px',
                  color: 'var(--color-light-grey)',
                  '&:hover': {
                      color: 'var(--color-accent)'
                  }
              }}
          >
              <ArrowBackIcon /> 
          </IconButton>
          <p>{formatMessage({ id: 'page.body.profile.content.back' })}</p>
      </div>
      {renderInfo()}
      <h2>{formatMessage({ id: 'page.body.invite.invitee.reawards'})}</h2>
      <TabPanelMobile
        panels={renderTabs()}
        currentTabs={currentTabIndex}
        onCurrentTabChange={setCurrentTabIndex}
        borders={true}
      />
    </div>
  );
}
