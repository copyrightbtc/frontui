import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FillSpinner } from "react-spinners-kit";
import { NoResultData } from 'src/components';
import { localeDate } from "../../../helpers";
import Pagination from "../../../components/P2PTrading/Pagination";
import { advertiserFeedbackFetch, selectAdvertiserFeedbacks, selectAdvertisers, selectAdvertisersLoading } from "../../../modules/public/advertiser";
import { useIntl } from "react-intl";
import { LikeIcon } from "../../../assets/images/LikeIcon";


export const MobileFeedbacks = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const limit = 25;
    const [page, setPage] = useState<number>(1);

    const advertiser = useSelector(selectAdvertisers);
    const advertiserLoading = useSelector(selectAdvertisersLoading);
    const feedbacks = useSelector(selectAdvertiserFeedbacks);

    useEffect(() => {
        if (advertiser) {
            dispatch(advertiserFeedbackFetch({ uid: advertiser.uid, page, limit }))
        }
    }, [page, advertiser])

    console.log(feedbacks);

    return (
        <div className="w-full flex flex-col px-3">
            {feedbacks.length ? (
                <table className="p2p-table">
                    <thead>
                        <tr>
                            <th>
                                <p>{intl.formatMessage({ id: "page.body.p2p.advertisement.content.feedbacks" })}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <img width={24} height={24} className="avatar bg-white" src="https://www.svgrepo.com/show/452030/avatar-default.svg" alt="" />
                                            <p className="font-semibold">{feedback.username}</p>
                                            <p>{localeDate(feedback.created_at, "date")}</p>
                                            {feedback.rate === "positive" ? <LikeIcon className="text-green-400" /> : <LikeIcon className="dislike-icon text-red-400" />}
                                        </div>
                                        <div className="flex gap-2">
                                            <p>{feedback.message}</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
            {advertiserLoading ? <div className="spinner-loader-center"><FillSpinner size={19} color="var(--color-accent)"/></div> : !feedbacks.length ? <NoResultData /> : null}
            <div className="p-4">
                <Pagination onlyNextPrev isEndOfData={feedbacks.length < limit} currentPage={page ?? 1} totalPages={1} onPageChange={setPage} />
            </div>
        </div>
    )
}