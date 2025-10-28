import React from 'react';
import {useSearchParams} from "react-router-dom";
import Layout from "../components/Layout";
import {HomeContent} from "../components/HomeContent";
import {TradeBlotterModal} from "../modal/TradeBlotterModal";
import {TradeActionsModal} from "../modal/TradeActionsModal";
import AdvancedSearchModal from "../components/AdvancedSearchModal";
import DashboardModal from "../components/DashboardModal";
import TradeValidationModal from "../components/TradeValidationModal";
import {getDefaultTrade} from "../utils/tradeUtils";

const TraderSales = () => {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'default';

    return (
        <div>
            <Layout>
                {view === 'default' && <HomeContent/>}
                {view === 'actions' && <TradeActionsModal/>}
                {view === 'history' && <TradeBlotterModal/>}
                {view === 'search' && <AdvancedSearchModal isOpen={true} onClose={() => window.history.back()} />}
                {view === 'dashboard' && <DashboardModal isOpen={true} onClose={() => window.history.back()} />}
                {view === 'validation' && <TradeValidationModal isOpen={true} onClose={() => window.history.back()} trade={getDefaultTrade()} mode="create" />}
            </Layout>
        </div>
    );
};

export default TraderSales;
