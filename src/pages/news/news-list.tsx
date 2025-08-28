import { CardSkeleton } from '@/components/Card/CardSkeleton';
import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { PageHeading } from '@/components/PageHeading';
import { Pagination } from '@/components/Pagination';
import { toaster } from '@/components/ui/toaster';
import type { IPageFilter } from '@/interfaces/IPageFilter';
import { DefaultPage } from '@/layouts/DefaultPage';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { HStack, Icon, useBreakpointValue, Button, Stack, For } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LuCirclePlus } from 'react-icons/lu';
import { OtherScheduleTypes } from '@/constants/OtherScheduleTypes';
import { useNavigate } from 'react-router-dom';
import { PiMegaphoneFill } from 'react-icons/pi';
import type { IOtherSchedule } from '@/interfaces/IOtherSchedule';
import { OtherSchedulesTable } from '@/components/OtherSchedules/other-schedules-table';
import { OtherSchedulesCard } from '@/components/OtherSchedules/other-schedules-card';
import { EmptyList } from '@/components/EmptyList';

export function NewsList() {
    const isWideVersion = useBreakpointValue({
        base: false,
        md: true,
    });

    const navigate = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
    const [newsList, setNewsList] = useState<IOtherSchedule[]>([]);
    const [filters, setFilters] = useState<IPageFilter>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchNews = useCallback(() => {
        setIsLoaded(false);

        api.get<IOtherSchedule[]>('otherSchedules', {
            params: {
                ...filters,
                type: OtherScheduleTypes.News,
            },
        })
            .then((resp) => setNewsList(resp.data))
            .catch((err) => handleError(err))
            .finally(() => setIsLoaded(true));
    }, [filters]);

    const handleDelete = (id: string): void => {
        api.delete(`/otherSchedules/${id}`)
            .then(() => {
                toaster.success({ title: 'Comunicado excluído com sucesso' });
                filter();
            })
            .catch((err: AxiosError<IApiError>) => {
                handleError(err);
            });
    };

    const setPageSize = (pageSize: number) => {
        setFilters((state: IPageFilter) => {
            return {
                ...state,
                pageSize,
            };
        });
    };

    const setPageIndex = (pageIndex: number) => {
        setFilters((state: IPageFilter) => {
            return {
                ...state,
                pageIndex,
            };
        });
    };

    const filter = () => {
        if (filters.pageIndex == 0) fetchNews();
        else setPageIndex(0);
    };

    const addNews = () => {
        navigate('/comunicados/novo');
    };

    const editNews = (id: string) => {
        navigate(`/comunicados/editar/${id}`);
    };

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return (
        <DefaultPage>
            <CustomBreadcrumb items={[{ title: 'Home', link: '/' }]} current="Comunicados" />
            <HStack my={6} justify={'space-between'}>
                <PageHeading icon={<PiMegaphoneFill />}>Comunicados</PageHeading>
                <Button colorPalette={'brand'} onClick={addNews}>
                    <Icon fontSize={'sm'}>
                        <LuCirclePlus />
                    </Icon>
                    Adicionar
                </Button>
            </HStack>
            {isWideVersion && (
                <OtherSchedulesTable
                    isLoaded={isLoaded}
                    otherSchedulesList={newsList}
                    deleteMessage="o comunicado"
                    deleteAction={handleDelete}
                    editAction={editNews}
                />
            )}
            {!isWideVersion && isLoaded && (
                <Stack mt={8} gap={4}>
                    <For each={newsList} fallback={<EmptyList />}>
                        {(news) => (
                            <OtherSchedulesCard
                                key={news.id}
                                otherSchedule={news}
                                deleteAction={handleDelete}
                                editAction={editNews}
                            />
                        )}
                    </For>
                </Stack>
            )}
            {!isWideVersion && !isLoaded && <CardSkeleton count={10} />}
            <Pagination
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                pageIndex={filters.pageIndex}
                pageSize={filters.pageSize}
            />
        </DefaultPage>
    );
}
