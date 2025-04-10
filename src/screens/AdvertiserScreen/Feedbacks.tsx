import React, { useEffect, useState } from "react";
import { FillSpinner } from "react-spinners-kit";
import { useIntl } from 'react-intl';
import { advertiserFeedbackFetch, selectAdvertiserFeedbacks, selectAdvertisers, selectAdvertisersLoading } from "../../modules/public/advertiser";
import { useDispatch, useSelector } from "react-redux";
import { NoResultData } from 'src/components';
import { localeDate } from "../../helpers";
import Pagination from "../../components/P2PTrading/Pagination";
import { LikeIcon } from "../../assets/images/LikeIcon";
import { TabPanelUnderlines } from '../../components';


export const Feedbacks = () => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const limit = 25;
    const [page, setPage] = useState<number>(1);
    const [ currentTabIndex, setCurrentTabIndex ] = useState(0);

    const advertiser = useSelector(selectAdvertisers);
    const advertiserLoading = useSelector(selectAdvertisersLoading);
    const feedbacks = useSelector(selectAdvertiserFeedbacks);

    useEffect(() => {
        if (advertiser) {
            dispatch(advertiserFeedbackFetch({ uid: advertiser.uid, page, limit }))
        }
    }, [page, advertiser])
 
    const positiveFeedbackCount = advertiser.positive_feedback_count ?? 0;
    const negativeFeedbackCount = advertiser.negative_feedback_count ?? 0;
    const totalFeedback = (positiveFeedbackCount) + (negativeFeedbackCount);

    const positiveFeedbackRate = positiveFeedbackCount > 0 ? Math.round((positiveFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;
    const negativeFeedbackRate = negativeFeedbackCount > 0 ? Math.round((negativeFeedbackCount) * 100 * 100 / totalFeedback) / 100 : 0;

    const ProgressBarPositive = () => {
        const containerStyles = {
          height: '9px',
          width: '130px',
          borderRadius: '4px',
          background: 'var(--color-grey)',
          overflow: 'hidden',
          marginLeft: '12px'
        }
      
        const labelStyles = {
          padding: 5,
          backgroundColor: 'var(--color-success)',
          width: `${positiveFeedbackRate}%`,
        }
      
        return (
          <div style={containerStyles}>
              <div style={labelStyles}></div>
          </div>
        );
    };

    const ProgressBarNegative = () => {
        const containerStyles = {
          height: '9px',
          width: '130px',
          borderRadius: '4px',
          background: 'var(--color-grey)',
          overflow: 'hidden',
          marginLeft: '12px'
        }
      
        const labelStyles = {
          padding: 5,
          backgroundColor: 'var(--color-danger)',
          width: `${negativeFeedbackRate}%`,
        }
      
        return (
          <div style={containerStyles}>
              <div style={labelStyles}></div>
          </div>
        );
    };
    
    const allFeedbacks = () => {
        return (
            <React.Fragment>
            {feedbacks.map((feedback, index) => (
                <div key={index} className="body">
                    <div key={index} className="body__top">
                        <div className="avatar">{feedback.username ? feedback.username.charAt(0).toUpperCase() : 'A'}</div>
                        <div className="name">{feedback.username ? feedback.username : formatMessage({ id: 'page.body.profile.username.anonymous' })}</div>
                        <div className="date">{localeDate(feedback.created_at, "date")}</div>
                    </div>
                    <div className="body__bottom">
                        <div className="icon">
                            {feedback.rate === "positive" ? <LikeIcon className="positive" /> : <LikeIcon className="negative" />}
                        </div>
                        <p>{feedback.message}</p>
                    </div>
                </div>
            ))}
            </React.Fragment>
        )
    }

    const posFeedbacks = () => {
        return (
            <React.Fragment>
            {feedbacks.map((feedback, index) => (
                feedback.rate === "positive" ? 
                    <div key={index} className="body">
                        <div key={index} className="body__top">
                            <div className="avatar">{feedback.username ? feedback.username.charAt(0).toUpperCase() : 'A'}</div>
                            <div className="name">{feedback.username ? feedback.username : formatMessage({ id: 'page.body.profile.username.anonymous' })}</div>
                            <div className="date">{localeDate(feedback.created_at, "date")}</div>
                        </div>
                        <div className="body__bottom">
                            <div className="icon">
                                <LikeIcon className="positive" />
                            </div>
                            <p>{feedback.message}</p>
                        </div>
                    </div>
                : null
            ))}
            </React.Fragment>
        )
    }

    const negFeedbacks = () => {
        return (
            <React.Fragment>
            {feedbacks.map((feedback, index) => (
                feedback.rate === "negative" ? 
                    <div key={index} className="body">
                        <div key={index} className="body__top">
                            <div className="avatar">{feedback.username ? feedback.username.charAt(0).toUpperCase() : 'A'}</div>
                            <div className="name">{feedback.username ? feedback.username : formatMessage({ id: 'page.body.profile.username.anonymous' })}</div>
                            <div className="date">{localeDate(feedback.created_at, "date")}</div>
                        </div>
                        <div className="body__bottom">
                            <div className="icon">
                                <LikeIcon className="negative" />
                            </div>
                            <p>{feedback.message}</p>
                        </div>
                    </div>
                : null
            ))}
            </React.Fragment>
        )
    }

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? allFeedbacks() : null,
            label: formatMessage({ id: 'page.body.p2p.advertisement.content.feedbacks.button.all' }),
        },
        {
            content: currentTabIndex === 1 ? posFeedbacks() : null,
            label: <React.Fragment>{formatMessage( { id: 'page.body.p2p.advertisement.content.feedbacks.button.positive' })} ({positiveFeedbackCount})</React.Fragment>,
        },
        {
            content: currentTabIndex === 2 ? negFeedbacks() : null,
            label: <React.Fragment>{formatMessage( { id: 'page.body.p2p.advertisement.content.feedbacks.button.negative' })} ({negativeFeedbackCount})</React.Fragment>,
        },
    ];

    if (advertiserLoading) return <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div>;
    //if (!feedbacks.length) return <NoResultData title={formatMessage({ id: 'page.noDataToShow.feedbacks' })} class="themes"/>;
    
    return (
        <div className="p2pscreen__feedbacks">
            <div className="p2pscreen__feedbacks__statistics">
                <div className="left">
                    <span>{positiveFeedbackRate} %</span>
                    <p>{formatMessage({ id: 'page.body.p2p.advertisement.content.feedbacks.total' })}{totalFeedback}</p>
                </div>
                <div className="right">
                    <div className="cell positive">
                        <LikeIcon />
                        <ProgressBarPositive />
                        <p>{positiveFeedbackCount}</p>
                    </div>
                    <div className="cell negative">
                        <LikeIcon />
                        <ProgressBarNegative />
                        <p>{negativeFeedbackCount}</p>
                    </div>
                </div>
            </div>
            {feedbacks.length ? (
                <div className="p2pscreen__feedbacks__table">
                    <TabPanelUnderlines
                        panels={renderTabs()}
                        currentTabIndex={currentTabIndex}
                        onCurrentTabChange={setCurrentTabIndex}
                        themes={true} 
                        borders={true}
                    />
                </div>
            ) : null}
            {advertiserLoading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : !feedbacks.length ? <NoResultData title={formatMessage({ id: 'page.noDataToShow.feedbacks' })} class="themes"/> : null}
            <div className="p-4">
                <Pagination onlyNextPrev isEndOfData={feedbacks.length < limit} currentPage={page ?? 1} totalPages={1} onPageChange={setPage} />
            </div>
        </div>
    )
}