import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { Sidebar, ProfileHeader } from "../../containers";
import { CopyIcon } from 'src/assets/images/CopyIcon';
import { IconButton, Button } from '@mui/material';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { QRCode, NoResultData } from '../../components';
import { TabPanelUnderlines } from '../../components';
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
} from "../../modules";

import { useCommissionsFetch, useInvitesFetch, useOverview, useDocumentTitle } from "../../hooks";
 
import { Pagination } from "../../components";
import { FillSpinner } from "react-spinners-kit"; 
import { copyToClipboard, truncateMiddle, localeDate } from "../../helpers";

import step1 from '../../assets/images/invites/refferal-step1.svg';
import step2 from '../../assets/images/invites/refferal-step2.svg';
import step3 from '../../assets/images/invites/refferal-step3.svg';

export const InvitesScreen: FC = (): ReactElement => {
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
 
  const renderCommissionHistory = () => {
    if (commissionsFetching) return null;

    return commissionsFetching ? (
			<div className="empty-loader"><FillSpinner size={19} color="var(--color-accent)"/></div>
		) : (
      <React.Fragment>
        <div className="table-main-wrapper">
          <table className="table-main">
            <thead> 
              <tr>
                <th>UID</th>
                <th>{formatMessage({ id: 'page.body.invite.type'})}</th>
                <th>{formatMessage({ id: 'page.body.invite.amount'})}</th>
                <th>{formatMessage({ id: 'page.body.invite.totalusdt'})}</th>
                <th className="right">{formatMessage({ id: 'page.body.invite.date'})}</th>
              </tr>
            </thead>
            <tbody>
              {commissionsData.map((commission, i) => (
                <tr key={i}>
                  <td>{commission.friend_uid}</td>
                  <td>{commission.reference_type}</td>
                  <td>{`${commission.amount} ${commission.currency.toUpperCase()}`}</td>
                  <td>{commission.total}</td>
                  <td className="right date-split">
                    <div className="date">{localeDate(commission.created_at, 'date')}</div>
                    <div className="time">{localeDate(commission.created_at, 'time')}</div>
                  </td>
                </tr>
              ))}
            </tbody>
            {emptyData()}
          </table>
        </div>
        {renderCommissionsPagination()} 
      </React.Fragment>                 
    )
  }

  const renderInviteeList = () => {
    if (invitesFetching) return null;

    return invitesFetching ? (
			<div className="empty-loader"><FillSpinner size={19} color="var(--color-accent)"/></div>
		) : (
      <React.Fragment>
        <div className="table-main-wrapper">
          <table className="table-main">
            <thead> 
              <tr>
                <th>{formatMessage({ id: 'page.body.invite.email'})}</th>
                <th>UID</th>
                <th>{formatMessage({ id: 'page.body.invite.totalusdt'})}</th>
                <th className="right">{formatMessage({ id: 'page.body.invite.date'})}</th>
              </tr>
            </thead>
            <tbody>
              {invitesData.map((invited, i) => (
                <tr key={i}>
                  <td>{invited.email}</td>
                  <td>{invited.uid}</td>
                  <td>{invited.total}</td>
                  <td className="right date-split">
                    <div className="date">{localeDate(invited.created_at, 'date')}</div>
                    <div className="time">{localeDate(invited.created_at, 'time')}</div>
                  </td>
                </tr>
              ))}
            </tbody>
            {emptyDataInvite()}
          </table>
        </div>
        {renderInvitesPagination()}
      </React.Fragment>
    )
  };
 
  const listButton = formatMessage({ id: 'page.body.invite.invitee_list'});
  const historyButton = formatMessage({ id: 'page.body.invite.commission_history'});
  const tabsData = [
    {
      label: listButton,
      content: renderInviteeList(),
    },
    {
      label: historyButton,
      content: renderCommissionHistory(),
    },
  ];
  
  const renderTabs = () => {

    return (
      <TabPanelUnderlines
        panels={tabsData}
        currentTabIndex={currentTabIndex}
        onCurrentTabChange={setCurrentTabIndex}
      />
    )
  };

  const copyUID = () => {
    copyToClipboard(user.uid);
    dispatch(alertPush({ message: ['success.invite.copied.uid'], type: 'success'}))
  };

  const copyLink = () => {
    copyToClipboard(link);
    dispatch(alertPush({ message: ['success.invite.copied.link'], type: 'success'}))
  };
 
  const renderInfo = () => {
    if (overviewFetching) return null;

    return (
      <div className="invite-screen__info"> 
        <div className="invite-screen__info__head">
          <h1>{formatMessage({ id: 'page.body.invite.title'})}</h1>
          <p>{formatMessage({ id: 'page.body.invite.title1'})}</p>
          <p>{formatMessage({ id: 'page.body.invite.title2'})}</p>
        </div>
        <div className="invite-screen__info__body">
          <div className="invite-screen__info__body__left"> 
            <div className="invite-screen__info__body__left__text"> 
                <h6>{formatMessage({ id: 'page.body.invite.default_link'})}</h6>
                <p>{formatMessage({ id: 'page.body.invite.invite_friends'})}</p>
                <div className="copy-field">
                    <div className="copy-field__text">{truncateMiddle(link, 38)}</div> 
                    <IconButton
                        onClick={copyLink}
                        className="copy_button"
                    >
                        <CopyIcon className="copy-iconprop"/> 
                    </IconButton>
                </div>
              </div> 
              <div className="qrcode"> 
                <QRCode dimensions={145} data={link}/> 
              </div> 
          </div>

          <div className="invite-screen__info__body__right">
            <div className="invite-screen__info__body__right__text"> 
              <p>{formatMessage({ id: 'page.body.invite.referral_uid'})}</p> 
              <div className="copy-field">
                  <div className="copy-field__text">{user.uid}</div>
                  <IconButton
                      onClick={copyUID}
                      className="copy_button"
                  >
                      <CopyIcon className="copy-iconprop"/> 
                  </IconButton>
              </div> 
            </div>
            <div className="invite-screen__info__body__right__text">
              <p>{formatMessage({ id: 'page.body.invite.comissions'})}</p>
              <span>20%</span>
            </div>
            <div className="invite-screen__info__body__right__text">
              <p>{formatMessage({ id: 'page.body.invite.number_invitations'})}</p>
              <span>{overviewData.invites === 0 ? formatMessage({ id: 'page.body.invite.number_invitations.empty'}) : overviewData.invites}</span>
            </div>
            <div className="invite-screen__info__body__right__text">
              <p>{formatMessage({ id: 'page.body.invite.total'})}</p>
              <span>{overviewData.total} USDT</span>
            </div>
            <div className="link_arrow-wrapper">
              <Button
                  onClick={() => document.getElementById('refreward')?.scrollIntoView({behavior: 'smooth'})}
                  className="link_arrow"
                  sx={{
                      color: '#fff',
                      '&:hover': {
                          color: 'var(--accent)'
                      }
                  }}
              >   
                  {formatMessage({ id: 'page.body.invite.invitee.details' })}
                  <ChevronIcon /> 
              </Button>
            </div> 
          </div>
        </div>
        <h2 className="tips">{formatMessage({ id: 'page.body.invite.tips'})}</h2>
        <div className="invite-screen__steps"> 
          <div className="invite-screen__steps__block">
            <img alt="step1" src={step1} />
            <span>{formatMessage({ id: 'page.body.invite.step1'})}</span>
          </div>
          <div className="invite-screen__steps__block">
            <img alt="step1" src={step2} />
            <span>{formatMessage({ id: 'page.body.invite.step2'})}</span>
          </div>
          <div className="invite-screen__steps__block">
            <img alt="step1" src={step3} />
            <span>{formatMessage({ id: 'page.body.invite.step3'})}</span>
          </div> 
        </div> 
      </div>
    )
  };

  return (
    <div className="accountpage-wrapper">
      <Sidebar />
      <div className="accountpage-wrapper__right">
        <ProfileHeader />
        <div className="invite-screen">
          {renderInfo()}
          <h2 id="refreward">{formatMessage({ id: 'page.body.invite.invitee.reawards'})}</h2>
          {renderTabs()}
        </div>
      </div>
    </div>
  )
}
