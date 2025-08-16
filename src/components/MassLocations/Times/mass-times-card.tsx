import { Tag } from '@/components/ui/tag';
import type { IMassTime } from '@/interfaces/IMassTime';
import { HStack, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { AddMassTimeModal } from './add-mass-time-modal';
import { massStore } from '@/stores/massStore';
import { api } from '@/services/api';
import type { AxiosError, AxiosResponse } from 'axios';
import { handleError, type IApiError } from '@/utils/exceptionHandler';

interface ICreateMassTimeDTO {
    time: string;
}

export function MassTimesCard({ massScheduleId }: { massScheduleId: string }) {
    const { open, onOpen, onClose } = useDisclosure();
    const { massLocation, addMassTime, removeMassTime } = massStore();

    const massTimes = massLocation.massSchedules.find((schedule) => schedule.id === massScheduleId)?.massTimes;

    const handleConfirm = async (time: string) => {
        try {
            const { data } = await api.post<ICreateMassTimeDTO, AxiosResponse<IMassTime>>(
                `massLocations/${massLocation.id}/massSchedules/${massScheduleId}/massTimes`,
                {
                    time,
                }
            );

            addMassTime({
                id: data.id,
                massScheduleId,
                time,
            });
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        } finally {
            onClose();
        }
    };

    const handleRemoveMassTime = async (id: string) => {
        try {
            await api.delete(`massLocations/${massLocation.id}/massSchedules/${massScheduleId}/massTimes/${id}`);
            removeMassTime(massScheduleId, id);
        } catch (error) {
            handleError(error as AxiosError<IApiError>);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Stack>
            <HStack gap={2} mb={2} mt={1}>
                <Text fontSize={'sm'}>Horários</Text>
            </HStack>
            {!massTimes || massTimes.length === 0 ? (
                <Tag
                    rounded={'full'}
                    px={3}
                    py={1}
                    cursor={'pointer'}
                    w="fit-content"
                    colorPalette={'brand'}
                    onClick={onOpen}
                >
                    <HStack>
                        <LuPlus />
                        Novo
                    </HStack>
                </Tag>
            ) : (
                <HStack gap={2}>
                    {massTimes.map((massTime) => (
                        <Tag
                            rounded={'full'}
                            w="fit-content"
                            onClose={() => handleRemoveMassTime(massTime.id)}
                            key={massTime.id}
                            px={3}
                            py={1}
                            colorPalette={'orange'}
                        >
                            {massTime.time}
                        </Tag>
                    ))}
                    <Tag
                        rounded={'full'}
                        px={3}
                        py={1}
                        cursor={'pointer'}
                        w="fit-content"
                        colorPalette={'brand'}
                        onClick={onOpen}
                    >
                        <HStack>
                            <LuPlus />
                            Novo
                        </HStack>
                    </Tag>
                </HStack>
            )}
            <AddMassTimeModal isOpen={open} onCancel={handleCancel} onConfirm={handleConfirm} />
        </Stack>
    );
}
