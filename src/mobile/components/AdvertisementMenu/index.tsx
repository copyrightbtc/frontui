import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { selectUserLoggedIn } from "../../../modules";
import SelectP2PFilter from "../../../components/SelectP2PFilter";

const AdvertisementMenu = () => {
    const intl = useIntl();
    const history = useHistory();
    const isLoggedIn = useSelector(selectUserLoggedIn);
    return isLoggedIn ? (
        <div className="flex justify-between gap-2 p-3">
            <Link to="/p2p/advertisements/create" className="btn-navigate h-8">
                {intl.formatMessage({ id: "page.body.p2p.advertisement.action.new_ads" })}
            </Link>
            <div className="flex flex-col gap-2">
                <SelectP2PFilter
                    isActionList
                    fixedWidth={150}
                    placeholder="Others"
                    options={[
                        {
                            value: "/p2p/myads",
                            label: intl.formatMessage({ id: "page.body.p2p.advertisement.action.my_ads" })
                        },
                        {
                            value: "/p2p/orders",
                            label: intl.formatMessage({ id: "page.body.p2p.advertisement.content.orders" })
                        },
                        {
                            value: "/p2p/my-payments",
                            label: intl.formatMessage({ id: "page.body.p2p.advertisement.content.payments" })
                        }
                    ]}
                    onChange={(value) => history.push(value)}
                />
            </div>
        </div>
    ) : null;
};

export default AdvertisementMenu;