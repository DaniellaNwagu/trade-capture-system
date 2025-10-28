import React from 'react';
import {useSearchParams} from "react-router-dom";
import Layout from "../components/Layout";
import {HomeContent} from "../components/HomeContent";
import {TradeActionsModal} from "../modal/TradeActionsModal";
import {StaticDataActionsModal} from "../modal/StaticDataActionsModal";
import AdvancedSearchModal from "../components/AdvancedSearchModal";
import DashboardModal from "../components/DashboardModal";

const MiddleOffice = () => {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'default';
    return (
        <Layout>
            {view === 'default' && <HomeContent/>}
            {view === 'actions' && <TradeActionsModal/>}
            {view === 'static' && <StaticDataActionsModal/>}
            {view === 'search' && <AdvancedSearchModal isOpen={true} onClose={() => window.history.back()} />}
            {view === 'dashboard' && <DashboardModal isOpen={true} onClose={() => window.history.back()} />}
        </Layout>
    );
};

export default MiddleOffice;

