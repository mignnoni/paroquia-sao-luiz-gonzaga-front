import { CardSkeleton } from "@/components/Card/CardSkeleton";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { PageHeading } from "@/components/PageHeading";
import { Pagination } from "@/components/Pagination";
import { toaster } from "@/components/ui/toaster";
import type { IPageFilter } from "@/interfaces/IPageFilter";
import { DefaultPage } from "@/layouts/DefaultPage";
import { api } from "@/services/api";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { HStack, Icon, useBreakpointValue, Button } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { LuCirclePlus } from "react-icons/lu";
import type { IListNews } from "@/interfaces/IListNews";
import { OtherScheduleTypes } from "@/constants/OtherScheduleTypes";
import { useNavigate } from "react-router-dom";
import { NewsTable } from "@/components/News/news-table";
import { PiMegaphoneFill } from "react-icons/pi";

export function NewsList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [newsList, setNewsList] = useState<IListNews[]>([]);
  const [filters, setFilters] = useState<IPageFilter>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchNews = useCallback(() => {
    setIsLoaded(false);

    api
      .get<IListNews[]>("otherSchedules", {
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
    api
      .delete("/otherSchedules", {
        params: {
          id: id,
        },
      })
      .then(() => {
        toaster.success({ title: "Comunicado excluído com sucesso" });
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
    navigate("/comunicados/novo");
  };

  const editNews = (id: string) => {
    navigate(`/comunicados/editar/${id}`);
  };

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <DefaultPage>
      <CustomBreadcrumb
        items={[{ title: "Home", link: "/" }]}
        current="Comunicados"
      />
      <HStack my={6} justify={"space-between"}>
        <PageHeading icon={<PiMegaphoneFill />}>Comunicados</PageHeading>
        <Button colorPalette={"brand"} onClick={addNews}>
          <Icon fontSize={"sm"}>
            <LuCirclePlus />
          </Icon>
          Adicionar
        </Button>
      </HStack>
      {isWideVersion && (
        <NewsTable
          isLoaded={isLoaded}
          newsList={newsList}
          deleteAction={handleDelete}
          editAction={editNews}
        />
      )}
      {/* {!isWideVersion && isLoaded && (
        <Stack mt={8} gap={4}>
          <For each={members} fallback={<EmptyList />}>
            {(member) => (
              <PendingMemberCard
                key={member.id}
                member={member}
                deleteAction={handleDelete}
              />
            )}
          </For>
        </Stack>
      )} */}
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
