import { Header } from '@/components/Header';
import { NoPrivilegies } from '@/components/NoPrivilegies';
import { Sidebar } from '@/components/Sidebar';
import { authStore } from '@/stores/authStore';
import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export function ManagerLayout() {
    const { isAuthenticated, signOut, fetchMemberId, canManageContracts } = authStore();

    if (!isAuthenticated) {
        signOut();
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchMemberId();
        }
    }, [isAuthenticated]);

    return (
        <Flex maxH={'100vh'} flexDir={'column'} overflow={'hidden'}>
            <Header />
            <Flex h={'calc(100vh - 80px)'} overflow={'hidden'}>
                <Sidebar />
                <Flex w="full" justify={'center'} overflowY={'auto'}>
                    {canManageContracts ? <Outlet /> : <NoPrivilegies />}
                </Flex>
            </Flex>
        </Flex>
    );
}
