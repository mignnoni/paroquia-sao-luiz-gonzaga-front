import { Header } from '@/components/Header';
import { NoPrivilegies } from '@/components/NoPrivilegies';
import { Sidebar } from '@/components/Sidebar';
import { authStore } from '@/stores/authStore';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export function AdminLayout() {
    const { isAdmin, isAuthenticated, signOut, fetchMemberId } = authStore();

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
                    {isAdmin ? <Outlet /> : <NoPrivilegies />}
                </Flex>
            </Flex>
        </Flex>
    );
}
