import React from 'react';
import {useSearchParams} from "react-router-dom";
import Layout from "../components/Layout";
import {HomeContent} from "../components/HomeContent";
import {TradeActionsModal} from "../modal/TradeActionsModal";
import AdvancedSearchModal from "../components/AdvancedSearchModal";
import DashboardModal from "../components/DashboardModal";

const Support: React.FC = () => {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'default';
    return (
        <Layout>
            {view === 'default' && <HomeContent/>}
            {view === 'actions' && <TradeActionsModal/>}
            {view === 'search' && <AdvancedSearchModal isOpen={true} onClose={() => window.history.back()} />}
            {view === 'dashboard' && <DashboardModal isOpen={true} onClose={() => window.history.back()} />}
        </Layout>
    );
};

export default Support;

