import * as React from 'react';

import {
    Subheader,
} from '../../components';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Pagination } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { alertPush, commissionsFetch, invitesFetch, invitesOverviewFetch, RootState, selectCommissions, selectCommissionsFetchLoading, selectCommissionsFirstElemIndex, selectCommissionsLastElemIndex, selectCommissionsNextPageExists, selectInvites, selectInvitesFetchLoading, selectInvitesFirstElemIndex, selectInvitesLastElemIndex, selectInvitesNextPageExists, selectOverview, selectOverviewLoading, selectUserInfo } from '../../../modules';
import { useCommissionsFetch, useInvitesFetch, useOverview } from '../../../hooks';
import { useEffect, useState } from 'react';
import { CopyIcon } from '../../../assets/images/invites/CopyIcon';
import { copy } from '../../../helpers';

const ProfileInviteMobileComponent: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const [tab, setTab] = useState(intl.formatMessage({ id: 'page.body.invite.info'}))
  const user = useSelector(selectUserInfo);
  const link = `${window.location.origin}/signup?referral_uid=${user.uid}`

  const overview = useSelector(selectOverview);
  const overviewFetching = useSelector(selectOverviewLoading);
  useOverview()

  const commissions = useSelector(selectCommissions);
  const commissionsFetching = useSelector(selectCommissionsFetchLoading);
  const [currentCommissionsPageIndex, setCurrentCommissionsPageIndex] = React.useState(0);
  const commissionsFirstElemIndex = useSelector((state: RootState) => selectCommissionsFirstElemIndex(state, 25));
  const commissionsLastElemIndex = useSelector((state: RootState) => selectCommissionsLastElemIndex(state, 25));
  const commissionsNextPageExists = useSelector(selectCommissionsNextPageExists); 
  useCommissionsFetch(currentCommissionsPageIndex + 1, 25)

  const invites = useSelector(selectInvites);
  const invitesFetching = useSelector(selectInvitesFetchLoading)
  const [currentInvitesPageIndex, setCurrentInvitesPageIndex] = React.useState(0);
  const invitesFirstElemIndex = useSelector((state: RootState) => selectInvitesFirstElemIndex(state, 25));
  const invitesLastElemIndex = useSelector((state: RootState) => selectInvitesLastElemIndex(state, 25));
  const invitesNextPageExists = useSelector(selectInvitesNextPageExists); 
  useInvitesFetch(currentInvitesPageIndex + 1, 25)

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

  const dispatch = useDispatch();

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

  const copyUID = () => {
    copy(user.uid)
    dispatch(alertPush({ message: ['success.invite.copied.uid'], type: 'success'}))
  }

  const copyLink = () => {
    copy(link)
    dispatch(alertPush({ message: ['success.invite.copied.link'], type: 'success'}))
  }

  const renderTabs = () => {
    const tabs = [intl.formatMessage({ id: 'page.body.invite.info'}), intl.formatMessage({ id: 'page.body.invite.invitee_list'}), intl.formatMessage({ id: 'page.body.invite.commission_history'})];

    return (
      <div className="invite-screen-tab">
        {tabs.map((item, i) => (
          <div
            key={i}
            className={`invite-screen-tab-item ${tab === item ? 'invite-screen-tab-item-active' : ''}`}
            onClick={() => setTab(item)}
          >
            {item}
          </div>
        ))}
      </div>
    )
  }

  const renderInfo = () => {
    if (overviewFetching) return null

    return (
      <div>
        <div className="invite-screen-box-mobile">
          <div className='invite-screen-box-mobile-title'>{intl.formatMessage({ id: 'page.body.invite.information'})}</div>
          <div className="invite-screen-box-mobile-info">
            <div className="invite-screen-box-mobile-info-item">
              <div className="invite-screen-box-mobile-info-item-label">{intl.formatMessage({ id: 'page.body.invite.number_invitations'})}:</div>
              <div className="invite-screen-box-mobile-info-item-value">{overviewData.invites}</div>
            </div>
            <div className="invite-screen-box-mobile-info-item">
              <div className="invite-screen-box-mobile-info-item-label">{intl.formatMessage({ id: 'page.body.invite.total'})}:</div>
              <div className="invite-screen-box-mobile-info-item-value">{overviewData.total}</div>
            </div>
          </div>
        </div>
        <div className="invite-screen-box-mobile">
          <div className='invite-screen-box-mobile-title'>{intl.formatMessage({ id: 'page.body.invite.how_to_invite'})}</div>
          <div className="invite-screen-box-mobile-box">
            <div className="invite-screen-box-mobile-box-label">{intl.formatMessage({ id: 'page.body.invite.referral_uid'})}</div>
            <div className="invite-screen-box-mobile-box-value"  onClick={copyUID}>
              {user.uid}
              <CopyIcon className='invite-screen-copy' />
            </div>
          </div>
          <div className="invite-screen-box-mobile-box">
            <div className="invite-screen-box-mobile-box-label">{intl.formatMessage({ id: 'page.body.invite.default_link'})}</div>
            <div className="invite-screen-box-mobile-box-value" onClick={copyLink}>
              {link.slice(0, 20)}...
              <CopyIcon className='invite-screen-copy' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderInvitesTab = () => (
    <div>
      {!invitesFetching && (
        <div>
          {invitesData.map((invite, index) => (
            <div key={index} className='invite-screen-box-mobile'>
              <div className='invite-screen-box-mobile-date'>
                {invite.created_at}
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.email'})}:</div>
                <div className='invite-screen-box-mobile-row-value'>{invite.email}</div>
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>UID:</div>
                <div className='invite-screen-box-mobile-row-value'>{invite.uid}</div>
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.total'})}:</div>
                <div className='invite-screen-box-mobile-row-value'>{invite.total}</div>
              </div>
            </div>
          ))}
          <Pagination
              firstElemIndex={invitesFirstElemIndex}
              lastElemIndex={invitesLastElemIndex}
              page={currentInvitesPageIndex}
              nextPageExists={invitesNextPageExists}
              onClickPrevPage={onClickInvitesPrevPage}
              onClickNextPage={onClickInvitesNextPage}
          />
        </div>
      )}
    </div>
  );

  const renderCommissionsTab = () => (
    <div>
      {!commissionsFetching && (
        <div>
          {commissionsData.map((commission, index) => (
            <div key={index} className='invite-screen-box-mobile'>
              <div className='invite-screen-box-mobile-date'>
                {commission.created_at}
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>UID:</div>
                <div className='invite-screen-box-mobile-row-value'>{commission.friend_uid}</div>
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.type'})}:</div>
                <div className='invite-screen-box-mobile-row-value'>{commission.reference_type}</div>
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.amount'})}:</div>
                <div className='invite-screen-box-mobile-row-value'>{`${commission.amount} ${commission.currency.toUpperCase()}`}</div>
              </div>
              <div className='invite-screen-box-mobile-row'>
                <div className='invite-screen-box-mobile-row-label'>{intl.formatMessage({ id: 'page.body.invite.total'})}:</div>
                <div className='invite-screen-box-mobile-row-value'>{commission.total}</div>
              </div>
            </div>
          ))}
          <Pagination
              firstElemIndex={commissionsFirstElemIndex}
              lastElemIndex={commissionsLastElemIndex}
              page={currentCommissionsPageIndex}
              nextPageExists={commissionsNextPageExists}
              onClickPrevPage={onClickCommissionsPrevPage}
              onClickNextPage={onClickCommissionsNextPage}
          />
        </div>
      )}
    </div>
  );

  return (
      <React.Fragment>
        <Subheader
          title={intl.formatMessage({ id: 'page.mobile.profile.invite.title' })}
          backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
          onGoBack={() => history.push('/profile')}
        />
        {renderTabs()}
        {tab === intl.formatMessage({ id: 'page.body.invite.invitee_list'}) && renderInvitesTab()}
        {tab === intl.formatMessage({ id: 'page.body.invite.commission_history'}) && renderCommissionsTab()}
        {tab === intl.formatMessage({ id: 'page.body.invite.info'}) && renderInfo()}
      </React.Fragment>
  );
};

export const InvitesScreenMobile = React.memo(ProfileInviteMobileComponent);
