import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { Input } from '@/components/Form/Input';
import { PageHeading } from '@/components/PageHeading';
import { DefaultPage } from '@/layouts/DefaultPage';
import { HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuMegaphone } from 'react-icons/lu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as zod from 'zod';
import { RichTextEditor } from '@/components/Form/RichTextEditor';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { MultipleFileUpload } from '@/components/File/MultipleFileUpload';
import type { AxiosError } from 'axios';
import { OtherScheduleTypes } from '@/constants/OtherScheduleTypes';
import type { INewsById } from '@/interfaces/INewsById';
import { ImagePreviewCard } from '@/components/Files/image-preview-card';

interface IEditNewsDTO {
    title: string;
    content: string | null;
    filesToAdd: File[];
    filesToRemove: string[];
    type: number;
}

const editFormSchema = zod.object({
    title: zod
        .string()
        .min(5, 'O título deve ter no mínimo 5 caracteres')
        .max(250, 'O título deve ter no máximo 250 caracteres'),
    content: zod.string().nullable(),
    filesToAdd: zod.array(zod.instanceof(File)),
    filesToRemove: zod.array(zod.string()),
    type: zod.number(),
});

export function EditNews() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [news, setNews] = useState<INewsById | null>(null);

    const { register, handleSubmit, formState, reset, setValue, watch } = useForm<IEditNewsDTO>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            title: '',
            filesToAdd: [],
            filesToRemove: [],
            type: OtherScheduleTypes.News,
            content: '',
        },
    });

    const { errors, isSubmitting } = formState;

    const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
    const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
    const content = watch('content');

    useEffect(() => {
        const fetchNews = async () => {
            if (!id) return;
            try {
                const response = await api.get<INewsById>(`otherSchedules/${id}`);
                setNews(response.data);
                reset({
                    title: response.data.title,
                    content: response.data.content ?? '',
                    filesToAdd: [],
                    filesToRemove: [],
                    type: response.data.type,
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

    const handleRemoveFile = (id: string) => {
        if (!news) return;
        setNews({
            ...news,
            files: news.files.filter((file) => file.id !== id),
        });
        setFilesToRemove([...filesToRemove, id]);
    };

    const handleUpdate: SubmitHandler<IEditNewsDTO> = async (data) => {
        if (!id) return;
        try {
            const { title, content, type } = data;
            const form = new FormData();

            form.append('title', title);
            form.append('type', type.toString());

            if (content) form.append('content', content);

            filesToAdd.forEach((file) => {
                form.append('filesToAdd', file);
            });

            if (filesToRemove && filesToRemove.length > 0) {
                filesToRemove.forEach((file) => {
                    form.append('filesToRemove', file);
                });
            }

            await api.putForm(`otherSchedules/${id}`, form);
            toaster.success({ title: 'Comunicado atualizado com sucesso' });
            navigate('/comunicados');
            reset();
        } catch (error: unknown) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleCancel = () => {
        setFilesToAdd([]);
        reset();
        navigate('/comunicados');
    };

    return (
        <DefaultPage>
            <CustomBreadcrumb
                current={'Editar comunicado'}
                items={[
                    { title: 'Home', link: '/' },
                    { title: 'Comunicados', link: '/comunicados' },
                ]}
            />
            <PageHeading icon={<LuMegaphone />} my={6}>
                Editar comunicado
            </PageHeading>
            {!news?.id && (
                <Stack>
                    <Spinner />
                </Stack>
            )}
            {news?.id && (
                <Stack
                    maxW={'800px'}
                    gap={[4, 6]}
                    as={'form'}
                    onSubmit={handleSubmit(handleUpdate)}
                    bg={{ base: 'white', _dark: 'gray.900' }}
                    px={[6, 8]}
                    py={[6, 8]}
                    rounded={'lg'}
                    mb={[36, 10]}
                >
                    <Input type="text" label={'Título'} errorText={errors?.title?.message} {...register('title')} />
                    <RichTextEditor
                        value={content || ''}
                        onChange={(value) => setValue('content', value)}
                        label="Descrição"
                        errorText={errors?.content?.message}
                        placeholder="Digite o conteúdo do comunicado aqui..."
                    />
                    <Stack>
                        <Text fontSize={'md'} fontWeight={'bold'} mb={2} color={'brand.400'}>
                            Imagens já disponíveis
                        </Text>
                        {news.files.length == 0 && (
                            <Text fontSize={'sm'} color={{ base: 'gray.700', _dark: 'gray.400' }}>
                                Nenhuma imagem informada
                            </Text>
                        )}
                        {news.files.length > 0 &&
                            news.files.map((file) => (
                                <ImagePreviewCard
                                    key={file.id}
                                    file={file}
                                    onRemove={() => handleRemoveFile(file.id)}
                                    allowChanges={true}
                                />
                            ))}
                    </Stack>
                    <MultipleFileUpload
                        onUpload={setFilesToAdd}
                        onClear={handleClearFile}
                        label="Carregar novas imagens"
                    />
                    <HStack w="full" justify={'flex-end'}>
                        <Button variant={'outline'} w="fit-content" px={6} onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            colorPalette={'brand'}
                            w="fit-content"
                            px={6}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            Salvar
                        </Button>
                    </HStack>
                </Stack>
            )}
            <Stack minH={'1px'} />
        </DefaultPage>
    );
}
