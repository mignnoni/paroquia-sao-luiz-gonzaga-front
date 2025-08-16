import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { PageHeading } from '@/components/PageHeading';
import { DefaultPage } from '@/layouts/DefaultPage';
import { MassSchedulesSection } from '@/components/MassLocations/Schedules/mass-schedules-section';
import { PiChurchFill } from 'react-icons/pi';
import { HStack, Stack } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { massStore } from '@/stores/massStore';
import { useEffect } from 'react';
import { api } from '@/services/api';
import type { IMassLocation } from '@/interfaces/IMassLocation';
import { handleError, type IApiError } from '@/utils/exceptionHandler';
import type { AxiosError } from 'axios';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AddressAutocomplete } from '@/components/Form/AddressAutocomplete';
import { Input } from '@/components/Form/Input';
import { Field } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { toaster } from '@/components/ui/toaster';
import { CardSkeleton } from '@/components/Card/CardSkeleton';

interface IEditMassLocationDTO {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isHeadquarters: boolean;
}

const updateFormSchema = zod.object({
    name: zod
        .string()
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(250, 'O nome deve ter no máximo 250 caracteres'),
    address: zod
        .string()
        .min(10, 'O endereço deve ter no mínimo 10 caracteres')
        .max(500, 'O endereço deve ter no máximo 500 caracteres'),
    latitude: zod.number().min(-90).max(90),
    longitude: zod.number().min(-180).max(180),
    isHeadquarters: zod.boolean(),
});

export function EditMassLocation() {
    const { id } = useParams();
    const { massLocation, setMassLocation } = massStore();

    const navigate = useNavigate();

    const { register, handleSubmit, formState, reset, setValue, watch } = useForm<IEditMassLocationDTO>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            name: massLocation.name,
            address: massLocation.address,
            latitude: massLocation.latitude,
            longitude: massLocation.longitude,
            isHeadquarters: massLocation.isHeadquarters,
        },
    });

    const { errors, isSubmitting } = formState;

    const handleCancel = () => {
        reset();
        navigate('/matriz-e-capelas');
    };

    const fetchMassLocation = async () => {
        try {
            const { data } = await api.get<IMassLocation>(`/massLocations/${id}`);
            console.log(data);
            setMassLocation(data);
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleUpdate: SubmitHandler<IEditMassLocationDTO> = async (data) => {
        try {
            await api.put(`/massLocations/${massLocation.id}`, data);
            setMassLocation({
                ...massLocation,
                ...data,
            });
            toaster.success({ title: 'Matriz/capela atualizada com sucesso' });
            navigate('/matriz-e-capelas');
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleAddressSelect = (address: string, latitude: number, longitude: number) => {
        setValue('address', address);
        setValue('latitude', latitude);
        setValue('longitude', longitude);
    };

    useEffect(() => {
        fetchMassLocation();
    }, []);

    return (
        <DefaultPage>
            <CustomBreadcrumb items={[{ title: 'Home', link: '/' }]} current="Matriz e capelas" />
            <PageHeading icon={<PiChurchFill />}>Matriz e capelas</PageHeading>
            {!massLocation.id && <CardSkeleton count={10} />}
            {massLocation.id && (
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
                    <Input
                        type="text"
                        label="Nome da matriz/capela"
                        errorText={errors?.name?.message}
                        placeholder="Ex: Igreja Matriz São Luiz Gonzaga"
                        {...register('name')}
                    />

                    <AddressAutocomplete
                        label="Endereço completo"
                        onAddressSelect={handleAddressSelect}
                        errorText={errors?.address?.message}
                        placeholder="Digite o endereço completo..."
                    />

                    <Field label="Matriz?">
                        <Switch
                            checked={watch('isHeadquarters')}
                            onCheckedChange={(details) => setValue('isHeadquarters', details.checked)}
                        >
                            Marque se esta é a matriz da paróquia
                        </Switch>
                    </Field>
                    <MassSchedulesSection />
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
        </DefaultPage>
    );
}
