import { Routes, Route } from 'react-router-dom';
import { PendingMembers } from './pages/admin/pending-members';
import { AdminLayout } from './layouts/AdminLayout';
import Login from './pages/access/login';
import ForgotPassword from './pages/access/forgot-password';
import ResetPassword from './pages/access/reset-password';
import CreateAccount from './pages/access/create-account';
import { EditMember } from './pages/admin/edit-member';
import { Members } from './pages/admin/members';
import { ManagerLayout } from './layouts/ManagerLayout';
import { Profile } from './pages/profile';
import { AddNews } from './pages/news/add-news';
import { NewsList } from './pages/news/news-list';
import { EditNews } from './pages/news/edit.news';
import { MassLocationsList } from './pages/massLocations/mass-locations-list';
import { AddMassLocation } from './pages/massLocations/add-mass-location';
import { EditMassLocation } from './pages/massLocations/edit-mass-location';

export function Router() {
    return (
        <Routes>
            <Route path="admin" element={<AdminLayout />}>
                <Route path="membros">
                    <Route path="convites" element={<PendingMembers />} />
                    <Route path="" element={<Members />} />
                    <Route path="editar/:id" element={<EditMember />} />
                </Route>
            </Route>
            <Route path="" element={<ManagerLayout />}>
                <Route path="perfil" element={<Profile />} />
                <Route path="comunicados">
                    <Route path="novo" element={<AddNews />} />
                    <Route path="editar/:id" element={<EditNews />} />
                    <Route path="" element={<NewsList />} />
                </Route>
                <Route path="matriz-e-capelas">
                    <Route path="novo" element={<AddMassLocation />} />
                    <Route path="editar/:id" element={<EditMassLocation />} />
                    <Route path="" element={<MassLocationsList />} />
                </Route>
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="criar-conta" element={<CreateAccount />} />
            <Route path="recuperar-senha" element={<ForgotPassword />} />
            <Route path="redefinir-senha" element={<ResetPassword />} />
        </Routes>
    );
}
