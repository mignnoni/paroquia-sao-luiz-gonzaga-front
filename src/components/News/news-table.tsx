import { ActionButtons } from "@/components/ActionButtons";
import { BaseTable } from "@/components/BaseTable";
import { EmptyList } from "@/components/EmptyList";
import { TableLeftCell } from "@/components/Table/TableLeftCell";
import { TableMidleCell } from "@/components/Table/TableMidleCell";
import { TableRightCell } from "@/components/Table/TableRightCell";
import { TableRow } from "@/components/Table/TableRow";
import { TableSkeleton } from "@/components/Table/TableSkeleton";
import type { IListNews } from "@/interfaces/IListNews";
import { For } from "@chakra-ui/react";
import { DateTime } from "luxon";

interface NewsTableProps {
  newsList: IListNews[];
  isLoaded: boolean;
  deleteAction: (id: string) => void;
  editAction?: (id: string) => void;
}

export function NewsTable({
  newsList,
  isLoaded,
  deleteAction,
  editAction,
}: NewsTableProps) {
  return (
    <>
      <BaseTable headers={["Título", "Criado em"]}>
        {newsList && isLoaded && newsList.length > 0 && (
          <For each={newsList}>
            {(news) => (
              <TableRow key={news.id}>
                <TableLeftCell>{news.title}</TableLeftCell>
                <TableMidleCell>
                  {DateTime.fromISO(news.createdAt)
                    .setLocale("pt-BR")
                    .toLocaleString(DateTime.DATETIME_MED)}
                </TableMidleCell>
                <TableRightCell>
                  <ActionButtons
                    id={news.id}
                    alertDescription={
                      "Tem certeza de que você deseja excluir o comunicado?"
                    }
                    alertTitle={"Excluir comunicado"}
                    editAction={editAction}
                    deleteAction={deleteAction}
                  />
                </TableRightCell>
              </TableRow>
            )}
          </For>
        )}
      </BaseTable>
      {!isLoaded && <TableSkeleton count={10} />}
      {(!newsList || newsList.length == 0) && isLoaded && <EmptyList />}
    </>
  );
}
