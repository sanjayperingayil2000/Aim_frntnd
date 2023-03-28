import { Routes, Route, Navigate } from "react-router-dom";
import { createContext, useState } from "react";
import BlankLayout from "../layout/BlankLayout";
import DefaultLayout from "../layout/DefaultLayout";
import ErrorLayout from "../layout/ErrorLayout";
import TokenService from "../services/tokenService";

import Login from "../auth/Login/Login";
import Forgot from "../auth/Forgot/Forgot";
import ResetPassword from "../auth/ResetPassword/ResetPassword";
import AssetRegister from "../pages/AssetRegister/AssetRegister";
import AssetNew from "../pages/AssetRegister/AssetNew";
import AssetEdit from "../pages/AssetRegister/AssetEdit";
import AssetLocator from "../pages/AssetLocator/AssetLocator";
import UserManagement from "../pages/UserManagement/UsersList";
import UsersEdit from "../pages/UserManagement/UsersEdit";
import UsersNew from "../pages/UserManagement/UsersNew";
import WorkOrder from "../pages/WorkOrder/WorkOrder";
import WorkEdit from "../pages/WorkOrder/WorkEdit";
import WorkNew from "../pages/WorkOrder/WorkNew";
import Planner from "../pages/Planner/Planner";
import ExpiredLink from "../pages/Errors/ExpiredLink";
import NotFound from "../pages/Errors/NotFound";

import InspectionOverview from "../pages/Dashboard/InspectionOverview/InspectionOverview";
import InspectionStatistics from "../pages/Dashboard/InspectionStatistics/InspectionStatistics";
import FailureTrendAnalysis from "../pages/Dashboard/FailureTrendAnalysis/FailureTrendAnalysis";
import AssetConditionAnalysis from "../pages/Dashboard/AssetConditionAnalysis/AssetConditionAnalysis";
import DefectCoverage from "../pages/Dashboard/DefectCoverage/DefectCoverage";
import RepairOverview from "../pages/Dashboard/RepairOverview/RepairOverview";
import ActivitiesOverdue from "../pages/Dashboard/ActivitiesOverdue/ActivitiesOverdue";
import ProjectPlanActual from "../pages/Dashboard/ProjectPlanActual/ProjectPlanActual";
import Home from "../pages/AssetLocator/home";
import UserLicence from "../pages/UserManagement/UserLicence";
import UserDeviceList from "../pages/UserManagement/UserDeviceList";
import MailEnv from "../pages/UserManagement/MailEnv";
const MyContext = createContext();
const AppRoutes = () => {
  const currentUser = TokenService.getUser();
  const [myState, setMyState] = useState(false);

  return (
    <>
      {console.log(myState)}
      <MyContext.Provider value={{ myState, setMyState }}>
        <Routes>
          {/* Blank Layout */}
          <Route element={<BlankLayout />}>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route
              path="/login"
              element={
                currentUser ? (
                  <Navigate replace to="/dashboard/inspection-overview" />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Error Layout */}
          <Route element={<ErrorLayout />}>
            <Route path="/reset-password/invalid" element={<ExpiredLink />} />
            <Route path="/404" element={<NotFound />} />
          </Route>

          {/* Default Layout */}
          <Route element={<DefaultLayout myState={myState} />}>
            <Route path="/asset-register" element={<AssetRegister />} />
            <Route path="/asset-register/add" element={<AssetNew />} />
            <Route path="/asset-register/edit/:_id" element={<AssetEdit />} />
            <Route path="/asset-locator" element={<Home />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/user-management/edit/:_id" element={<UsersEdit />} />
            <Route path="/user-management/add" element={<UsersNew />} />
            <Route path="/work-order" element={<WorkOrder />} />
            <Route path="/work-order/edit/:_id" element={<WorkEdit />} />
            <Route path="/work-order/add" element={<WorkNew />} />
            <Route path="/inspections-repairs-planner" element={<Planner />} />
            <Route
              path="/dashboard/inspection-overview"
              element={<InspectionOverview />}
            />
            <Route
              path="/dashboard/inspection-statistics"
              element={<InspectionStatistics />}
            />
            <Route
              path="/dashboard/failure-trend-analysis"
              element={<FailureTrendAnalysis />}
            />
            <Route
              path="/dashboard/asset-condition-analysis"
              element={<AssetConditionAnalysis />}
            />
            <Route
              path="/dashboard/defect-coverage"
              element={<DefectCoverage />}
            />
            <Route
              path="/dashboard/repair-overview"
              element={<RepairOverview />}
            />
            <Route
              path="/dashboard/activities-overdue"
              element={<ActivitiesOverdue />}
            />
            <Route
              path="/dashboard/project-plan-vs-actual"
              element={<ProjectPlanActual />}
            />
            <Route
              path="/user-management/licence-updation"
              element={<UserLicence />}
            />
            <Route
              path="/user-management/device-list"
              element={<UserDeviceList />}
            />
            <Route path="/user-management/mail-env" element={<MailEnv />} />
          </Route>
        </Routes>
      </MyContext.Provider>
    </>
  );
};

export default AppRoutes;
export { MyContext };
