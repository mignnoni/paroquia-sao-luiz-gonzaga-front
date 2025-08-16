import { CustomBreadcrumb } from "@/components/CustomBreadcrumb";
import { Input } from "@/components/Form/Input";
import { PageHeading } from "@/components/PageHeading";
import { DefaultPage } from "@/layouts/DefaultPage";
import { HStack, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuMegaphone } from "react-icons/lu";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { RichTextEditor } from "@/components/Form/RichTextEditor";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { handleError, type IApiError } from "@/utils/exceptionHandler";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { MultipleFileUpload } from "@/components/File/MultipleFileUpload";
import { ImageThumbnails } from "@/components/File/ImageThumbnails";
import type { AxiosError } from "axios";
import type { IListNews } from "@/interfaces/IListNews";

interface IEditNewsDTO {
  title: string;
  content: string | null;
  files: File[];
  otherScheduleType: number;
}

const editFormSchema = zod.object({
  title: zod
    .string()
    .min(5, "O título deve ter no mínimo 5 caracteres")
    .max(250, "O título deve ter no máximo 250 caracteres"),
  content: zod.string().nullable(),
  files: zod.array(zod.instanceof(File)),
  otherScheduleType: zod.number(),
});

export function EditNews() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm<IEditNewsDTO>({
      resolver: zodResolver(editFormSchema),
      defaultValues: {
        files: [],
        otherScheduleType: 2,
        content: "",
      },
    });

  const { errors, isSubmitting } = formState;

  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const content = watch("content");

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const response = await api.get<IListNews>(`otherSchedules/${id}`);
        const news = response.data;
        reset({
          title: news.title,
          content: news.content ?? "",
          files: [],
          otherScheduleType: 2,
        });
      } catch (error: unknown) {
        handleError(error as AxiosError<IApiError>);
      }
    };
    fetchNews();
  }, [id, reset]);

  const handleClearFile = (file: File) => {
    setFilesToAdd(filesToAdd.filter((f) => f !== file));
  };

  const handleUpdate: SubmitHandler<IEditNewsDTO> = async (data) => {
    if (!id) return;
    try {
      const { title, content, otherScheduleType } = data;
      const form = new FormData();

      form.append("title", title);
      form.append("otherScheduleType", otherScheduleType.toString());
      if (content) form.append("content", content);
      filesToAdd.forEach((file) => {
        form.append("files", file);
      });

      await api.putForm("otherSchedules", form, { params: { id } });
      toaster.success({ title: "Comunicado atualizado com sucesso" });
      navigate("/comunicados");
      reset();
    } catch (error: unknown) {
      handleError(error as AxiosError<IApiError>);
    }
  };

  const handleCancel = () => {
    setFilesToAdd([]);
    reset();
    navigate("/comunicados");
  };

  return (
    <DefaultPage>
      <CustomBreadcrumb
        current={"Editar comunicado"}
        items={[
          { title: "Home", link: "/" },
          { title: "Comunicados", link: "/comunicados" },
        ]}
      />
      <PageHeading icon={<LuMegaphone />} my={6}>
        Editar comunicado
      </PageHeading>
      <Stack
        maxW={"800px"}
        gap={[4, 6]}
        as={"form"}
        onSubmit={handleSubmit(handleUpdate)}
        bg={{ base: "white", _dark: "gray.900" }}
        px={[6, 8]}
        py={[6, 8]}
        rounded={"lg"}
        mb={[36, 10]}
      >
        <Input
          type="text"
          label={"Título"}
          errorText={errors?.title?.message}
          {...register("title")}
        />
        <RichTextEditor
          value={content || ""}
          onChange={(value) => setValue("content", value)}
          label="Descrição"
          errorText={errors?.content?.message}
          placeholder="Digite o conteúdo do comunicado aqui..."
        />
        <MultipleFileUpload
          onUpload={setFilesToAdd}
          onClear={handleClearFile}
          label="Carregar novas imagens"
          showList={false}
        />
        <ImageThumbnails files={filesToAdd} onRemove={handleClearFile} />
        <HStack w="full" justify={"flex-end"}>
          <Button
            variant={"outline"}
            w="fit-content"
            px={6}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            colorPalette={"brand"}
            w="fit-content"
            px={6}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Salvar
          </Button>
        </HStack>
      </Stack>
      <Stack minH={"1px"} />
    </DefaultPage>
  );
}
